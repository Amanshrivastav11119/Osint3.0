import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private apiUrl = 'https://localhost:7266/api/Account';

  constructor(private http: HttpClient) { }

  // ✅ Signup API (POST)
signup(user: { username: string, email: string, password: string, confirmpassword: string }): Observable<any> {
  return this.http.post(`${this.apiUrl}/signup`, user);
}


  // ✅ Login API (POST)
 login(credentials: { email: string, password: string }): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, credentials);
}

}
