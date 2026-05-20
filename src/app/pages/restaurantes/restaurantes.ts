import { Component, inject, OnInit, computed } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { HeaderComponent } from '../../components/header/header';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-restaurantes',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FormsModule, LucideAngularModule],
  template: `
    <app-header />

    <div class="min-h-screen bg-gray-50">
      <main class="max-w-7xl mx-auto p-4 lg:p-6">
        <div class="flex justify-center mb-8">
          <img src="/assets/foodly-logo.png" alt="Foodly" class="h-20">
        </div>

        <div class="relative mb-6">
          <lucide-icon name="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"></lucide-icon>
          <input type="text" [(ngModel)]="termoBusca" (ngModelChange)="onSearch($event)"
            placeholder="Buscar restaurantes, pratos, milk shake..."
            class="w-full bg-white border border-gray-200 rounded-2xl p-4 pl-12 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-700">
        </div>

        <div class="flex gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <button (click)="filtroCategoria = null"
            class="flex-none px-6 py-3 rounded-2xl text-sm font-semibold border-2 transition-all"
            [class.bg-emerald-600]="filtroCategoria === null"
            [class.text-white]="filtroCategoria === null"
            [class.border-emerald-600]="filtroCategoria === null">
            Todos
          </button>
          @for (cat of categoriasRestaurante; track cat) {
            <button (click)="filtroCategoria = cat"
              class="flex-none px-6 py-3 rounded-2xl text-sm font-semibold border-2 transition-all whitespace-nowrap"
              [class.bg-emerald-600]="filtroCategoria === cat"
              [class.text-white]="filtroCategoria === cat"
              [class.border-emerald-600]="filtroCategoria === cat">
              {{ cat }}
            </button>
          }
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          @for (r of restaurantesFiltrados(); track r.id) {
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer" (click)="abrirRestaurante(r)">
              <div class="w-full h-40 bg-gray-100 overflow-hidden flex items-center justify-center relative">
                <img [src]="r.imagemUrl" [alt]="r.nome" class="w-full h-full object-cover" *ngIf="r.imagemUrl">
                <lucide-icon name="store" class="w-12 h-12 text-gray-300" *ngIf="!r.imagemUrl"></lucide-icon>
              </div>
              <div class="p-4">
                <h3 class="font-bold text-gray-900">{{ r.nome }}</h3>
                <p class="text-xs text-gray-500">{{ r.descricao }}</p>
              </div>
            </div>
          }
        </div>
      </main>
    </div>
  `
})
export class RestaurantesComponent implements OnInit {
  service = inject(ApiService);
  router = inject(Router);

  termoBusca = '';
  filtroCategoria: string | null = null;
  categoriasRestaurante = ['Lanches', 'Japonesa', 'Italiana', 'Brasileira', 'Saudáveis', 'Bebidas'];

  restaurantesFiltrados = computed(() => this.service.restaurantes());

  ngOnInit() {
    this.service.listarRestaurantes();
  }

  onSearch(termo: string) {
    if (termo.length > 2) {
      this.service.buscarGlobal(termo).subscribe();
    }
  }

  abrirRestaurante(r: any) {
    this.router.navigate(['/restaurante', r.id]);
  }
}