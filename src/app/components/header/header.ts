import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <header class="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          
          <a routerLink="/" class="flex items-center gap-3 cursor-pointer hover:opacity-90 transition">
            <img src="assets/foodly-logo.jpg" alt="Foodly" class="h-9 w-9 rounded-lg object-cover">
            <span class="font-black text-2xl text-emerald-700 tracking-tighter">Foodly</span>
          </a>

          <nav class="flex items-center gap-2 text-sm font-medium">
            <a routerLink="/restaurantes" 
               class="px-4 py-2 text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition">
              Restaurantes
            </a>
            <a routerLink="/kits" 
               class="px-4 py-2 text-emerald-700 hover:bg-emerald-50 rounded-xl transition flex items-center gap-1 font-semibold">
              <lucide-icon name="leaf" class="w-4 h-4"></lucide-icon>
              Kits Sustentáveis
            </a>
            <a routerLink="/meus-pedidos" 
               class="px-4 py-2 text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition">
              Meus Pedidos
            </a>
          </nav>

          <div class="flex items-center gap-4">
            @if (service.getEmail()) {
              <div class="text-right">
                <p class="text-sm font-medium text-gray-800">{{ service.getNome() }}</p>
                <p class="text-xs text-gray-500">{{ service.getRole().replace('ROLE_', '') }}</p>
              </div>
              <button (click)="logout()" 
                class="text-gray-400 hover:text-red-500 transition">
                <lucide-icon name="log-out" class="w-5 h-5"></lucide-icon>
              </button>
            } @else {
              <a routerLink="/login" 
                class="px-5 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition">
                Entrar
              </a>
            }
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  service = inject(ApiService);
  router = inject(Router);

  logout() {
    this.service.logout();
    this.router.navigate(['/login']);
  }
}