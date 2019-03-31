import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from 'primeng/primeng';

@Injectable({providedIn: 'root'})
export class BreadcrumbService {
  public breadcrumbItem: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>([]);
  private itemBreadcrumbs: MenuItem[];

  constructor() {
  }

  setBreadcrumbs(page: string, name?: string) {
    this.itemBreadcrumbs = [];
    const refList: MenuItem[] = this.getBreadcrumsLink(page, name);
    this.breadcrumbItem.next(refList);
  }

  private getBreadcrumsLink(page: string, name?: string): MenuItem[] {
    this.itemBreadcrumbs = [];

    switch (page) {
      case 'home':
        this.itemBreadcrumbs.push({ label: 'Home', routerLink: 'home' });
        break;
      case 'new':
        this.itemBreadcrumbs.push({ label: 'Home', routerLink: 'home' });
        this.itemBreadcrumbs.push({ label: 'Novo Item', routerLink: ['items', 'new'] });
        break;
      case 'list':
        this.itemBreadcrumbs.push({ label: 'Home', routerLink: 'home' });
        this.itemBreadcrumbs.push({ label: 'Listagem de Itens', routerLink: 'items' });
        break;
      case 'edit':
        this.itemBreadcrumbs.push({ label: 'Home' });
        this.itemBreadcrumbs.push({ label: 'Listagem de Itens', routerLink: 'items' });
        this.itemBreadcrumbs.push({ label: 'Editar Item ' + name, routerLink: ['items', name ] });
        break;
      default:
        this.itemBreadcrumbs = [];
    }
    return this.itemBreadcrumbs;
  }
}
