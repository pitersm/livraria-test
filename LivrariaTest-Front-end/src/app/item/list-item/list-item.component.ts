import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/shared/breadcrumb.service';
import { Item } from 'src/app/shared/item.model';
import { MenuItem, MessageService } from 'primeng/api';
import { ItemService } from 'src/app/shared/item.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css']
})
export class ListItemComponent implements OnInit {
  items: Item[];
  selectedItem: Item;
  menuItems: MenuItem[];
  displayDialog = false;
  constructor(private breadcrumbService: BreadcrumbService,
    private itemService: ItemService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService) { }

  ngOnInit() {
    setTimeout(() => {
      this.breadcrumbService.setBreadcrumbs('list');
    });
    this.items = this.itemService.listItems();
    this.menuItems = [
      {
        label: 'Visualizar', icon: 'pi pi-search',
        command: (event) => this.router.navigate(['/' + this.selectedItem.name], { relativeTo: this.route })
      },
      { label: 'Delete', icon: 'pi pi-times', command: (event) => this.deleteItem(this.selectedItem.name) }
    ];
  }

  deleteItem(name: string) {
    this.itemService.deleteItem(name);
    this.itemService.showLocalStorage();
    this.items = this.itemService.listItems();
  }

  onRowSelect(event) {
    this.selectedItem = event.data;
    this.displayDialog = true;
  }

  showEdit() {
    const path = this.selectedItem.name;
    this.router.navigate([path], {relativeTo: this.route});
  }

  showAdd() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
