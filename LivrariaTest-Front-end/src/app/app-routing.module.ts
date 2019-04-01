import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditBookComponent } from './book/edit-book/edit-book.component';
import { ListBookComponent } from './book/list-book/list-book.component';
import { HomeComponent } from './home/home.component';
import { CanDeactivateGuard } from './shared/can-deactivate-guard.service';

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'books', component: ListBookComponent },
    { path: 'books/new', component: EditBookComponent, canDeactivate: [CanDeactivateGuard], data: { edit: false } },
    { path: 'books/:name', component: EditBookComponent, canDeactivate: [CanDeactivateGuard], data: { edit: true} },
    { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  declarations: []
})
export class AppRoutingModule { }
