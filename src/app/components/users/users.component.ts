import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { HttpService } from 'src/app/services/http.service';
import { User } from './user.model';
import { UserService } from 'src/app/services/users.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'email', 'roles', 'icon'];
  dataSource = new MatTableDataSource<User>();
  user!: User;
  userRoles: Array<string> = [];
  userIndex!: number;
  isLoading: boolean = true;
  isError: boolean = false;
  dataCount!: string;
  @ViewChild(MatPaginator, { static: false }) set paginator(
    value: MatPaginator
  ) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.userService.fetchAllUsers();
    this.userService.users.subscribe((data) => {
      this.userService.isLoading.next(false);
      this.dataSource.data = data;
    });

    if (this.dataSource.data.length > 0) {
      localStorage.setItem(
        'dataCount',
        JSON.stringify(this.dataSource.data.length)
      );
    }

    this.userService.user.subscribe((user) => (this.user = user));

    this.userService.isLoading.subscribe((status) => (this.isLoading = status));

    this.userService.isError.subscribe((status) => (this.isError = status));

    if (localStorage.getItem('dataCount')) {
      this.dataCount = localStorage.getItem('dataCount') || '';
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  onFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onViewRoles(roles: Array<string>) {
    this.userRoles = roles;
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
