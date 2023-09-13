import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { User } from '../components/users/user.model';
import { UserDialogComponent } from '../components/user-dialog/user-dialog.component';

@Injectable({ providedIn: 'root' })
export class UserService {
  currentUsers: User[] = [];
  users = new BehaviorSubject<User[]>([]);
  user = new Subject<User>();
  isLoading = new Subject<boolean>();
  isError = new Subject<boolean>();
  constructor(private httpService: HttpService, private dialog: MatDialog) {}

  // * get all users
  fetchAllUsers() {
    this.isLoading.next(true);

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
      .subscribe({
        next: (result) => {
          this.users.next(result);
          this.currentUsers = result;
        },
        error: (err) => {
          this.isLoading.next(false);
          this.isError.next(true);

          console.log(err);
        },
      });
  }

  // * get a single user
  getUser(index: number) {
    this.users.subscribe((users) => {
      users.filter((user, userIndex) => {
        if (userIndex == index) {
          this.user.next(user);
        }
      });
    });
  }

  // * edit user
  editUser(index: number) {
    this.currentUsers.filter((user, userIndex) => {
      if (userIndex == index) {
        const dialogRef = this.dialog.open(UserDialogComponent, {
          width: '600px',
          height: '60%',
          data: { user: user, isEditing: true, index: index },
        });
      }
    });
  }

  // * update user info
  updateUser(user: User, index: number) {
    this.currentUsers[index] = user;
    this.httpService
      .postUsers(this.currentUsers)
      .subscribe((data) => this.fetchAllUsers());
  }

  // * delete user
  deleteUser(index: number) {
    if (confirm('Delete user?')) {
      this.currentUsers = this.currentUsers.filter(
        (user, userIndex) => userIndex != index
      );
      this.httpService
        .postUsers(this.currentUsers)
        .subscribe((data) => this.fetchAllUsers());
    }
  }

  // * delete all users from database
  deleteAllUsers() {
    if (confirm('Delete all users? This action is not reversible')) {
      this.httpService.postUsers([]).subscribe((data) => this.fetchAllUsers());
    }
  }
}
