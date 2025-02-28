import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';
import { BACKEND_URL_PREFIX } from 'src/costants';
import { User } from '../models/user';
import { LoginResponse } from '../utils/loginResponse';
import { S3Service } from './s3.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private s3Service: S3Service
  ) { }

  getUserById(id: number): Observable<User | {message: string, status: string, time: string}> {
    return this.http.get<User>(BACKEND_URL_PREFIX + "/api/user/" + id).pipe(
      catchError(error => {
        console.error(error);
        return of(error.error);
      }),
      map(user => {
        this.s3Service.getPhoto(user.profile_picture_url).subscribe(blob => {
          if(blob != null){
            user.profile_picture_blob_url = URL.createObjectURL(blob);
          }
        })
        return user;
      })
    )
  }

  updateBio(id: number, newBio: string): Observable<boolean> {
    return this.http.patch<User>(`${BACKEND_URL_PREFIX}/api/user`, {id: id, bio: newBio}).pipe(
      map(_ => true),
      catchError(error => {
        console.log(error.error);
        return of(false);
      })
    )
  }

  changePassword(oldPassword: string, newPassword: string): Observable<number> {
    const id = localStorage.getItem("id");
    const email = localStorage.getItem("email");
    if(!id || !email) return of(401);

    // check old password
    return this.http.post<LoginResponse>(`${BACKEND_URL_PREFIX}/api/signin`, {email: email, password: oldPassword}).pipe(
      mergeMap(_ => {
        // change password
        return this.http.patch<User>(`${BACKEND_URL_PREFIX}/api/user`, {id: id, password: newPassword}).pipe(
          map(_ => 200),
          catchError(error => of(error.error.status))
        )
      }),        
      catchError(_ => of(401))
    );   
  }

  updatePicture(pictureFile: File): Observable<boolean> {
    const authToken =  localStorage.getItem("token");
    const formData: FormData = new FormData();
    formData.append('photo', pictureFile);

    return this.http.post<any>(`${BACKEND_URL_PREFIX}/api/user/store_photo`, formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        ContentType: 'multipart/form-data',
        AcceptType: 'application/json'
      }
    }).pipe(
      catchError(error => {
        console.error(error);
        throw error;
      }),
      map(_ => true)
    );
  }
}
