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
    private socketService: SocketService,
  ) {
  } 

  login;
  password;
  toggleUserFail = this.socketService.toggleUserFail;
  vk: boolean = false;

  async logIn() {
    if (!this.login || !this.password) {
      return alert('Введите все данные');
    }
    let user = new User(this.login, this.password);
    if (this.vk == true) {
      this.socketService.logInNowVk(user);
    } else {  
      this.socketService.logInNow(user);
    }

  }


  ngOnInit() {
  }

}
