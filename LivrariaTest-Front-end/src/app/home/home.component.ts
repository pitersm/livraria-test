import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../shared/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  count: number;
  constructor(private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute) {
    this.route.data.subscribe((res: any) => {
      this.count = res.count;
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.breadcrumbService.setBreadcrumbs('home');
    });
  }

}
