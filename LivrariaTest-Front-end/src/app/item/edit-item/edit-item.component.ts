import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/shared/breadcrumb.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Item } from 'src/app/shared/item.model';
import { ItemService } from 'src/app/shared/item.service';
import { MessageService } from 'primeng/api';
import { CanComponentDeactivate } from 'src/app/shared/can-deactivate-guard.service';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Data, Router } from '@angular/router';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit, CanComponentDeactivate {
  unitsOfMeasure = [{ id: 'kg', label: 'Kilograma' },
  { id: 'lt', label: 'Litro' },
  { id: 'un', label: 'Unidade' }];
  qtyMask: string;
  qtyMaskRegExp: RegExp;
  itemForm: FormGroup;
  measureAbbr: string;
  item: Item;
  isEdit: boolean;
  title = 'Cadastrar um Item';
  currentDate = new Date();
  navigateAwaySelection$: Subject<boolean> = new Subject<boolean>();

  constructor(private breadcrumbService: BreadcrumbService,
    private itemService: ItemService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.route.data.subscribe(
      (data: Data) => {
        this.isEdit = data['edit'];
      });

    if (this.isEdit) {
      const name = this.route.snapshot.params['name'];
      this.item = this.itemService.getItem(name);
      if (!this.item) {
        this.router.navigate(['items']);
        return;
      }
      this.title = 'Editar Item ' + this.item.name;
    }

    this.itemForm = new FormGroup({
      'name': new FormControl({ value: this.isEdit ? this.item.name : null, disabled: this.isEdit }, Validators.required),
      'unitOfMeasure': new FormControl(this.isEdit ? this.item.unitOfMeasure : null, Validators.required),
      'quantity': new FormControl({ value: this.isEdit ? this.item.quantity : null, disabled: true }, [this.checkMask.bind(this)]),
      'perishable': new FormControl(this.isEdit ? this.item.perishable : false, Validators.required),
      'validityDate': new FormControl(this.isEdit ? new Date(this.item.validityDate) : null, this.isExpired.bind(this)),
      'manufactureDate': new FormControl(this.isEdit ? new Date(this.item.manufactureDate) : null,
        [Validators.required, this.invalidMDate.bind(this)]),
      'price': new FormControl(this.isEdit ? this.item.price : null, Validators.required)
    });

    this.itemForm.controls['unitOfMeasure'].valueChanges
      .subscribe(value => {
        switch (value.id) {
          case 'kg':
          case 'lt':
            this.qtyMaskRegExp = new RegExp(/^\d+(\.\d{1,3})?$/);
            this.qtyMask = 'pnum';
            break;
          case 'un':
            this.qtyMaskRegExp = null;
            this.qtyMask = 'pint';
            const qtyVal = this.itemForm.controls['quantity'].value;
            if (qtyVal % 1 !== 0) {
              this.itemForm.controls['quantity'].setValue(Math.trunc(qtyVal));
            }
            break;
        }
        this.itemForm.controls['quantity'].enable();
        this.measureAbbr = value.id;
      });

    this.itemForm.controls['perishable'].valueChanges
      .subscribe(value => {
        if (value) {
          this.itemForm.controls['validityDate'].setValidators([Validators.required, this.isExpired.bind(this)]);
          this.itemForm.controls['validityDate'].updateValueAndValidity();
        } else {
          this.itemForm.controls['validityDate'].setValidators(this.isExpired.bind(this));
          this.itemForm.controls['validityDate'].updateValueAndValidity();
        }
      });

    this.itemForm.controls['validityDate'].valueChanges
      .subscribe(value => {
        this.itemForm.controls['manufactureDate'].updateValueAndValidity();
      });

    setTimeout(() => {
      if (!this.isEdit) {
        this.breadcrumbService.setBreadcrumbs('new');
        this.itemForm.patchValue({
          'unitOfMeasure': { id: 'kg', label: 'Kilograma' }
        });
      } else {
        this.breadcrumbService.setBreadcrumbs('edit', this.route.snapshot.params['name']);
      }
    });
  }

  checkMask(control: FormControl): { [s: string]: boolean } {
    if (this.qtyMaskRegExp && control.value && !this.qtyMaskRegExp.test(control.value)) {
      return { 'wrongFormat': true };
    }
    return null;
  }

  isExpired(control: FormControl): { [s: string]: boolean } {
    if (control.value && control.value <= this.currentDate) {
      return { 'expired': true };
    }
    return null;
  }

  invalidMDate(control: FormControl): { [s: string]: boolean } {
    if (this.itemForm && this.itemForm.controls['validityDate'].value && control.value > this.itemForm.controls['validityDate'].value) {
      return { 'invalidDate': true };
    }
    return null;
  }

  onSubmit() {
    this.item = new Item(
      this.itemForm.controls['name'].value,
      this.itemForm.controls['unitOfMeasure'].value.id,
      this.itemForm.controls['quantity'].value,
      this.itemForm.controls['price'].value,
      this.itemForm.controls['perishable'].value,
      this.itemForm.controls['validityDate'].value,
      this.itemForm.controls['manufactureDate'].value
    );

    if (!this.isEdit && this.itemService.checkIfExists(this.item.name)) {
      this.messageService.add({
        key: 'msg', severity: 'error', summary: 'Item Repetido',
        detail: 'O Item ' + this.item.name + ' já está cadastrado no sistema!'
      });
      return;
    }

    this.itemService.saveItem(this.item);
    this.itemService.showLocalStorage();
    this.messageService.add({
      key: 'msg', severity: 'info', summary: 'Item Salvo!',
      detail: 'O Item ' + this.item.name + ' foi salvo com sucesso!'
    });
    this.itemForm.markAsUntouched();
    setTimeout(() => { this.router.navigate(['items']); }, 4000);
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.itemForm.touched) {
      this.messageService.add({
        key: 'dialog', severity: 'warn', summary: 'Cuidado!',
        detail: 'Você realizou alterações que não foram salvas no item. Deseja realmente sair dessa página?'
      });
      return this.navigateAwaySelection$;
    } else {
      return true;
    }
  }

  onDeactivateChoose(choice: boolean) {
    if (!choice) {
      this.messageService.clear();
    }
    this.navigateAwaySelection$.next(choice);
  }
}
