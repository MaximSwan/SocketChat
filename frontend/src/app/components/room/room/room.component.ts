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

    let userCurrent: any = localStorage.getItem('userToken');
    userCurrent = atob(userCurrent);
    userCurrent = JSON.parse(userCurrent);
    this.user = userCurrent.username;
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
    await this.socket.emit('message', this.message).subscribe();
    this.socket.on('message').subscribe(
      data => {
        this.messages.push(data);
      }
    )
    //   this.socket.emit('message', this.message).subscribe(
    //   data => {
    //     console.log('Success', data);
    //   },
    //   error => {
    //     console.log('Error', error);
    //   },
    //   () => {
    //     console.log('complete');
    //   }
    // )
  }

  deleteThisRoom(room) {
    this.removeRoom.emit(room);
  }

  ngOnInit() {
  }

}
