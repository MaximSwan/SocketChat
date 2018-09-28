import { Component, OnInit, Input, Output, EventEmitter, } from '@angular/core';
import { SocketService } from '../../../services/socket/socket.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  @Input('myRoom') room;

  @Output() removeRoom = new EventEmitter<string>();

  constructor(
    private socket: SocketService
  ) {
    let date = new Date();
    this.dateCurrent = `${date.getHours()}:${date.getMinutes()}`;
    socket.on('message').subscribe(
      data => {
        this.messages.push(data);
        this.message = '';
      }
    )

    let userCurrent = localStorage.getItem('username');
    userCurrent = atob(userCurrent);
    this.user = userCurrent;
  }
  dateCurrent;
  messages = [];
  message;
  user;
  toogleChat: boolean = false;

  writeMessage() {
    if (!this.message) {
      return alert('Вы не можете отправить пустое сообщение');
    }
    this.socket.emit('message', this.message).subscribe(
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

  deleteThisRoom(room) {
    this.removeRoom.emit(room);
  }

  ngOnInit() {
  }

}
