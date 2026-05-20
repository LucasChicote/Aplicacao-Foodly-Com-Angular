import { Component, inject, OnInit, computed } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { HeaderComponent } from '../../components/header/header';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

const CATEGORIAS_RESTAURANTE = [
  'Brasileira', 'Italiana', 'Japonesa', 'Americana', 'Mexicana',
  'Árabe', 'Chinesa', 'Francesa', 'Vegana', 'Frutos do Mar', 'Pizza', 'Hambúrguer'
];

const PROMOCOES = [
  { titulo: 'Frete grátis no primeiro pedido', descricao: 'Use o app e economize na entrega', cor: 'bg-red-500' },
  { titulo: 'Peça 2, leve 3', descricao: 'Em restaurantes selecionados hoje', cor: 'bg-orange-500' },
  { titulo: 'Desconto de R$ 15', descricao: 'Em pedidos acima de R$ 60', cor: 'bg-green-600' },
];

@Component({
  selector: 'app-restaurantes',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FormsModule, LucideAngularModule],
  template: `
    <app-header />

    <div class="min-h-screen bg-gray-50">
      <main class="max-w-7xl mx-auto p-4 lg:p-6">

        <div class="relative mb-5">
          <lucide-icon name="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
          <input type="text" [(ngModel)]="termoBusca"
            placeholder="Buscar restaurantes ou pratos..."
            class="w-full bg-white border border-gray-200 rounded-xl p-3.5 pl-11 outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 transition shadow-sm text-gray-700 placeholder:text-gray-400 text-sm">
        </div>

        @if (!termoBusca) {
          <div class="flex gap-3 overflow-x-auto pb-2 mb-6 no-scrollbar">
            <button (click)="filtroCategoria = null"
              class="flex-none px-4 py-2 rounded-full text-sm font-semibold border transition whitespace-nowrap"
              [class.bg-red-500]="filtroCategoria === null"
              [class.text-white]="filtroCategoria === null"
              [class.border-red-500]="filtroCategoria === null"
              [class.bg-white]="filtroCategoria !== null"
              [class.text-gray-600]="filtroCategoria !== null"
              [class.border-gray-200]="filtroCategoria !== null">
              Todos
            </button>
            @for (cat of categoriasRestaurante; track cat) {
              <button (click)="filtroCategoria = cat"
                class="flex-none px-4 py-2 rounded-full text-sm font-semibold border transition whitespace-nowrap"
                [class.bg-red-500]="filtroCategoria === cat"
                [class.text-white]="filtroCategoria === cat"
                [class.border-red-500]="filtroCategoria === cat"
                [class.bg-white]="filtroCategoria !== cat"
                [class.text-gray-600]="filtroCategoria !== cat"
                [class.border-gray-200]="filtroCategoria !== cat">
                {{ cat }}
              </button>
            }
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-7">
            @for (promo of promocoes; track promo.titulo) {
              <div class="{{promo.cor}} rounded-2xl p-5 text-white">
                <p class="font-black text-base leading-tight">{{ promo.titulo }}</p>
                <p class="text-white/80 text-xs mt-1">{{ promo.descricao }}</p>
              </div>
            }
          </div>
        }

        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-bold text-gray-800">
            {{ termoBusca ? 'Resultados para "' + termoBusca + '"' : (filtroCategoria ?? 'Todos os restaurantes') }}
          </h2>
          <span class="text-sm text-gray-400">{{ restaurantesFiltrados().length }} encontrados</span>
        </div>

        @if (restaurantesFiltrados().length === 0) {
          <div class="text-center py-20">
            <lucide-icon name="store" class="w-12 h-12 text-gray-200 mx-auto mb-3"></lucide-icon>
            <p class="font-bold text-gray-400 text-base">Nenhum restaurante encontrado</p>
            <p class="text-gray-300 text-sm mt-1">
              {{ termoBusca ? 'Tente outro nome' : 'Nenhum restaurante cadastrado ainda' }}
            </p>
          </div>
        }

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          @for (r of restaurantesFiltrados(); track r.id) {
            <div
              class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
              (click)="abrirRestaurante(r)">

              <div class="w-full h-40 bg-gray-100 overflow-hidden flex items-center justify-center relative">
                @if (r.imagemUrl) {
                  <img [src]="r.imagemUrl" [alt]="r.nome"
                    class="w-full h-full object-cover">
                } @else {
                  <lucide-icon name="store" class="w-12 h-12 text-gray-300"></lucide-icon>
                }

                @if (r.categoria) {
                  <div class="absolute top-2 left-2 bg-white text-xs font-bold text-gray-700 px-2.5 py-1 rounded-full border border-gray-100 shadow-sm">
                    {{ r.categoria }}
                  </div>
                }
              </div>

              <div class="p-4">
                <h3 class="font-bold text-gray-900 text-sm leading-tight">{{ r.nome }}</h3>
                <p class="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                  {{ r.descricao || 'Clique para ver o cardápio.' }}
                </p>
                <div class="flex items-center justify-between mt-3">
                  <span class="text-xs font-semibold text-red-500">Ver cardápio</span>
                  <lucide-icon name="chevron-right" class="w-4 h-4 text-gray-300"></lucide-icon>
                </div>
              </div>
            </div>
          }
        </div>

      </main>
    </div>
  `,
  styles: `.no-scrollbar::-webkit-scrollbar { display: none; }`
})
export class RestaurantesComponent implements OnInit {
  service = inject(ApiService);
  router  = inject(Router);

  termoBusca = '';
  filtroCategoria: string | null = null;
  categoriasRestaurante = CATEGORIAS_RESTAURANTE;
  promocoes = PROMOCOES;

  restaurantesFiltrados = computed(() => {
    const termo = this.termoBusca.toLowerCase().trim();
    let lista = this.service.restaurantes();

    if (termo) {
      return lista.filter(r =>
        r.nome?.toLowerCase().includes(termo) ||
        r.categoria?.toLowerCase().includes(termo) ||
        r.descricao?.toLowerCase().includes(termo)
      );
    }

    if (this.filtroCategoria) {
      lista = lista.filter(r =>
        r.categoria?.toLowerCase() === this.filtroCategoria!.toLowerCase()
      );
    }

    return lista;
  });

  ngOnInit() {
    this.service.listarRestaurantes();
  }

  abrirRestaurante(r: any) {
    this.router.navigate(['/restaurante', r.id]);
  }
}
