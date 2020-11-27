import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupsComponent } from './groups.component';
import {GroupsRoutingModule} from './groups-routing.module';
import {DataTablesModule} from "angular-datatables";
import {ModalModule} from "ngx-bootstrap/modal";
import {PopoverModule} from "ngx-bootstrap/popover";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxSpinnerModule} from "ngx-spinner";
import {SpinnerModule} from "../components/spinner/spinner.module";


@NgModule({
  declarations: [GroupsComponent],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    DataTablesModule,
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    ReactiveFormsModule,
    NgxSpinnerModule,
    FormsModule,
    SpinnerModule,
  ]
})
export class GroupsModule { }
