import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastrGlobalService {

  constructor(
    private toastr: ToastrService,
  ) { }

  success(message) {
    this.toastr.success(message, 'Success!');
  }

  error(message){
    this.toastr.error(message,'Error!');
  }
}
