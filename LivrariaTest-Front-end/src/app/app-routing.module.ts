import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { EditBookComponent } from './book/edit-book/edit-book.component';
import { ListBookComponent } from './book/list-book/list-book.component';
import { HomeComponent } from './home/home.component';
import { CanDeactivateGuard } from './shared/can-deactivate-guard.service';
import { Observable } from 'rxjs';
import { Book } from './shared/book.model';
import { BookService } from './shared/book.service';

@Injectable()
export class BookResolver implements Resolve<Observable<Book>> {
  constructor(private bookService: BookService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Book> {
    return this.bookService.getBook(route.params.id);
  }
}

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'books', component: ListBookComponent },
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
  providers: [BookResolver, BookService]
})
export class AppRoutingModule { }
