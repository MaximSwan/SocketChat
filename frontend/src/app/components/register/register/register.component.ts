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
    if (!this.login || !this.password) {
      return alert('Введите все данные')
    }
    let user = new User(this.login, this.password);
    this.socket.emit('register', user).subscribe(
      (user) => {
        console.log('Success', user);
      },
      (error) => {
        console.log('Error', error);
      },
      () => {
        console.log('complete');
      }
    )
    this.login = '';
    this.password = '';
    this.toggleSignup = true
  }

  ngOnInit() {
  }

}
