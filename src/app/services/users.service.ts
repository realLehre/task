import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { User } from '../components/users/user.model';
import { UserDialogComponent } from '../components/user-dialog/user-dialog.component';

@Injectable({ providedIn: 'root' })
export class UserService {
  users = new BehaviorSubject<User[]>([]);
  user = new Subject<User>();
  constructor(private httpService: HttpService, private dialog: MatDialog) {}

  fetchAllUsers() {
    this.httpService
      .getAllUsers()
      .pipe(
        map((data) => {
          const newData = [];
          for (const key in data) {
            newData.push(data[key]);
          }
          return newData;
        })
      )
      .subscribe((result) => {
        this.users.next(result);
      });
  }

  getUser(index: number) {
    this.users.subscribe((users) => {
      users.filter((user, userIndex) => {
        if (userIndex == index) {
          this.user.next(user);
        }
      });
    });
  }

  editUser(index: number) {
    this.users.subscribe((users) => {
      users.filter((user, userIndex) => {
        if (userIndex == index) {
          const dialogRef = this.dialog.open(UserDialogComponent, {
            width: '600px',
            height: '60%',
            data: { user: user, isEditing: true },
          });
        }
      });
    });
  }

  deleteUser(index: number) {
    this.users.subscribe((users) => {
      users = users.filter((user, userIndex) => userIndex != index);
      console.log(users);
    });
  }
}
