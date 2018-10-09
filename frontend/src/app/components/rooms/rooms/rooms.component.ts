import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../../services/socket/socket.service';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  constructor(
    private socket: SocketService,
    private userService: UserService
  ) {

    this.user = userService.getUser();

    this.loadRooms();

    socket.on('roomDelete').subscribe(
      data => {
        this.rooms.splice(this.rooms.indexOf(data), 1);
      }
    )

    this.socket.on('message').subscribe(
      data => {
        this.messages.push(data);
        this.message = '';
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
  messages = [];
  message;
  toggleWin: boolean = false;
  toggleAdd: boolean = false;
  nameRoom;
  rooms = [];
  names = [];
  user;

  loadRooms() {
    this.socket.emit('rooms', 'getRooms').subscribe();
  }

  onRemoveRoom(event) {
    this.socket.emit('roomDelete', event).subscribe();
  }

  onGetRoom(event) {
    this.toggleWin = true;
    this.names.splice(0, this.names.length);
    this.names.push(event);
    this.messages.splice(0, this.messages.length);
  }

  async writeMessage() {
    if (!this.message) {
      return alert('Вы не можете отправить пустое сообщение');
    }
    await this.socket.emit('message', [this.message, localStorage.getItem('userToken')]).subscribe();
  }

  addRoom() {
    this.socket.emit('room', this.nameRoom).subscribe();
  }

  logOut() {
    localStorage.removeItem('userToken');
  }

  ngOnInit() {
  }

}
