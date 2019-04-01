import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/shared/breadcrumb.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Book } from 'src/app/shared/book.model';
import { BookService } from 'src/app/shared/book.service';
import { MessageService } from 'primeng/api';
import { CanComponentDeactivate } from 'src/app/shared/can-deactivate-guard.service';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Data, Router } from '@angular/router';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit, CanComponentDeactivate {
  unitsOfMeasure = [{ id: 'kg', label: 'Kilograma' },
  { id: 'lt', label: 'Litro' },
  { id: 'un', label: 'Unidade' }];
  qtyMask: string;
  qtyMaskRegExp: RegExp;
  bookForm: FormGroup;
  measureAbbr: string;
  book: Book;
  isEdit: boolean;
  title = 'Cadastrar um Book';
  currentDate = new Date();
  navigateAwaySelection$: Subject<boolean> = new Subject<boolean>();

  constructor(private breadcrumbService: BreadcrumbService,
    private bookService: BookService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.route.data.subscribe(
      (data: Data) => {
        this.isEdit = data['edit'];
      });

    if (this.isEdit) {
      const name = this.route.snapshot.params['name'];
      this.book = this.bookService.getBook(name);
      if (!this.book) {
        this.router.navigate(['books']);
        return;
      }
      this.title = 'Editar Book ' + this.book.name;
    }

    this.bookForm = new FormGroup({
      // 'name': new FormControl({ value: this.isEdit ? this.book.name : null, disabled: this.isEdit }, Validators.required),
      // 'unitOfMeasure': new FormControl(this.isEdit ? this.book.unitOfMeasure : null, Validators.required),
      // 'quantity': new FormControl({ value: this.isEdit ? this.book.quantity : null, disabled: true }, [this.checkMask.bind(this)]),
      // 'perishable': new FormControl(this.isEdit ? this.book.perishable : false, Validators.required),
      // 'validityDate': new FormControl(this.isEdit ? new Date(this.book.validityDate) : null, this.isExpired.bind(this)),
      // 'manufactureDate': new FormControl(this.isEdit ? new Date(this.book.manufactureDate) : null,
      //   [Validators.required, this.invalidMDate.bind(this)]),
      'price': new FormControl(this.isEdit ? this.book.price : null, Validators.required)
    });

    this.bookForm.controls['unitOfMeasure'].valueChanges
      .subscribe(value => {
        switch (value.id) {
          case 'kg':
          case 'lt':
            this.qtyMaskRegExp = new RegExp(/^\d+(\.\d{1,3})?$/);
            this.qtyMask = 'pnum';
            break;
          case 'un':
            this.qtyMaskRegExp = null;
            this.qtyMask = 'pint';
            const qtyVal = this.bookForm.controls['quantity'].value;
            if (qtyVal % 1 !== 0) {
              this.bookForm.controls['quantity'].setValue(Math.trunc(qtyVal));
            }
            break;
        }
        this.bookForm.controls['quantity'].enable();
        this.measureAbbr = value.id;
      });

    this.bookForm.controls['perishable'].valueChanges
      .subscribe(value => {
        if (value) {
          this.bookForm.controls['validityDate'].setValidators([Validators.required, this.isExpired.bind(this)]);
          this.bookForm.controls['validityDate'].updateValueAndValidity();
        } else {
          this.bookForm.controls['validityDate'].setValidators(this.isExpired.bind(this));
          this.bookForm.controls['validityDate'].updateValueAndValidity();
        }
      });

    this.bookForm.controls['validityDate'].valueChanges
      .subscribe(value => {
        this.bookForm.controls['manufactureDate'].updateValueAndValidity();
      });

    setTimeout(() => {
      if (!this.isEdit) {
        this.breadcrumbService.setBreadcrumbs('new');
        this.bookForm.patchValue({
          'unitOfMeasure': { id: 'kg', label: 'Kilograma' }
        });
      } else {
        this.breadcrumbService.setBreadcrumbs('edit', this.route.snapshot.params['name']);
      }
    });
  }

  checkMask(control: FormControl): { [s: string]: boolean } {
    if (this.qtyMaskRegExp && control.value && !this.qtyMaskRegExp.test(control.value)) {
      return { 'wrongFormat': true };
    }
    return null;
  }

  isExpired(control: FormControl): { [s: string]: boolean } {
    if (control.value && control.value <= this.currentDate) {
      return { 'expired': true };
    }
    return null;
  }

  invalidMDate(control: FormControl): { [s: string]: boolean } {
    if (this.bookForm && this.bookForm.controls['validityDate'].value && control.value > this.bookForm.controls['validityDate'].value) {
      return { 'invalidDate': true };
    }
    return null;
  }

  onSubmit() {
    this.book = new Book(
      this.bookForm.controls['name'].value,
      this.bookForm.controls['unitOfMeasure'].value.id,
      this.bookForm.controls['quantity'].value,
      this.bookForm.controls['price'].value,
      this.bookForm.controls['perishable'].value,
      this.bookForm.controls['validityDate'].value,
      this.bookForm.controls['manufactureDate'].value
    );

    if (!this.isEdit && this.bookService.checkIfExists(this.book.name)) {
      this.messageService.add({
        key: 'msg', severity: 'error', summary: 'Book Repetido',
        detail: 'O Book ' + this.book.name + ' já está cadastrado no sistema!'
      });
      return;
    }

    this.bookService.saveBook(this.book);
    this.bookService.showLocalStorage();
    this.messageService.add({
      key: 'msg', severity: 'info', summary: 'Book Salvo!',
      detail: 'O Book ' + this.book.name + ' foi salvo com sucesso!'
    });
    this.bookForm.markAsUntouched();
    setTimeout(() => { this.router.navigate(['books']); }, 4000);
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.bookForm.touched) {
      this.messageService.add({
        key: 'dialog', severity: 'warn', summary: 'Cuidado!',
        detail: 'Você realizou alterações que não foram salvas no book. Deseja realmente sair dessa página?'
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
}
