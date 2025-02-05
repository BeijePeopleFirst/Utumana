import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from '../models/review';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BACKEND_URL_PREFIX } from 'src/costants';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  token: string | null = localStorage.getItem("token");
  httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json; charset=UTF-8', 
        'Accept-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${this.token}` })
    };

  constructor(
    private http: HttpClient
  ) { }

  getUserReviews(userId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${BACKEND_URL_PREFIX}/api/review/user/${userId}`, this.httpOptions);
  }
}
