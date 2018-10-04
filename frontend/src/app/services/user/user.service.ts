import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
  ) { }

  getUser() {
    let userCurrent: any = localStorage.getItem('userToken');
    if(userCurrent == null) {
      return;
    }
    userCurrent = atob(userCurrent);
    userCurrent = JSON.parse(userCurrent);
    userCurrent = JSON.parse(userCurrent)
    if(userCurrent.response) {
       let user = userCurrent.response[0];
      return user;
      }
    let user = userCurrent.username;
    return user;
  }

}

export class User {
  constructor(
    public username: String,
    public password: String,
    public _id?: String
  ) {
  }

}