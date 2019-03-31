import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditItemComponent } from './item/edit-item/edit-item.component';
import { ListItemComponent } from './item/list-item/list-item.component';
import { HomeComponent } from './home/home.component';
import { CanDeactivateGuard } from './shared/can-deactivate-guard.service';

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'items', component: ListItemComponent },
    { path: 'items/new', component: EditItemComponent, canDeactivate: [CanDeactivateGuard], data: { edit: false } },
    { path: 'items/:name', component: EditItemComponent, canDeactivate: [CanDeactivateGuard], data: { edit: true} },
    { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  declarations: []
})
export class AppRoutingModule { }
