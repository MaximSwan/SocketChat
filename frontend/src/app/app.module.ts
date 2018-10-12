import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AppComponent } from './app.component';
import { UserService } from './services/user/user.service';
import { HttpClientModule } from '@angular/common/http';
import { SocketService } from './services/socket/socket.service';
import { LoginComponent } from './components/login/login/login.component';
import { RegisterComponent } from './components/register/register/register.component';

import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { RoomsComponent } from './components/rooms/rooms/rooms.component';
import { RoomComponent } from './components/room/room/room.component';
const appRoute: Routes = [
  {
    path: 'rooms',
    component: RoomsComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    RoomsComponent,
    RoomComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    RouterModule.forRoot(appRoute),
    FormsModule,
  ],
  providers: [UserService, SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
