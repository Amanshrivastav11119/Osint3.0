import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FacebookService {

  private baseUrl = 'http://localhost:3000/api/facebook';

  constructor(private http: HttpClient) { }

  // Method to search Facebook data by keywords
  searchFacebookData(keywords: string): Observable<any> {
    const url = `${this.baseUrl}/news?keywords=${keywords}`;
    return this.http.get(url);
  }

  // Method to fetch keywords
  fetchKeywords(): Observable<any> {
    const url = `${this.baseUrl}/keywords`;
    return this.http.get(url);
  }

  // Method to update a keyword
  updateKeyword(keywordId: string, keywordData: any): Observable<any> {
    const url = `${this.baseUrl}/keywords/${keywordId}`;
    return this.http.put(url, keywordData);
  }

  // Method to delete a keyword
  deleteKeyword(keywordId: string): Observable<any> {
    const url = `${this.baseUrl}/keywords/${keywordId}`;
    return this.http.delete(url);
  }
}
