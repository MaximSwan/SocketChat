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

  deleteThisRoom(room) {
    this.removeRoom.emit(room);
  }

  getThisRoom(room) {
    this.getRoom.emit(room);
  }

  ngOnInit() {
  }

}
