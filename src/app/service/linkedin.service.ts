import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LinkedinService {

  constructor(private http: HttpClient) { }

  private rapidApiKey = '5cdea22255msh0aa19625185a74cp1f6050jsn5a2b57fd7a92';
  private rapidApiHost = 'linkedin-api8.p.rapidapi.com';
  private apiUrl = 'https://linkedin-api8.p.rapidapi.com/get-company-details';


  // Search function
  search(query: string): Observable<any> {
    const options = {
      method: 'GET',
      url: 'https://linkedin-profiles1.p.rapidapi.com/search',
      params: new HttpParams().set('query', query).set('type', 'person'),
      headers: this.getHeaders()
    };

    return this.http.request(options.method, options.url, { params: options.params, headers: options.headers });
  }

  // Extract function
  extract(url: string): Observable<any> {
    if (!url) {
      return throwError('LinkedIn profile URL is not provided.');
    }

    const options = {
      headers: new HttpHeaders({
        'X-RapidAPI-Key': this.rapidApiKey,
        'X-RapidAPI-Host': this.rapidApiHost,
      }),
      params: new HttpParams().set('url', url).set('html', '1')
    };

    return this.http.get('https://linkedin-profiles1.p.rapidapi.com/extract', options)
      .pipe(
        catchError(error => {
          console.error('Error extracting LinkedIn profile:', error);
          return throwError('Error extracting LinkedIn profile.');
        })
      );
  }

  // Get connection count function
  getConnectionCount(username: string): Observable<any[]> {
    const options = {
      headers: new HttpHeaders({
        'X-RapidAPI-Key': this.rapidApiKey,
        'X-RapidAPI-Host': 'linkedin-api8.p.rapidapi.com'
      }),
      params: new HttpParams().set('username', username)
    };

    return this.http.get<any[]>('https://linkedin-api8.p.rapidapi.com/data-connection-count', options);
  }

  // Get company details function

  getCompanyDetails(username: string): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'X-RapidAPI-Key': this.rapidApiKey,
        'X-RapidAPI-Host': this.rapidApiHost,
      }),
      params: new HttpParams().set('username', username)
    };

    return this.http.get(this.apiUrl, { headers: options.headers, params: options.params })
      .pipe(
        catchError(error => {
          console.error('Error fetching company details:', error);
          return throwError('Error fetching company details.');
        })
      );
  }

  // Helper function to get headers
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-RapidAPI-Key': this.rapidApiKey,
      'X-RapidAPI-Host': this.rapidApiHost
    });
  }
}
