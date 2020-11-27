import {Component} from '@angular/core';
import { navItems } from '../../_nav';
import {AuthenticationService} from "../../core/_services";

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems = navItems;

  constructor(
    private auth:AuthenticationService,
  ) {
  }
  logout(){
    this.auth.logout();
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
}
