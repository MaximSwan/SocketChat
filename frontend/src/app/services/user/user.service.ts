import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private api: ApiService
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