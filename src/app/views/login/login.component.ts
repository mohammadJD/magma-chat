import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../core/_services";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {first} from "rxjs/operators";
import {FormService} from "../../core/_services/form.service";
import {ToastrGlobalService} from "../../core/_services/toastr-global.service";
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit{
  public form: FormGroup;
  returnUrl: string;
  loading = false;
  submitted = false;

  constructor(
    private auth:AuthenticationService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _formService: FormService,
    private toastr: ToastrGlobalService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.email])
      ],
      password:['', [Validators.required, Validators.minLength(3)]]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(){
    const user = {
      email: this.form.controls['email'].value,
      password: this.form.controls['password'].value
    };

    this.submitted = true;
    const controls = this.form.controls;
    // stop here if form is invalid
    if (this.form.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.spinner.show();

    this.auth.login(user.email, user.password)
      .pipe(first())
      .subscribe(
        data => {
          this.toastr.success('Welcome To Chatilo');
          this.spinner.hide();
          this.router.navigate([this.returnUrl]);
        },
        error => {
          let err = error.error;
          this.toastr.error(err.message);
          this.spinner.hide();
        });


  }

  isControlHasError(controlName: string, validationType: string){
    return this._formService.isControlHasError(this.form,controlName ,validationType, this.submitted );
  }
}
