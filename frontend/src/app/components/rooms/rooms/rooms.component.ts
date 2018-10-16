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

  }

  messages = this.socket.messages;
  message;
  toggleWin: boolean = false;
  toggleAdd: boolean = false;
  toggleList: boolean = false;
  nameRoom;
  rooms = this.socket.rooms;
  names = [];
  user;

  loadRooms() {
    this.socket.loadRoomsNow();
  }

  onRemoveRoom(event) {
    this.socket.onRemoveRoomNow(event);
  }

  onGetRoom(event) {
    this.toggleWin = true;
    this.names.splice(0, this.names.length);
    this.names.push(event);
    this.messages.splice(0, this.messages.length);
    this.nameRoom = event;
    this.socket.getThisRoom(event);
    this.toggleList = true;
  }

  onLeavRoom() {
    this.toggleWin = false;
    this.socket.onLeaveRoomNow(this.nameRoom);
    this.toggleList = false;
  }

   writeMessage() {
    if (!this.message) {
      return alert('Вы не можете отправить пустое сообщение');
    }
    this.socket.writeMessageNow(this.message);
    this.message = '';
      
  }

  addRoom() {
    this.socket.addRoomNow(this.nameRoom);
  }

  logOut() {
    localStorage.removeItem('userToken');
  }

  ngOnInit() {
  }

}
