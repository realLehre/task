import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UsersComponent } from './components/users/users.component';
import { UserDialogComponent } from './components/user-dialog/user-dialog.component';
import { MaterialModule } from './material.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatLegacyPaginatorIntl as MatPaginatorIntl } from '@angular/material/legacy-paginator';
import { UsersTableComponent } from './components/users/users-table/users-table.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    UserDialogComponent,
    UsersTableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
    HttpClientModule,
    MaterialModule,
  ],
  providers: [MatPaginatorIntl],
  bootstrap: [AppComponent],
})
export class AppModule {}
