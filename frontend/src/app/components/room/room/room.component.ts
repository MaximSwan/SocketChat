import { Component, OnInit, Input, Output, EventEmitter, } from '@angular/core';
import { SocketService } from '../../../services/socket/socket.service';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  @Input('myRoom') room;

  @Output() removeRoom = new EventEmitter<string>();

  @Output() getRoom = new EventEmitter<string>();

  @Output() leaveRoom = new EventEmitter<string>();

  constructor(
    private socket: SocketService,
    private userService: UserService
  ) {
    let date = new Date();
    this.dateCurrent = `${date.getHours()}:${date.getMinutes()}`;

    this.user = userService.getUser();
  }
  dateCurrent;
  messages = [];
  message;
  user;
  toogleChat: boolean = false;

  async writeMessage() {
    if (!this.message) {
      return alert('Вы не можете отправить пустое сообщение');
    }
    await this.socket.emit('message', [this.message, localStorage.getItem('userToken')]).subscribe(
      (data) => {
        console.log('Success', data);
      },
      (error) => {
        console.log('Error', error);
      },
      () => {
        console.log('complete');
      }
    );
  }

  deleteThisRoom(room) {
    this.removeRoom.emit(room);
  }

  getThisRoom(room) {
    this.getRoom.emit(room);
  }

  ngOnInit() {
  }

}
