import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

import { User } from './user.model';
import { UserService } from 'src/app/services/users.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'roles', 'icon'];
  dataSource = new MatTableDataSource<User>();
  isLoading: boolean = true;
  isError: boolean = false;

  constructor(private dialog: MatDialog, private userService: UserService) {}

  ngOnInit(): void {
    // * fetch users from service
    this.userService.fetchAllUsers();
    // * pass users data
    this.userService.users.subscribe((data) => {
      this.userService.isLoading.next(false);
      this.dataSource.data = data;

      if (this.dataSource.data.length > 0) {
        localStorage.setItem(
          'dataCount',
          JSON.stringify(this.dataSource.data.length)
        );
      }
    });

    this.userService.isLoading.subscribe((status) => (this.isLoading = status));

    this.userService.isError.subscribe((status) => (this.isError = status));
  }

  // * filter users in table
  onFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // * add new user
  onAddUser() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '600px',
      data: { isEditing: false },
      autoFocus: false,
    });
  }

  onDeleteAllUsers() {
    this.userService.deleteAllUsers();
  }
}
