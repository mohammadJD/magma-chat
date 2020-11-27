import {Component, OnInit} from '@angular/core';
import { PusherService } from '../../core/_services/pusher.service';
import {GroupApi} from "../../core/_api/group-api";
import {NgxSpinnerService} from "ngx-spinner";
import {AuthenticationService} from "../../core/_services";


interface Message {
  text: string;
  user: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages: Array<Message>;
  userName;
  messageText;

  user;

  groupsDetails = [];

  constructor(
    private pusherService: PusherService,
    private _groupApi: GroupApi,
    private spinner: NgxSpinnerService,
    private auth:AuthenticationService,
  ) {
    this.messages = [];
    this.user = this.auth.currentUserValue;
  }

  ngOnInit() {
    this.pusherService.messagesChannel.bind('client-new-message', (message) => {
      this.messages.push(message);
    });

    // this.initGroupDetails();
  }

  sendMessage() {
    const message: Message = {
      user: this.user.email,
      text: this.messageText,
    }
    this.pusherService.messagesChannel.trigger('client-new-message', message);
    this.messages.push(message);
    this.messageText = '';
  }

  initGroupDetails() {
    this.spinner.show();
    this.groupsDetails = [];
    this._groupApi.getGroupDetails(this.user.user_id).subscribe(resp => {
        this.groupsDetails = resp.groups;

        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      })
  }

}
