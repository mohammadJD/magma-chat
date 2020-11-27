import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from "rxjs";
import {ModalDirective} from "ngx-bootstrap/modal";
import {FormService} from "../../core/_services/form.service";
import {ToastrGlobalService} from "../../core/_services/toastr-global.service";
import {NgxSpinnerService} from "ngx-spinner";
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DataTableDirective} from "angular-datatables";
import {GroupsModel} from "../../core/_models/groups.model";
import {GroupApi} from "../../core/_api/group-api";

@Component({
  selector: 'app-brands',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit,OnDestroy {

  form: FormGroup;
  submitted = false;
  item:GroupsModel = new GroupsModel();

  @ViewChild('modal') public modal: ModalDirective;
  @ViewChild('confirmModal') public confirmModal: ModalDirective;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger:Subject<any> = new Subject();

  groups = [];
  groupTypes = [];

  addLoading:boolean = false;
  isEdit:boolean = false;

  clickedId:number = -1;

  constructor(
    private _groupApi: GroupApi,
    private fb: FormBuilder,
    private _formService: FormService,
    private toastr: ToastrGlobalService,
    private spinner: NgxSpinnerService,
  ) {

  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };

    this.initForm();
    this.getGroupTypes();
    this.initGroup();
  }

  initForm(){
    this.form = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      group_type_id:['', [Validators.required]],
      maximum_members:['', [Validators.required]],
    });
  }

  getGroupTypes() {
    // this.spinner.show();
    this.groupTypes = [];
    this._groupApi.getGroupTypes().subscribe(resp => {
        this.groupTypes = resp;

        // this.spinner.hide();
      },
      error => {
        // this.spinner.hide();
      })
  }

  initGroup() {
    this.spinner.show();
    this.groups = [];
    this._groupApi.getAll().subscribe(resp => {
        this.groups = resp;
        if(this.groups.length>0){
          this.dtTrigger.next();
        }

        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      })
  }

  getGroupTypeName(id){
    let result = this.groupTypes.filter(f=>
      f.group_type_id === id
    );
    return result[0]?.group_type_name;
  }

  rerenderTable(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  destroyTable(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
    });
  }

  onSubmit(){
    this.submitted = true;
    const controls = this.form.controls;
    // stop here if form is invalid
    if (this.form.invalid) {
      Object.keys(controls).forEach(controlName =>{
          controls[controlName].markAsTouched();
          // console.log("controlName : "+controlName);
          // console.log(controls[controlName].errors);
          // console.log("----------------");
      }
      );
      return;
    }
    this.modal.show();

    this.item.name = controls["name"].value;
    this.item.group_type_id = controls["group_type_id"].value;
    this.item.maximum_members = controls["maximum_members"].value;


    // this.spinner.show();
    this.addLoading = true;

    if(!this.isEdit){ // Add New Item
      this._groupApi.addItem(this.item).subscribe(
        resp => {
          this.toastr.success('Item added successfully');
          setTimeout(()=> {
            // this.spinner.hide();
            // this.groups = [resp.data, ...this.groups];
            // this.rerenderTable();
            this.destroyTable();
            this.initGroup();
            this.addLoading = false;
            this.modal.hide();
            this.resetForm();
          },1000);

        },
        error => {
          let err = error.error;
          this.toastr.error(err.message);
          // this.spinner.hide();
          this.addLoading = false;
        });
    }
    else{ // Edit Item
      this._groupApi.editItem(this.item, this.clickedId).subscribe(
        resp => {
          this.toastr.success('Item updated successfully');
          setTimeout(()=> {
            // this.spinner.hide();
            // this.rerenderTable();
            this.destroyTable();
            this.initGroup();
            this.addLoading = false;
            this.modal.hide();
            this.resetForm();
          },1000);

        },
        error => {
          let err = error.error;
          this.toastr.error(err.message);
          // this.spinner.hide();
          this.addLoading = false;
        });
    }

  }

  resetForm(){
    this.form.reset();
    this.item = new GroupsModel();
    this.submitted = false;
    this.isEdit = false;
    this.clickedId = -1
  }

  editItem(index){
    this.isEdit = true;
    this.initFormWithData(index);
    this.modal.show();
  }

  initFormWithData(index){
    let group = this.groups[index];
    let controls = this.form.controls;

    this.clickedId = group.id;
    this.item.name = group.name;
    this.item.group_type_id = group.group_type_id;
    this.item.maximum_members = group.maximum_members;

    controls["name"].setValue(this.item.name);
    controls["group_type_id"].setValue(this.item.group_type_id);
    controls["maximum_members"].setValue(this.item.maximum_members);
  }

  confirmDelete(id){
    this.confirmModal.show();
    this.clickedId = id;
  }

  deleteItem(isConfirm){
    this.confirmModal.hide();
    if(isConfirm){
      this.spinner.show();
      this._groupApi.deleteItem(this.clickedId).subscribe(
        resp => {
          this.toastr.success('Item deleted successfully');
          this.destroyTable();
          this.initGroup();

          setTimeout(()=> {
            this.spinner.hide();
          },1000);

        },
        error => {
          let err = error.error;
          this.toastr.error(err.message);
          this.spinner.hide();
        });
    }
    else this.clickedId = -1;
  }

  isControlHasError(controlName: string, validationType: string){
    return this._formService.isControlHasError(this.form,controlName ,validationType, this.submitted );
  }



  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
