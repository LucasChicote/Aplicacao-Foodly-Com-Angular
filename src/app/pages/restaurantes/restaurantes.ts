import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { HeaderComponent } from '../../components/header/header';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restaurantes',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FormsModule],
  template: `
    <app-header />

    <div class="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-teal-50/30">
      <main class="max-w-7xl mx-auto p-4 lg:p-8">

        <div class="bg-gradient-to-r from-teal-500 to-green-500 rounded-3xl p-6 mb-6 text-white shadow-lg shadow-teal-200/50">
          <p class="text-teal-100 text-sm font-bold uppercase tracking-widest mb-1">Bem-vindo ao</p>
          <h1 class="text-2xl font-black">Restaurantes 🏪</h1>
          <p class="text-teal-100 text-sm mt-1">Escolha um restaurante para ver o cardápio</p>
        </div>

        <div class="relative mb-6">
          <span class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 text-xl">🔍</span>
          <input type="text" [(ngModel)]="termoBusca"
            placeholder="Buscar restaurante pelo nome..."
            class="w-full bg-white border border-green-100 rounded-2xl p-4 pl-14 outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-300 transition-all shadow-sm text-gray-700 placeholder:text-gray-300">
        </div>

        <div class="flex items-center justify-between mb-5">
          <h2 class="text-lg font-black text-gray-800">
            {{ termoBusca ? '🔎 Resultado da busca' : '🔥 Todos os restaurantes' }}
          </h2>
          <span class="text-sm text-gray-400 font-medium">{{ restaurantesFiltrados().length }} encontrados</span>
        </div>

        @if (restaurantesFiltrados().length === 0) {
          <div class="text-center py-20">
            <p class="text-6xl mb-4">🏪</p>
            <p class="font-black text-gray-400 text-lg">Nenhum restaurante encontrado</p>
            <p class="text-gray-300 text-sm mt-1">
              {{ termoBusca ? 'Tente outro nome' : 'Nenhum restaurante cadastrado ainda' }}
            </p>
          </div>
        }

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          @for (r of restaurantesFiltrados(); track r.id) {
            <div
              class="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer group"
              (click)="abrirRestaurante(r)">

              <div class="w-full h-44 bg-gradient-to-br from-teal-50 to-green-50 overflow-hidden flex items-center justify-center relative">
                @if (r.imagemUrl) {
                  <img [src]="r.imagemUrl" [alt]="r.nome"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                } @else {
                  <span class="text-7xl opacity-40">🏪</span>
                }

                @if (r.categoria) {
                  <div class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-bold text-teal-700 px-3 py-1 rounded-full border border-teal-100">
                    {{ r.categoria }}
                  </div>
                }
              </div>

              <div class="p-5">
                <h3 class="font-black text-gray-800 text-base leading-tight">{{ r.nome }}</h3>
                <p class="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                  {{ r.descricao || 'Clique para ver o cardápio completo.' }}
                </p>
                <div class="flex items-center justify-between mt-4">
                  <span class="text-xs font-bold text-teal-500 uppercase tracking-widest">Ver cardápio →</span>
                </div>
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
  router  = inject(Router);

  termoBusca = '';

  restaurantesFiltrados = computed(() => {
    const termo = this.termoBusca.toLowerCase().trim();
    if (!termo) return this.service.restaurantes();
    return this.service.restaurantes().filter(r =>
      r.nome?.toLowerCase().includes(termo) ||
      r.categoria?.toLowerCase().includes(termo) ||
      r.descricao?.toLowerCase().includes(termo)
    );
  });

  ngOnInit() {
    this.service.listarRestaurantes();
  }

  abrirRestaurante(r: any) {
    this.router.navigate(['/restaurante', r.id]);
  }
}