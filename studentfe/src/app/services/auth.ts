import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  constructor(private http: HttpClient) {}

  BASE = environment.baseUrl;

  register(data: any) {
    return this.http.post(this.BASE + environment.signupUrl, data);
  }

  login(data: any) {
  return this.http.post(this.BASE + environment.loginUrl,data);
}

saveToken(token: string) {
  localStorage.setItem('token', token);
}

getToken() {
  return localStorage.getItem('token');
}

logout() {
  localStorage.removeItem('token');
}

  
}
