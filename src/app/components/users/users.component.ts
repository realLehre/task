import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { HttpService } from 'src/app/services/http.service';
import { User } from './user.model';
import { UserService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['s/n', 'name', 'email', 'roles', 'icon'];
  dataSource: User[] = [];
  user!: User;
  userIndex!: number;

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.userService.fetchAllUsers();
    this.userService.users.subscribe((data) => {
      this.dataSource = data;
    });
    this.userService.user.subscribe((user) => (this.user = user));
  }

  onAddUser() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '600px',
      height: '60%',
      data: { isEditing: false },
    });
  }

  onGetUser(index: number) {
    this.userService.getUser(index);
    this.userIndex = index;
  }

  onEditUser() {
    this.userService.editUser(this.userIndex);
  }

  onDeleteUser() {
    this.userService.deleteUser(this.userIndex);
  }
}
