import { Component, OnInit, OnDestroy } from "@angular/core";
import { BreadcrumbService } from "src/app/shared/breadcrumb.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Book } from "src/app/shared/book.model";
import { BookService } from "src/app/shared/book.service";
import { MessageService } from "primeng/api";
import { CanComponentDeactivate } from "src/app/shared/can-deactivate-guard.service";
import { Observable, Subject } from "rxjs";
import { ActivatedRoute, Data, Router } from "@angular/router";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-edit-book",
  templateUrl: "./edit-book.component.html",
  styleUrls: ["./edit-book.component.css"]
})
export class EditBookComponent
  implements OnInit, OnDestroy, CanComponentDeactivate {
  qtyMask: string;
  bookForm: FormGroup;
  book: Book;
  isEdit: boolean;
  title = "Cadastrar um Livro";
  currentDate = new Date();
  navigateAwaySelection$: Subject<boolean> = new Subject<boolean>();
  private ngUnsubscribe = new Subject();

  constructor(
    private breadcrumbService: BreadcrumbService,
    private bookService: BookService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnDestroy() {
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.route.data.subscribe((data: Data) => {
      this.isEdit = data["edit"];
    });

    if (this.isEdit) {
      const name = this.route.snapshot.params["name"];
      this.book = this.bookService
        .getBook(name)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          (book: Book) => {
            this.book = book;
            if (!this.book) {
              this.router.navigate(["books"]);
              return;
            }
            this.title = "Editar Book " + this.book.name;
          },
          (error: any) => this.alertServerError(error)
        );
    }

    this.bookForm = new FormGroup({
      name: new FormControl(
        { value: this.isEdit ? this.book.name : null},
        Validators.required
      ),
      publisher: new FormControl(
        this.isEdit ? this.book.publisher : null,
        Validators.required
      ),
      author: new FormControl(
        { value: this.isEdit ? this.book.author : null, disabled: true },
        Validators.required
      ),
      isbn: new FormControl(
        { value: this.isEdit ? this.book.isbn : null, disabled: this.isEdit },
        Validators.required
      ),
      price: new FormControl(
        this.isEdit ? this.book.price : null,
        Validators.required
      ),
      publicationDate: new FormControl(
        this.isEdit ? new Date(this.book.publicationDate) : null
      )
    });

    setTimeout(() => {
      if (!this.isEdit) {
        this.breadcrumbService.setBreadcrumbs("new");
        this.bookForm.patchValue({
          unitOfMeasure: { id: "kg", label: "Kilograma" }
        });
      } else {
        this.breadcrumbService.setBreadcrumbs(
          "edit",
          this.route.snapshot.params["name"]
        );
      }
    });
  }

  invalidMDate(control: FormControl): { [s: string]: boolean } {
    if (
      this.bookForm &&
      this.bookForm.controls["validityDate"].value &&
      control.value > this.bookForm.controls["validityDate"].value
    ) {
      return { invalidDate: true };
    }
    return null;
  }

  onSubmit() {
    this.book = new Book(
      "",
      this.bookForm.controls["name"].value,
      this.bookForm.controls["publisher"].value,
      this.bookForm.controls["author"].value,
      this.bookForm.controls["isbn"].value,
      this.bookForm.controls["price"].value,
      this.bookForm.controls["publicationDate"].value
    );

    if (this.isEdit) {
      this.saveBook();
    } else {
      this.bookService
        .checkIfExists(this.book.isbn)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          (isbnExists: boolean) => {
            if (isbnExists) {
              this.messageService.add({
                key: "msg",
                severity: "error",
                summary: "ISBN Repetido",
                detail: "O ISBN " + this.book.isbn + " já está cadastrado no sistema!"
              });
            } else {
              this.saveBook()
            }
          },
          (error: any) => this.alertServerError(error)
        );
    }

    this.saveBook();
  }

  saveBook() {
    this.bookService.saveBook(this.book);
    this.messageService.add({
      key: "msg",
      severity: "info",
      summary: "Book Salvo!",
      detail: "O Book " + this.book.name + " foi salvo com sucesso!"
    });
    this.bookForm.markAsUntouched();
    setTimeout(() => {
      this.router.navigate(["books"]);
    }, 4000);
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.bookForm.touched) {
      this.messageService.add({
        key: "dialog",
        severity: "warn",
        summary: "Cuidado!",
        detail:
          "Você realizou alterações que não foram salvas no livro. Deseja realmente sair dessa página?"
      });
      return this.navigateAwaySelection$;
    } else {
      return true;
    }
  }

  onDeactivateChoose(choice: boolean) {
    if (!choice) {
      this.messageService.clear();
    }
    this.navigateAwaySelection$.next(choice);
  }

  alertServerError(error: any) {
    this.messageService.add({
      key: "msg",
      severity: "error",
      summary: "Erro no servidor",
      detail: error
    });
  }
}
