import { Component } from '@angular/core';
import { UserService } from './services/user/user.service';
import { SocketService } from './services/socket/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private userService: UserService,
    private socket: SocketService
  ) {
  }
}
