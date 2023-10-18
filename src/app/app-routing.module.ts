import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForecastModule } from './pages/forecast/forecast.module';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/forecast/forecast.module').then(m => ForecastModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
