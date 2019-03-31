import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../shared/breadcrumb.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private breadcrumbService: BreadcrumbService) { }

  ngOnInit() {
    setTimeout(() => {
      this.breadcrumbService.setBreadcrumbs('home');
    });
  }

}
