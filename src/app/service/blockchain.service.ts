import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  private baseUrl = 'http://localhost:3001'; // Replace with your server URL

  constructor(private http: HttpClient) { }

  getBalance(active: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/balance?active=${active}`);
  }

  getMultiaddr(active: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/multiaddr?active=${active}`);
  }

  getRawaddr(address: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/rawaddr?address=${address}`);
  }

  getRawtx(txid: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/rawtx?txid=${txid}`);
  }

  getRawblock(blockhash: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/rawblock?blockhash=${blockhash}`);
  }
}
