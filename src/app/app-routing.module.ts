import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DasboardComponent } from './dasboard/dasboard.component';
import { OrdersComponent } from './orders/orders.component';
import { ReturnsComponent } from './returns/returns.component';
import { PeopleComponent } from './people/people.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DasboardComponent
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }, 
  {
    path:'orders',
    component:OrdersComponent
  },
  {
    path:'returns',
    component:ReturnsComponent
  },
  {
    path:'people',
    component:PeopleComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
