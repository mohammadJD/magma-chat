import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../core/_services";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {FormService} from "../../core/_services/form.service";
import {ToastrGlobalService} from "../../core/_services/toastr-global.service";
import {NgxSpinnerService} from "ngx-spinner";
import {first} from "rxjs/operators";
import {ConfirmPasswordValidator} from "../../core/_services/confirm-password.validator";

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit{
  public form: FormGroup;
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
      name:['',Validators.required],
      email: ['', Validators.compose([
        Validators.required,
        Validators.email])
      ],
      password:['', [Validators.required,  Validators.pattern('^(?=.*?[A-Z])(?=.*?[@$!%*#?&])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')]],
      password_confirmation:['', [Validators.required]]
    },{
    validator: ConfirmPasswordValidator.MatchPassword
  });
  }

  onSubmit(){
    const user = {
      name: this.form.controls['name'].value,
      email: this.form.controls['email'].value,
      password: this.form.controls['password'].value,
      password_confirmation: this.form.controls['password_confirmation'].value
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

    this.auth.register(user)
      .pipe(first())
      .subscribe(
        data => {
          this.toastr.success('User Created Successfully');
          this.spinner.hide();
          this.router.navigate(['login']);
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
