import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {BaseApiUrl} from "../_config/base-url";
import {Router, RouterStateSnapshot} from "@angular/router";
import {User} from "../_api/user.service";

// import {ConstantsService} from './constants.service';
// import { User } from '../_models';

@Injectable({providedIn: 'root'})

export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  url: string = BaseApiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.currentUserSubject = new BehaviorSubject<any>('');
    this.currentUser = this.currentUserSubject.asObservable();
    let user = JSON.parse(localStorage.getItem('currentUser'));
    if(user!=null){
      this.setCurrentUser(user);
    }
    // this.setHttpOptions();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  public setCurrentUser(user) {
    this.currentUserSubject.next(user);
  }

  public get getToken(): any {
    return this.currentUserSubject.value.token;
  }

  login(email: string, password: string) {
    return this.http.post<any>(this.url + "/login",
      {
        "email": email,
        "password": password
      })
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          user['email'] = email;
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          // localStorage.setItem('currentUser', user);
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }

  register(user): Observable<User> {
    let httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      )
    };
    return this.http.post<User>(this.url+'/user', user, this.getHttpOptionsWithoutAuth()).pipe();
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    let state: RouterStateSnapshot;
    this.router.navigate(['/login']);
  }

  getHttpOptions() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer '+this.getToken });
    return{ headers: headers };

  }

  getHttpOptionsWithoutAuth() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',});
    return{ headers: headers };

  }

  // setHttpOptions() {
  //   this.httpOptions = {
  //     headers: new Headers({
  //       'Content-Type': 'application/json',
  //       'Accept': 'application/json',
  //       'Authorization': 'Bearer '+this.getToken,
  //     })
  //   }
  // }


}
