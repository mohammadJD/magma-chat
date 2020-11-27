import {Injectable} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Injectable({providedIn: 'root'})
export class FormService {

  constructor(
  ) {
  }

  isControlHasError(form: FormGroup,controlName: string, validationType: string, submitted:boolean): boolean {
    const control = form.controls[controlName];
    if (!control) {
      return false;
    }
    return control.hasError(validationType) && (control.dirty || control.touched) && submitted;
  }
}
