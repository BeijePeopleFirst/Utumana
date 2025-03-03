import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Review } from '../models/review';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BACKEND_URL_PREFIX } from 'src/costants';
import { S3Service } from './s3.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  constructor(
    private http: HttpClient,
    private s3Service: S3Service
  ) { }

  getUserReviews(userId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${BACKEND_URL_PREFIX}/api/review/user/${userId}`, {}).pipe(
      map(reviews => {
        for(let review of reviews){
          if(review.image_user){
            this.s3Service.getPhoto(review.image_user).subscribe(blob => {
              if(blob != null){
                review.user_picture_blob = URL.createObjectURL(blob);
              }
            })
          }
        }
        return reviews;
      })
    );
  }

  acceptReview(id: number): Observable<boolean> {
    return this.http.patch<Review>(`${BACKEND_URL_PREFIX}/api/review/${id}`, {}).pipe(
      map(review => {
        console.log("Review accepted", review);
        return true;
      }),
      catchError(err => {
        console.log("Error trying to accept review: ", err.error);
        return of(false);
      })
    );
  }

  rejectReview(id: number): Observable<boolean> {
    return this.http.delete<string>(`${BACKEND_URL_PREFIX}/api/review/${id}`, {}).pipe(
      map(message => {
        console.log(message);
        return true;
      }),
      catchError(err => {
        console.log("Error trying to accept review: ", err.error);
        return of(false);
      })
    );
  }

  addReview(review :Review):Observable<Review>{
    return this.http.post<Review>(`${BACKEND_URL_PREFIX}/api/review`,review);
  }
}
