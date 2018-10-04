import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../../services/socket/socket.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  constructor(
    private socket: SocketService
  ) {
    let userCurrent: any = localStorage.getItem('userToken');
    if(userCurrent == null) {
      return;
    }
    userCurrent = atob(userCurrent);
    userCurrent = JSON.parse(userCurrent);
    this.user = userCurrent.username;

    this.loadRooms();

    socket.on('roomDelete').subscribe(
      data => {
        this.rooms.splice(this.rooms.indexOf(data), 1);
      }
    )

    socket.on('room').subscribe(
      data => {
        this.rooms.push(data.name);
      }
    );

    socket.on('rooms').subscribe(
      data => {
        this.rooms.splice(0, this.rooms.length);
        for (let i = 0; i < data.length; i++) {
          const elem = data[i];
          this.rooms.push(elem.name);
        }
      }
    );

  }

  toggleAdd: boolean = false;
  nameRoom;
  rooms = [];
  user;
  loadRooms() {
    this.socket.emit('rooms', 'getRooms').subscribe();
  }

  onRemoveRoom(event) {
    this.socket.emit('roomDelete', event).subscribe(
      data => {
        console.log('Success', data);
      },
      error => {
        console.log('Error', error);
      },
      () => {
        console.log('complete');
      }
    );
  }

  addRoom() {
    this.socket.emit('room', this.nameRoom).subscribe(
      data => {
        console.log('Success', data);
      },
      error => {
        console.log('Error', error);
      },
      () => {
        console.log('complete');
      }
    )

  }

  logOut() {
    localStorage.removeItem('userToken');
  }

  ngOnInit() {
  }

}
