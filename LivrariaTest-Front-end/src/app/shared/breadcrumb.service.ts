import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from 'primeng/primeng';

@Injectable({providedIn: 'root'})
export class BreadcrumbService {
  public breadcrumbBook: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>([]);
  private bookBreadcrumbs: MenuItem[];

  constructor() {
  }

  setBreadcrumbs(page: string, name?: string, id?: string) {
    this.bookBreadcrumbs = [];
    const refList: MenuItem[] = this.getBreadcrumsLink(page, name, id);
    this.breadcrumbBook.next(refList);
  }

  private getBreadcrumsLink(page: string, name?: string, id?: string): MenuItem[] {
    this.bookBreadcrumbs = [];

    switch (page) {
      case 'home':
        this.bookBreadcrumbs.push({ label: 'Home', routerLink: 'home' });
        break;
      case 'new':
        this.bookBreadcrumbs.push({ label: 'Home', routerLink: 'home' });
        this.bookBreadcrumbs.push({ label: 'Novo Livro', routerLink: ['books', 'new'] });
        break;
      case 'list':
        this.bookBreadcrumbs.push({ label: 'Home', routerLink: 'home' });
        this.bookBreadcrumbs.push({ label: 'Listagem de Livros', routerLink: 'books' });
        break;
      case 'edit':
        this.bookBreadcrumbs.push({ label: 'Home' });
        this.bookBreadcrumbs.push({ label: 'Listagem de Livros', routerLink: 'books' });
        this.bookBreadcrumbs.push({ label: 'Editar Livro ' + name, routerLink: ['books', id] });
        break;
      default:
        this.bookBreadcrumbs = [];
    }
    return this.bookBreadcrumbs;
  }
}
