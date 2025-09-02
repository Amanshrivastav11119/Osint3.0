import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  private usernameSubject = new BehaviorSubject<string>(localStorage.getItem('username') || '');

  loggedIn$ = this.loggedIn.asObservable();
  username$ = this.usernameSubject.asObservable();

  login(token: string, username: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    this.loggedIn.next(true);
    this.usernameSubject.next(username);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.loggedIn.next(false);
    this.usernameSubject.next('');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
