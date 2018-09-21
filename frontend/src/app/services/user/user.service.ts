import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
  ) { }

}

export class User {
  constructor(
    public username: String,
    public password: String,
    public _id?: String
  ) {
  }

}