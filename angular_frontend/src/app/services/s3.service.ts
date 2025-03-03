import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { s3Prefix } from 'src/costants';

@Injectable({
  providedIn: 'root'
})
export class S3Service {

  constructor(private http: HttpClient) { }

  getPhoto(photoUrl:string): Observable<Blob | null> {
    return this.http.get<Blob>(`${s3Prefix}${photoUrl}`).pipe(
      catchError(error => {
        console.error(error);
        return of(null);
      })
    );
  }
}
