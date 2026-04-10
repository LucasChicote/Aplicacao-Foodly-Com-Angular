import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  template: `
    <header class="bg-white/90 backdrop-blur-md border-b border-green-100 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        <div class="flex items-center gap-3 cursor-pointer" (click)="irHome()">
          <div class="w-9 h-9 bg-gradient-to-br from-green-400 to-teal-500 rounded-xl flex items-center justify-center shadow-md shadow-green-200">
            <lucide-icon name="leaf" class="w-5 h-5 text-white"></lucide-icon>
          </div>
          <span class="text-xl font-black text-gray-900 tracking-tight italic">Foodly</span>
        </div>

        <div class="flex items-center gap-2">

          @if (service.isCustomer() || service.isAdmin()) {
            <a routerLink="/meus-pedidos"
              class="hidden md:flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-green-600 transition px-3 py-2 rounded-xl hover:bg-green-50">
              <lucide-icon name="package" class="w-4 h-4"></lucide-icon>
              Meus Pedidos
            </a>
          }

          @if (service.isOwner()) {
            <a routerLink="/dashboard-owner"
              class="hidden md:flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-teal-600 transition px-3 py-2 rounded-xl hover:bg-teal-50">
              <lucide-icon name="layout-dashboard" class="w-4 h-4"></lucide-icon>
              Meu Painel
            </a>
          }

          @if (service.isAdmin()) {
            <a routerLink="/admin"
              class="hidden md:flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition px-3 py-2 rounded-xl hover:bg-gray-50">
              <lucide-icon name="shield" class="w-4 h-4"></lucide-icon>
              Admin
            </a>
          }

          <a routerLink="/perfil"
            class="flex items-center gap-2 bg-green-50 border border-green-100 px-3 py-2 rounded-full text-sm font-bold text-green-700 hover:bg-green-100 transition">
            <lucide-icon name="user-circle" class="w-4 h-4"></lucide-icon>
            <span class="hidden sm:inline max-w-[120px] truncate">{{ service.getNome().split(' ')[0] }}</span>
          </a>

          <button (click)="logout()"
            class="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-2 rounded-full text-sm font-bold text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition">
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
    else this.router.navigate(['/home']);
  }

  logout() {
    this.service.logout();
    this.router.navigate(['/login']);
  }
}