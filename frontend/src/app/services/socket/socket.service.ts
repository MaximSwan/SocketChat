import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { User } from '../user/user.service';
import { Router } from '@angular/router';

@Injectable()
export class SocketService {

  constructor(
    private router: Router
  ) {
    this.socket = io(this.host);
    this.socket.on('connect', () => this.connect());
    this.socket.on('disconnect', () => this.disconnect());
    this.socket.on('error', (error: string) => {
      console.log(`ERROR: '${error}' (${this.host})`);
    });

    this.on('loginVk').subscribe(
      token => {
        if (token == 'Incorrect') {
          return this.toggleUserFail = true;
        }
        localStorage.setItem('userToken', token);
        this.router.navigate(['rooms'])
      },
      error => {
        console.error(error);
      }
    )

    this.on('login').subscribe(
      token => {
        if (token == 'Incorrect') {
          return this.toggleUserFail = true;
        }
        localStorage.setItem('userToken', token);
        this.router.navigate(['rooms'])
      },
      error => {
        console.error(error);
      },
    )

    this.on('message').subscribe(
      data => {
        this.messages.push(data);
      },
      (error) => {
        console.log('Error', error);
      },
    )

    this.on('getRooms').subscribe(
      data => {
        this.rooms.splice(0, this.rooms.length);
        for (let i = 0; i < data.length; i++) {
          const elem = data[i];
          this.rooms.push(elem.name);
        }
      },
      (error) => {
        console.log('Error', error);
      },
      () => {
        console.log('complete');
      }
    );
    this.on('createRoom').subscribe(
      data => {
        this.rooms.push(data.name);
      },
      (error) => {
        console.log('Error', error);
      },
      () => {
        console.log('complete');
      }
    );
    this.on('deleteRoom').subscribe(
      data => {
       this.rooms.splice(this.rooms.indexOf(data.name), 1);
      },
      (error) => {
        console.log('Error', error);
      },
      () => {
        console.log('complete');
      }
    )

    this.on('checkMessage').subscribe(
      data => {
        this.states.splice(0, this.states.length);
        this.states.push(data);
      },
      (error) => {
        console.log('Error', error);
      },
      () => {
        console.log('complete');
      }
    )

  }

  rooms = [];
  states = [];
  messages = [];
  toggleUserFail: boolean = false;

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  emit(chanel: string, message: any) {
    return new Observable<any>(observer => {
      this.socket.emit(chanel, message, function (data) {
        if (data.success) {
          observer.next(data.msg);
        } else {
          observer.error(data.msg);
        }
        observer.complete();
      });
    });
  }

  on(event_name) {
    return new Observable<any>(observer => {
      this.socket.off(event_name);
      this.socket.on(event_name, (data) => {
        observer.next(data);
      });
    });
  }

  addRoomNow(nameRoom) {
    this.emit('createRoom', nameRoom).subscribe();
  }

  onRemoveRoomNow(event) {
    this.emit('deleteRoom', event).subscribe();
  }

  loadRoomsNow() {
    this.emit('getRooms', 'getRooms').subscribe();
  }

  getThisRoom(event) {
    return this.emit('connectRoom', event).subscribe();
  }

  writeMessageNow(message, nameRoom) {
    return this.emit('message', [message, localStorage.getItem('userToken'), nameRoom]).subscribe();
  }

  onLeaveRoomNow(nameRoom) {
    this.emit('disconnectRoom', nameRoom).subscribe();
  }

  signUpNow(user: User) {
    this.emit('register', user).subscribe();
  }

  logInNow(user) {
    this.emit('login', user).subscribe();
  }

  logInNowVk(user) {
    this.emit('loginVk', user).subscribe();
  }

  chekStateMessage(nameRoom) {
    this.emit('checkMessage', nameRoom).subscribe();
  }

  private host: string = 'http://localhost:3000';
  private socket: any;

} 