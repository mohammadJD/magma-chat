import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BaseApiUrl} from "../_config/base-url";

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private iss = {
    login: BaseApiUrl + `/login`,
    signup: BaseApiUrl + `/sign-up`
  };
  public usersUrl = BaseApiUrl + `/user`;
  public httpOptions = {
    withCredentials: true,
    headers:{
      'Accept-Language': 'en, ar',
      'Authorization':'',
    },
    setHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  };

  // public httpOptions = {
  //
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     // 'Accept': 'application/json',
  //     'Authorization': ''
  //   })
  // };
  public httpOptionsWithoutAuth ={
    withCredentials: true,
    headers:{
      'Accept-Language': 'en, ar',
    },
    setHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  };

  constructor(private http: HttpClient) {
    this.setHttpOptions();
    this.setHttpOptionsWithoutAuth();
  }

  handle(token) {
    // const Token = token.token_type + ' ' + token.access_token;
    const Token = token.access_token;
    this.set(Token);
    this.setHttpOptions();
  }

  set(token) {
    localStorage.setItem('token', token);
  }

  get() {
    return localStorage.getItem('token');
  }

  getDev() {
    return localStorage.getItem('dev');
  }

  remove() {
    localStorage.removeItem('token');
    this.setHttpOptions();
  }

  setHttpOptions() {
    // this.httpOptions = {
    //   headers: new HttpHeaders({
    //     'X-Requested-With': 'XMLHttpRequest',
    //     'Authorization': this.get()
    //   })
    // };
    this.httpOptions = {
      withCredentials: true,
      headers: {
        'Accept-Language': 'en, ar',
        'Authorization': 'Bearer '+this.get(),
      },
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }
  }

  setHttpOptionsWithoutAuth() {
  }

  getHttpOptions() {
    return this.httpOptions;
  }

  getHttpOptionsWithoutAuth() {
    return this.httpOptionsWithoutAuth;
  }

  removeHttpOptions() {
    this.httpOptions = null;
  }

  isValid() {

    return false;
  }

  payload(token) {
    const payload = token.split('.')[1];
    return this.decode(payload);
  }

  decode(payload) {
    return JSON.parse(atob(payload));
  }

  loggedIn() {
    const hasToken = this.get();
    if (hasToken) {
      return true;
    } else {
      return false;
    }
    // return this.isValid();
  }
}
