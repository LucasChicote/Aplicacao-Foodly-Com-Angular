import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  template: `
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">

        <div class="flex items-center gap-2 cursor-pointer" (click)="irHome()">
          <div class="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <lucide-icon name="utensils" class="w-4 h-4 text-white"></lucide-icon>
          </div>
          <span class="text-lg font-black text-gray-900 tracking-tight">Foodly</span>
        </div>

        <div class="flex items-center gap-1">

          @if (service.isCustomer() || service.isAdmin()) {
            <a routerLink="/restaurantes"
              class="hidden md:flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition px-3 py-1.5 rounded-lg hover:bg-gray-100">
              <lucide-icon name="store" class="w-4 h-4"></lucide-icon>
              Restaurantes
            </a>

            <a routerLink="/meus-pedidos"
              class="hidden md:flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition px-3 py-1.5 rounded-lg hover:bg-gray-100">
              <lucide-icon name="package" class="w-4 h-4"></lucide-icon>
              Pedidos
            </a>
          }

          @if (service.isOwner()) {
            <a routerLink="/dashboard-owner"
              class="hidden md:flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition px-3 py-1.5 rounded-lg hover:bg-gray-100">
              <lucide-icon name="layout-dashboard" class="w-4 h-4"></lucide-icon>
              Meu Painel
            </a>
          }

          @if (service.isAdmin()) {
            <a routerLink="/admin"
              class="hidden md:flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition px-3 py-1.5 rounded-lg hover:bg-gray-100">
              <lucide-icon name="shield" class="w-4 h-4"></lucide-icon>
              Admin
            </a>
          }

          <a routerLink="/perfil"
            class="flex items-center gap-1.5 border border-gray-200 px-3 py-1.5 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition ml-1">
            <lucide-icon name="user" class="w-4 h-4"></lucide-icon>
            <span class="hidden sm:inline max-w-[100px] truncate">{{ service.getNome().split(' ')[0] }}</span>
          </a>

          <button (click)="logout()"
            class="flex items-center gap-1.5 border border-gray-200 px-3 py-1.5 rounded-full text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition ml-1">
            <lucide-icon name="log-out" class="w-4 h-4"></lucide-icon>
          </button>
        </div>

      </div>
    </header>
  `
})
export class HeaderComponent {
  private router = inject(Router);
  service = inject(ApiService);

  irHome() {
    if (this.service.isAdmin()) this.router.navigate(['/admin']);
    else if (this.service.isOwner()) this.router.navigate(['/dashboard-owner']);
    else this.router.navigate(['/restaurantes']);
  }

  logout() {
    this.service.logout();
    this.router.navigate(['/login']);
  }
}
