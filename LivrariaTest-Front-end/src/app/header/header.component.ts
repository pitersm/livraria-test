import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { BreadcrumbService } from '../shared/breadcrumb.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  crumbs$: Observable<MenuItem[]>;
  crumbs: MenuItem[];

  constructor(private breadcrumb: BreadcrumbService) {
    this.crumbs = [];
  }

  ngOnInit() {
      this.breadcrumb.breadcrumbItem.subscribe((val: MenuItem[]) => {
        if (val) {
          this.crumbs = val;
        }
      });
      this.breadcrumb.setBreadcrumbs('home');
    }
}
