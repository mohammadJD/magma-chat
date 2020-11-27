import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpParams} from '@angular/common/http';
import {TokenService} from './token.service';
import {BaseApiUrl} from "../_config/base-url";
import {Router} from "@angular/router";
// import {UserData} from "../_models/user.model";
// import {HttpOptions} from "../_config/http-options";


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public _login_url = BaseApiUrl + `/login`;
  public _logout_url = BaseApiUrl + `/auth/logout`;
  public _signup_url = BaseApiUrl + `/customer/signup`;
  public _forget_password_url = BaseApiUrl + `/password/email`;
  public _reset_password_url = BaseApiUrl + `/password/reset`;
  public _update_password_url = BaseApiUrl + `/password/update`;
  public usersUrl = BaseApiUrl + `/auth/user`;
  public _update_user = BaseApiUrl + `/customer/update`;

  // private compareListNotifSource = new BehaviorSubject(0);
  // currentCompareListNotif = this.compareListNotifSource.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router,
  ) {
    if (this.get()) {
      // this.changeCompareListNotif();
    }
  }


  loginAccessToken(email, password, remember_me) {
    const headers = new HttpHeaders().set('Accept', 'application/json');
    return this.http.post<any[]>(this._login_url, {
      headers: headers, params: JSON.stringify({
        'email': email,
        'password': password,
        'remember_me': remember_me
      })
    });
  }

  getUser(): Observable<User> {
    return this.http.get<User>(this.usersUrl, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': this.tokenService.get()
      })
    }).pipe();
  }

  login(user): Observable<User> {
    return this.http.post<User>(this._login_url, user, httpOptions).pipe();
  }

  logout() {
    // return this.http.get(this._logout_url, this.tokenService.getHttpOptions()).pipe();
    this.remove();
    this.tokenService.remove();
    this.router.navigate(['/']);
  }

  signup(user): Observable<User> {
    let httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      )
    };
    return this.http.post<User>(this._signup_url, user, httpOptions).pipe();
  }

  forgetPass(user): Observable<User> {
    return this.http.post<User>(this._forget_password_url, user, httpOptions).pipe();
  }

  resetPass(user): Observable<User> {
    return this.http.post<User>(this._reset_password_url, user, httpOptions).pipe();
  }

  updatePass(user): Observable<User> {
    return this.http.post<User>(this._update_password_url, user, this.tokenService.getHttpOptions()).pipe();
  }

  handle(user) {
    this.set(user);
  }

  set(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  get() {
    if (localStorage.getItem("user") == null || localStorage.getItem("user") == undefined || localStorage.getItem("user") == "undefined") {
    } else {
      return JSON.parse(localStorage.getItem('user'));
    }

  }

  remove() {
    localStorage.removeItem('user');
  }

  /*** Update User ***/

  updateUser(user):Observable<any>{
    // let corporate_info = {};
    // if(user.requested_type_id==2){
    //   corporate_info["company_name"] = user.corporate_info.company_name;
    // }
    return this.http.post<any>(this._update_user,
      {
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        sex: user.sex,
        mobile: user.mobile,
        birthday: user.birthday,
        home_address1: user.home_address1,
        home_address2: user.home_address2,
        work_address: user.work_address,
        location_address1: user.location_address1,
        location_address2: user.location_address2,
        photo: user.photo,
        // corporate_info:corporate_info
      },this.tokenService.getHttpOptions());
  }

  /*** End Update User ***/


  /*** WishList ***/

  // changeWishListNotif() {
  //   this.getWishlistProd().subscribe(resp => {
  //     this.wishListNotifSource.next(resp.data.length);
  //   });
  // }

  /*** End WishList ***/

}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  remember_me: boolean;
  created_at: Date;
  updated_at: Date;
}
