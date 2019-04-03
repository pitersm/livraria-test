import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreadcrumbService } from 'src/app/shared/breadcrumb.service';
import { Book } from 'src/app/shared/book.model';
import { MenuItem, MessageService } from 'primeng/api';
import { BookService } from 'src/app/shared/book.service';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-list-book',
  templateUrl: './list-book.component.html',
  styleUrls: ['./list-book.component.css']
})
export class ListBookComponent implements OnInit, OnDestroy {
  books: Book[];
  selectedBook: Book;
  menuItems: MenuItem[];
  displayDialog = false;
  private ngUnsubscribe = new Subject();

  constructor(private breadcrumbService: BreadcrumbService,
    private bookService: BookService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router) {
      this.route.data.subscribe((res: any) => {
        this.books = res.books;
      });
    }

  ngOnInit() {
    setTimeout(() => {
      this.breadcrumbService.setBreadcrumbs('list');
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.complete();
  }

  listBooks() {
    this.bookService.listBooks()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (bookList: Book[]) => this.books = bookList,
        error => this.messageService.add({
          key: 'msg', severity: 'error', summary: 'Erro no servidor',
          detail: error
        }));
  }

  deleteBook(id: string) {
    this.bookService.deleteBook(id)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(() => {
      this.displayDialog = false;
      this.listBooks();
    }, (error: any) => this.messageService.add({
      key: 'msg', severity: 'error', summary: 'Erro no servidor',
      detail: error
    }));
  }

  onRowSelect(event) {
    this.selectedBook = event.data;
    this.displayDialog = true;
  }

  showEdit() {
    const path = this.selectedBook.id;
    this.router.navigate([path], { relativeTo: this.route });
  }

  showAdd() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
