import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../../services/socket/socket.service';
import { User } from '../../../services/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    private socket: SocketService,
  ) { }

  login;
  password;
  toggleSignup:boolean = false;

  signUp() {
    if(this.toggleSignup == true) {
      return alert('Вы уже зарегестрировались');
    }
    if (!this.login || !this.password) {
      return alert('Введите все данные')
    }
    let user = new User(this.login, this.password);
    this.socket.signUpNow(user);
    this.login = '';
    this.password = '';
    this.toggleSignup = true;
  }

  ngOnInit() {
  }

}
