import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <header class="bg-white shadow-sm border-b sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div class="flex items-center gap-3 cursor-pointer" (click)="irHome()">
          <div class="bg-orange-500 p-2 rounded-xl text-white shadow-lg shadow-orange-100">
            <lucide-icon name="utensils" class="w-6 h-6"></lucide-icon>
          </div>
          <h1 class="text-2xl font-black text-gray-900 tracking-tighter italic">Foodly</h1>
        </div>
        
        <div class="flex items-center gap-6">
          <button class="text-gray-400 hover:text-orange-500 transition">
            <lucide-icon name="user" class="w-6 h-6"></lucide-icon>
          </button>
          <button (click)="logout()" class="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full text-sm font-bold text-gray-500 hover:bg-red-50 hover:text-red-500 transition">
            <lucide-icon name="log-out" class="w-4 h-4"></lucide-icon>
            Sair
          </button>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  private router = inject(Router);
  irHome() { this.router.navigate(['/home']); }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}