import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { KeyFilterModule } from 'primeng/keyfilter';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from 'primeng/calendar';
import { MessagesModule} from 'primeng/messages';
import { MessageModule} from 'primeng/message';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ContextMenuModule } from 'primeng/contextmenu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CurrencyMaskModule } from 'ng2-currency-mask';

import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { EditItemComponent } from './item/edit-item/edit-item.component';
import { ListItemComponent } from './item/list-item/list-item.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { TableModule } from 'primeng/table';
import { BooleanPipePipe } from './shared/boolean-pipe.pipe';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    EditItemComponent,
    ListItemComponent,
    HeaderComponent,
    HomeComponent,
    BooleanPipePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
    BreadcrumbModule,
    KeyFilterModule,
    InputTextModule,
    BrowserAnimationsModule,
    InputMaskModule,
    InputSwitchModule,
    CalendarModule,
    ReactiveFormsModule,
    MessagesModule,
    MessageModule,
    CurrencyMaskModule,
    DropdownModule,
    CardModule,
    ToastModule,
    TableModule,
    DialogModule,
    ContextMenuModule,
    ButtonModule,
    PanelModule,
    SplitButtonModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
