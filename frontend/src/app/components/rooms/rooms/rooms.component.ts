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
    private socketService: SocketService,
    private userService: UserService
  ) {

    this.user = userService.getUser();

    this.loadRooms();

    let date = new Date();
    this.dateCurrent = `${date.getHours()}:${date.getMinutes()}`;

  }

  messages = this.socketService.messages;
  message;
  dateCurrent;
  toggleWin: boolean = false;
  toggleAdd: boolean = false;
  toggleList: boolean = false;
  nameRoom;
  rooms = this.socketService.rooms;
  names = [];
  user;

  loadRooms() {
    this.socketService.loadRoomsNow();
  }

  onRemoveRoom(event) {
    this.socketService.onRemoveRoomNow(event);
  }

  onGetRoom(event) {
    this.toggleWin = true;
    this.names.splice(0, this.names.length);
    this.names.push(event);
    this.messages.splice(0, this.messages.length);
    this.nameRoom = event;
    this.socketService.getThisRoom(event);
    this.toggleList = true;
  }

  onLeavRoom() {
    this.toggleWin = false;
    this.socketService.onLeaveRoomNow(this.nameRoom);
    this.toggleList = false;
  }

   writeMessage() {
    if (!this.message) {
      return alert('Вы не можете отправить пустое сообщение');
    }
    this.socketService.writeMessageNow(this.message);
    this.message = '';
      
  }

  addRoom() {
    this.socketService.addRoomNow(this.nameRoom);
  }

  logOut() {
    localStorage.removeItem('userToken');
  }

  ngOnInit() {
  }

}
