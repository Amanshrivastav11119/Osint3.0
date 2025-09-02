import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WhoisService {
    private apiUrl = 'https://zozor54-whois-lookup-v1.p.rapidapi.com/';

    constructor(private http: HttpClient) { }

    getWhoisData(domain: string): Observable<any> {
        const options = this.getOptions('whois', domain);
        return this.http.request('GET', this.apiUrl, options);
    }

    nslookup(domain: string): Observable<any> {
        const options = this.getOptions('nslookup', domain);
        return this.http.request('GET', this.apiUrl, options);
    }

    private getOptions(type: string, domain: string): any {
        const headers = new HttpHeaders({
            'X-RapidAPI-Key': '6edecb7bb9mshd599a23712cf880p1cf31fjsn25beaf1ae3ab',
            'X-RapidAPI-Host': 'zozor54-whois-lookup-v1.p.rapidapi.com'
        });

        const params = {
            domain: domain,
            format: 'json',
            _forceRefresh: '0'
        };

        const url = type === 'whois' ? 'whois' : 'nslookup';

        return {
            headers: headers,
            params: params,
            url: this.apiUrl + url
        };
    }
}
