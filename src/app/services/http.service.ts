import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';

import { User } from '../components/users/user.model';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpService {
  constructor(private http: HttpClient) {}

  getAllUsers() {
    return this.http
      .get<User[]>(
        'https://job-task-e8e60-default-rtdb.firebaseio.com/users.json'
      )
      .pipe(
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

  postUsers(users: User[]) {
    return this.http
      .put<User[]>(
        'https://job-task-e8e60-default-rtdb.firebaseio.com/users.json',
        users
      )
      .pipe(
        catchError((err) => {
          console.log(err);

          return this.handleError(err);
        })
      );
  }

  addUser(user: User) {
    return this.http.post(
      'https://job-task-e8e60-default-rtdb.firebaseio.com/users.json',
      user
    );
  }

  handleError(error: any) {
    return throwError(() => {
      return new Error(error);
    });
  }
}
