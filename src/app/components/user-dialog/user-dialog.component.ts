import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { User } from '../users/user.model';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { UserService } from 'src/app/services/users.service';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

interface UserForm {
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  roles: FormControl<string | null>;
}

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
})
export class UserDialogComponent implements OnInit {
  userForm!: FormGroup;
  user!: User;
  userIndex!: number;
  isEditing: boolean = false;
  isLoading: boolean = false;
  isInvalid: boolean = false;
  isFieldError: boolean = false;

  availableRoles: string[] = [
    'Product Manager',
    'UX Designer',
    'UI Designer',
    'Frontend Developer',
    'Backend Developer',
  ];
  constructor(
    private httpService: HttpService,
    private dialog: MatDialog,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA)
    private data: { user: User; isEditing: boolean; index: number },
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // * init user form
    this.userForm = new FormGroup<UserForm>({
      name: new FormControl(null, Validators.required),
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
      roles: new FormControl(null, Validators.required),
    });

    this.user = this.data.user;
    this.isEditing = this.data.isEditing;
    this.userIndex = this.data.index;

    // * on edit, populate input fields with user data
    if (this.isEditing) {
      this.userForm.setValue({
        name: this.user.name,
        email: this.user.email,
        roles: this.user.roles,
      });
    }

    this.userService.isLoading.subscribe((status) => (this.isLoading = status));
  }

  get name() {
    return <FormControl>this.userForm.get('name');
  }
  get email() {
    return <FormControl>this.userForm.get('email');
  }
  get roles() {
    return <FormControl>this.userForm.get('roles');
  }

  onSubmit() {
    if (this.userForm.invalid) {
      return;
    }
    this.isLoading = true;

    // * get user info
    const user = {
      name: this.name.value,
      email: this.email.value,
      roles: this.roles.value,
    };

    if (this.isEditing) {
      this.userService.updateUser(user, this.userIndex);
    } else {
      this.httpService.addUser(user).subscribe({
        next: (data) => this.userService.fetchAllUsers(),
        error: (err) => {
          this.isLoading = false;
          this.snackBar.open('An error occured', '', {
            duration: 3000,
          });
        },
      });
    }

    // * close modal after http call has been made successfully
    this.userService.isLoading.subscribe((status) => {
      if (status == false) {
        this.dialog.closeAll();
      }
    });
  }
}
