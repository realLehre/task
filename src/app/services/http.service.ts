import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';

import { User } from '../components/users/user.model';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class HttpService {
  api_url = environment.API_URL;

  constructor(private http: HttpClient) {}

  // *fetch all users from database
  getAllUsers() {
    return this.http.get<User[]>(this.api_url).pipe(
      map((data) => {
        const newData = [];
        for (const key in data) {
          newData.push(data[key]);
        }
        return newData;
      }),
      catchError((err) => {
        return this.handleError(err);
      })
    );
  }

  // * save users to database
  postUsers(users: User[]) {
    return this.http.put<User[]>(this.api_url, users).pipe(
      catchError((err) => {
        return this.handleError(err);
      })
    );
  }

  // * add user to database
  addUser(user: User) {
    return this.http.post(this.api_url, user).pipe(
      catchError((err) => {
        return this.handleError(err);
      })
    );
  }

  // * handle http errors
  handleError(error: any) {
    return throwError(() => {
      return new Error(error);
    });
  }
}
