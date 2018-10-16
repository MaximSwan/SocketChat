import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../../services/socket/socket.service';
import { User } from '../../../services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private socket: SocketService,
  ) {
  }

  login;
  password;
  toggleUserFail = this.socket.toggleUserFail;
  vk: boolean = false;

  async logIn() {
    if (!this.login || !this.password) {
      return alert('Введите все данные');
    }
    let user = new User(this.login, this.password);
    if (this.vk == true) {
      this.socket.logInNowVk(user);
    } else {
      this.socket.logInNow(user);
    }

  }


  ngOnInit() {
  }

}
