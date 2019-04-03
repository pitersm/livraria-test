import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { EditBookComponent } from './book/edit-book/edit-book.component';
import { ListBookComponent } from './book/list-book/list-book.component';
import { HomeComponent } from './home/home.component';
import { CanDeactivateGuard } from './shared/can-deactivate-guard.service';
import { Observable } from 'rxjs';
import { Book } from './shared/book.model';
import { BookService } from './shared/book.service';
import { map } from 'rxjs/operators';

@Injectable()
export class BookResolver implements Resolve<Observable<Book>> {
  constructor(private bookService: BookService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Book> {
    return this.bookService.getBook(route.params.id);
  }
}

@Injectable()
export class BookCountResolver implements Resolve<Observable<number>> {
  constructor(private bookService: BookService) {}

  resolve(): Observable<number> {
    return this.bookService.listBooks()
               .pipe(map((list: Book[]) => list.length));
  }
}

@Injectable()
export class BookListResolver implements Resolve<Observable<Book[]>> {
  constructor(private bookService: BookService) {}

  resolve(): Observable<Book[]> {
    return this.bookService.listBooks();
  }
}

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent, resolve: { count: BookCountResolver } },
    { path: 'books', component: ListBookComponent, resolve: { books: BookListResolver } },
    { path: 'books/new', component: EditBookComponent, canDeactivate: [CanDeactivateGuard], data: { edit: false } },
    { path: 'books/:id', component: EditBookComponent, canDeactivate: [CanDeactivateGuard], data: { edit: true},
      resolve: { book: BookResolver} },
    { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  declarations: [],
  providers: [BookResolver, BookService, BookCountResolver, BookListResolver]
})
export class AppRoutingModule { }
