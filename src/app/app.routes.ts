import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { ownerGuard } from './guards/owner.guard';

import { WelcomeComponent }        from './pages/Welcome/welcome';
import { LoginComponent }           from './login/login';
import { FormComponent }            from './form/form';
import { HomeComponent }            from './home/home';
import { PagamentoComponent }       from './pages/pagamento/pagamento';
import { PerfilComponent }          from './pages/perfil/perfil';
import { MeusPedidosComponent }     from './pages/pedidos/meus-pedidos';
import { AdminComponent }           from './pages/admin/admin';
import { DashboardOwnerComponent }  from './pages/restaurante/dashboard-owner';

export const routes: Routes = [
  
  { path: '',        component: WelcomeComponent },
  { path: 'login',   component: LoginComponent },
  { path: 'cadastro', component: FormComponent },

  { path: 'home',         component: HomeComponent,         canActivate: [authGuard] },
  { path: 'pagamento',    component: PagamentoComponent,    canActivate: [authGuard] },
  { path: 'perfil',       component: PerfilComponent,       canActivate: [authGuard] },
  { path: 'meus-pedidos', component: MeusPedidosComponent,  canActivate: [authGuard] },

  { path: 'admin',           component: AdminComponent,          canActivate: [authGuard, adminGuard] },

  { path: 'dashboard-owner', component: DashboardOwnerComponent, canActivate: [authGuard, ownerGuard] },

  { path: '**', redirectTo: '' }
];