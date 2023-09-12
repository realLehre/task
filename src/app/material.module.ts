import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatIconModule,
    MatDialogModule,
    MatMenuModule,
  ],
  exports: [
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatIconModule,
    MatDialogModule,
    MatMenuModule,
  ],
})
export class MaterialModule {}
