import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ViewProductsComponent } from './pages/view-products/view-products.component';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'admin', component: AdminComponent },
  { path: 'admin1', component: AdminPanelComponent },

  { path: 'allProducts', component: ViewProductsComponent },
  { path: 'shopping-cart', component: ShoppingCartComponent },
];
