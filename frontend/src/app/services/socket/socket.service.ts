import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from "socket.io-client";

@Injectable()
export class SocketService {

  constructor(
  ) {
    this.socket = io(this.host);
    this.socket.on("connect", () => this.connect());
    this.socket.on("disconnect", () => this.disconnect());
    this.socket.on("error", (error: string) => {
      console.log(`ERROR: "${error}" (${this.host})`);
    });
  }

  connect () {
    this.socket.connect();
}
  disconnect () {
    this.socket.disconnect();
}

emit(chanel:string, message:any) {
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

  private host: string = "http://localhost:3000";
  private socket: any;

} 