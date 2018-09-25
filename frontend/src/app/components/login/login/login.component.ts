import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../../services/socket/socket.service';
import { User } from '../../../services/user/user.service';
import * as CryptoJS from 'crypto-js';
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

  logIn() {
    if (!this.login || !this.password) {
      return alert('Введите все данные');
    }
    let user = new User(this.login, this.password);
    this.socket.emit('login', user).subscribe(
      user => {
        console.log('Success', user);
      },
      error => {
        console.log('Error', error);
      },
      () => {
        console.log('complete');
      }
    )
    this.socket.on('login').subscribe(
      user => {
        
      }
    )
  }


  ngOnInit() {
  }

}
