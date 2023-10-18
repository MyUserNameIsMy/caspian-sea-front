import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForecastComponent } from './forecast.component';
import { RouterModule, Routes } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ImageModule } from 'primeng/image';
import { ChartModule } from 'primeng/chart';
import { PaginatorModule } from 'primeng/paginator';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: ForecastComponent,
  },
];

@NgModule({
  declarations: [ForecastComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CardModule,
    DropdownModule,
    CalendarModule,
    ImageModule,
    ChartModule,
    PaginatorModule,
    ReactiveFormsModule,
  ],
})
export class ForecastModule {}
