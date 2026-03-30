import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home';
import { FormComponent } from './form/form';
import { LoginComponent } from './login/login';
import { PagamentoComponent } from './pages/pagamento/pagamento';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: FormComponent },
  { 
    path: 'home', 
    component: HomeComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'pagamento', 
    component: PagamentoComponent, 
    canActivate: [authGuard] 
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];