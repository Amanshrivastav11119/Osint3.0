import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ImageSearchService {
  private apiUrl = 'http://localhost:3001/search.json';

  // Add your SerpAPI key here
  private apiKey = '922b4b2653e2f10d9c8e791badad848f1095c108fd41af3732e93b856da0e80c';

  constructor(private http: HttpClient) {}

  searchByImage(imageUrl: string) {
    const params = new HttpParams({
      fromObject: {
        engine: 'google_reverse_image',
        image_url: imageUrl,
        api_key: this.apiKey,
      },
    });

    return this.http.get(this.apiUrl, { params });
  }
}
