import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {AuthenticationService} from "./core/_services";

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private auth:AuthenticationService,
  ) { }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    let user = JSON.parse(localStorage.getItem('currentUser'));
    if(user!=null){
      this.auth.setCurrentUser(user);
    }
    console.log("user1");
    console.log(this.auth.currentUserValue);
  }
}
