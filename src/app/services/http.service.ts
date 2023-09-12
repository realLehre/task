import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { User } from '../components/users/user.model';

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
        })
      );
  }

  postUsers(users: User[]) {
    this.http.put<User[]>(
      'https://job-task-e8e60-default-rtdb.firebaseio.com/users.json',
      users
    );
  }

  addUser(user: User) {
    return this.http.post(
      'https://job-task-e8e60-default-rtdb.firebaseio.com/users.json',
      user
    );
  }
}
