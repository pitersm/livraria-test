import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreadcrumbService } from 'src/app/shared/breadcrumb.service';
import { Book } from 'src/app/shared/book.model';
import { MenuItem, MessageService } from 'primeng/api';
import { BookService } from 'src/app/shared/book.service';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import * as Highcharts from 'highcharts';
import { ReportData } from 'src/app/shared/reportData.model';


@Component({
  selector: 'app-list-book',
  templateUrl: './list-book.component.html',
  styleUrls: ['./list-book.component.css']
})
export class ListBookComponent implements OnInit, OnDestroy {
  books: Book[];
  selectedBook: Book;
  menuItems: MenuItem[];
  displayDialog = false;
  private ngUnsubscribe = new Subject();

  constructor(private breadcrumbService: BreadcrumbService,
    private bookService: BookService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router) {
    this.route.data.subscribe((res: any) => {
      this.books = res.books;
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.breadcrumbService.setBreadcrumbs('list');
    });

    this.bookService.getSalesByYear().subscribe((report: ReportData[]) => {
      this.loadChart(report);
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.complete();
  }

  loadChart(report: ReportData[]) {
    Highcharts.chart('container', {
      chart: {
      },
      title: {
          text: 'Average Monthly Temperature and Rainfall in Tokyo'
      },
      subtitle: {
          text: 'Source: WorldClimate.com'
      },
      xAxis: [{
          categories: report.map((r) => r.category),
          crosshair: true
      }],
      yAxis: [{ // Primary yAxis
          labels: {
              format: 'R$ {value}',
              style: {
                  color: Highcharts.getOptions().colors[1]
              }
          },
          title: {
              text: 'Média de Preço',
              style: {
                  color: Highcharts.getOptions().colors[1]
              }
          }
      }, { // Secondary yAxis
          title: {
              text: 'Faturamento Médio',
              style: {
                  color: Highcharts.getOptions().colors[0]
              }
          },
          labels: {
              format: 'R$ {value}',
              style: {
                  color: Highcharts.getOptions().colors[0]
              }
          },
          opposite: true
      }],
      tooltip: {
          shared: true
      },
      legend: {
          layout: 'vertical',
          align: 'left',
          x: 120,
          verticalAlign: 'top',
          y: 100,
          floating: true,
      },
      series: [{
          name: 'Preço Médio',
          type: 'column',
          yAxis: 1,
          data: report.map((r) => r.price),
          tooltip: {
              valuePrefix: 'R$ '
          }
      }, {
          name: 'Temperature',
          type: 'spline',
          data: report.map((r) => r.salesEarnings),
          tooltip: {
              valuePrefix: 'R$ '
          }
      }]
  });
  }

  listBooks() {
    this.bookService.listBooks()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (bookList: Book[]) => this.books = bookList,
        error => this.messageService.add({
          key: 'msg', severity: 'error', summary: 'Erro no servidor',
          detail: error
        }));
  }

  deleteBook(id: string) {
    this.bookService.deleteBook(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.displayDialog = false;
        this.listBooks();
      }, (error: any) => this.messageService.add({
        key: 'msg', severity: 'error', summary: 'Erro no servidor',
        detail: error
      }));
  }

  onRowSelect(event) {
    this.selectedBook = event.data;
    this.displayDialog = true;
  }

  showEdit() {
    const path = this.selectedBook.id;
    this.router.navigate([path], { relativeTo: this.route });
  }

  showAdd() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
