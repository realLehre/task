import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { User } from '../user.model';
import { MatLegacyPaginator as MatPaginator, MatLegacyPaginatorIntl as MatPaginatorIntl } from '@angular/material/legacy-paginator';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { UserService } from 'src/app/services/users.service';
import { UserDialogComponent } from '../../user-dialog/user-dialog.component';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
})
export class UsersTableComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'roles', 'icon'];
  @Input() dataSource = new MatTableDataSource<User>();
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
    private userService: UserService,
    public _MatPaginatorIntl: MatPaginatorIntl
  ) {}

  ngOnInit(): void {
    this.userService.user.subscribe((user) => (this.user = user));

    this.userService.isLoading.subscribe((status) => (this.isLoading = status));

    this.userService.isError.subscribe((status) => (this.isError = status));

    if (localStorage.getItem('dataCount')) {
      this.dataCount = localStorage.getItem('dataCount') || '';
    }

    this._MatPaginatorIntl.itemsPerPageLabel = 'Users per page';
  }

  // * display user roles
  onViewRoles(roles: Array<string>) {
    this.userRoles = roles;
  }

  // * get user to edit or delete
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
