import { Injectable } from '@angular/core';
import { HttpClient, HttpXsrfTokenExtractor, HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  apiUrl: string = 'http://localhost:3000/';  


  constructor(
    private http: HttpClient
  ) { }
}
