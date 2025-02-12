import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from '../models/review';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BACKEND_URL_PREFIX } from 'src/costants';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {


  constructor(
    private http: HttpClient
  ) { }

  getUserReviews(userId: number, offset: number, pageSize: number): Observable<Review[]> {
    // TODO ask for a page of reviews
    return this.http.get<Review[]>(`${BACKEND_URL_PREFIX}/api/review/user/${userId}`);
  }

  addReview(review :Review):Observable<Review>{
    return this.http.post<Review>(`${BACKEND_URL_PREFIX}/api/review`,review);
  }
}
