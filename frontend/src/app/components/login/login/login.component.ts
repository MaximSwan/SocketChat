import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../../services/socket/socket.service';
import { User } from '../../../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private socket: SocketService,
    private router: Router
  ) {
  }

  login;
  password;
  toggleUserFail: boolean = false;
  vk: boolean = false;


  logIn() {
    if (!this.login || !this.password) {
      return alert('Введите все данные');
    }
    let user = new User(this.login, this.password);
    if (this.vk == true) {
      this.socket.emit('loginVk', user).subscribe();

      return this.socket.on('loginVk').subscribe(
        userToken => {
          if (userToken == 'Incorrect') {
            return this.toggleUserFail = true;
          }
          localStorage.setItem('userToken', userToken);
          this.router.navigate(['rooms'])
        },
        error => {
          console.error(error);
        }
      )
    }
    this.socket.emit('login', user).subscribe();

    this.socket.on('login').subscribe(
      userToken => {
        if (userToken == 'Incorrect') {     
          return this.toggleUserFail = true;
        }
        localStorage.setItem('userToken', userToken);
        this.router.navigate(['rooms'])
      },
      error => {
        console.error(error);
      }
    )

  }


  ngOnInit() {
  }

}
