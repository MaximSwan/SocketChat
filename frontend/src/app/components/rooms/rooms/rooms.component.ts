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
  ) { }

  toggleAdd: boolean = false;
  nameRoom;

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

  ngOnInit() {
  }

}
