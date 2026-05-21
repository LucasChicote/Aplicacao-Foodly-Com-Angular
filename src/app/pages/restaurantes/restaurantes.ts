import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { HeaderComponent } from '../../components/header/header';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

const CATEGORIAS_RESTAURANTE = [
  'Brasileira', 'Italiana', 'Japonesa', 'Americana', 'Mexicana',
  'Árabe', 'Chinesa', 'Francesa', 'Vegana', 'Frutos do Mar', 'Pizza', 'Hambúrguer',
  'Indiana', 'Espanhola', 'Peruana', 'Saudável', 'Lanches', 'Café'
];

const PROMOCOES = [
  { titulo: 'Frete grátis no 1º pedido', descricao: 'Peça e economize na entrega', cor: 'from-green-600 to-teal-600' },
  { titulo: 'Kits Sustentáveis com desconto', descricao: 'Ajude o planeta e economize', cor: 'from-emerald-500 to-green-600' },
  { titulo: 'R$ 15 off em pedidos acima de R$ 60', descricao: 'Em restaurantes selecionados', cor: 'from-teal-500 to-cyan-600' },
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
            placeholder="Buscar restaurantes, pratos, bebidas..."
            class="w-full bg-white border border-gray-200 rounded-xl p-3.5 pl-11 outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-400 transition shadow-sm text-gray-700 placeholder:text-gray-400 text-sm">
          @if (termoBusca) {
            <button (click)="termoBusca = ''; modoResultadoProduto = false"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition">
              <lucide-icon name="x" class="w-4 h-4"></lucide-icon>
            </button>
          }
        </div>

        @if (!termoBusca) {
          <div class="relative mb-5">
            <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              <button (click)="filtroCategoria = null"
                class="flex-none px-4 py-2 rounded-full text-sm font-semibold border transition whitespace-nowrap"
                [class.bg-green-600]="filtroCategoria === null"
                [class.text-white]="filtroCategoria === null"
                [class.border-green-600]="filtroCategoria === null"
                [class.bg-white]="filtroCategoria !== null"
                [class.text-gray-600]="filtroCategoria !== null"
                [class.border-gray-200]="filtroCategoria !== null">
                Todos
              </button>
              @for (cat of categoriasRestaurante; track cat) {
                <button (click)="filtroCategoria = cat"
                  class="flex-none px-4 py-2 rounded-full text-sm font-semibold border transition whitespace-nowrap"
                  [class.bg-green-600]="filtroCategoria === cat"
                  [class.text-white]="filtroCategoria === cat"
                  [class.border-green-600]="filtroCategoria === cat"
                  [class.bg-white]="filtroCategoria !== cat"
                  [class.text-gray-600]="filtroCategoria !== cat"
                  [class.border-gray-200]="filtroCategoria !== cat">
                  {{ cat }}
                </button>
              }
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-7">
            @for (promo of promocoes; track promo.titulo) {
              <div class="bg-gradient-to-r {{promo.cor}} rounded-2xl p-5 text-white cursor-pointer hover:opacity-90 transition">
                <p class="font-black text-base leading-tight">{{ promo.titulo }}</p>
                <p class="text-white/75 text-xs mt-1">{{ promo.descricao }}</p>
              </div>
            }
          </div>
        }

        @if (termoBusca && buscando()) {
          <div class="text-center py-10">
            <div class="w-7 h-7 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin mx-auto mb-3"></div>
            <p class="text-gray-400 text-sm">Buscando...</p>
          </div>
        }

        @if (termoBusca && !buscando()) {
          <div class="mb-5">
            <div class="flex gap-3 mb-5">
              <button (click)="abaAtiva = 'restaurantes'"
                class="px-4 py-2 rounded-xl text-sm font-bold border-2 transition"
                [class.bg-green-600]="abaAtiva === 'restaurantes'"
                [class.text-white]="abaAtiva === 'restaurantes'"
                [class.border-green-600]="abaAtiva === 'restaurantes'"
                [class.bg-white]="abaAtiva !== 'restaurantes'"
                [class.text-gray-600]="abaAtiva !== 'restaurantes'"
                [class.border-gray-200]="abaAtiva !== 'restaurantes'">
                Restaurantes ({{ restaurantesFiltrados().length }})
              </button>
              <button (click)="abaAtiva = 'pratos'"
                class="px-4 py-2 rounded-xl text-sm font-bold border-2 transition"
                [class.bg-green-600]="abaAtiva === 'pratos'"
                [class.text-white]="abaAtiva === 'pratos'"
                [class.border-green-600]="abaAtiva === 'pratos'"
                [class.bg-white]="abaAtiva !== 'pratos'"
                [class.text-gray-600]="abaAtiva !== 'pratos'"
                [class.border-gray-200]="abaAtiva !== 'pratos'">
                Pratos ({{ produtosFiltrados().length }})
              </button>
            </div>

            @if (abaAtiva === 'restaurantes') {
              @if (restaurantesFiltrados().length === 0) {
                <div class="text-center py-12">
                  <lucide-icon name="store" class="w-10 h-10 text-gray-200 mx-auto mb-3"></lucide-icon>
                  <p class="text-gray-400 font-semibold text-sm">Nenhum restaurante encontrado</p>
                </div>
              } @else {
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  @for (r of restaurantesFiltrados(); track r.id) {
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden" (click)="abrirRestaurante(r)">
                      <div class="w-full h-36 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                        @if (r.imagemUrl) {
                          <img [src]="r.imagemUrl" [alt]="r.nome" class="w-full h-full object-cover">
                        } @else {
                          <lucide-icon name="store" class="w-10 h-10 text-gray-300"></lucide-icon>
                        }
                        @if (r.categoria) {
                          <div class="absolute top-2 left-2 bg-white text-xs font-bold text-gray-700 px-2 py-0.5 rounded-full border border-gray-100 shadow-sm">{{ r.categoria }}</div>
                        }
                      </div>
                      <div class="p-4">
                        <h3 class="font-bold text-gray-900 text-sm">{{ r.nome }}</h3>
                        <p class="text-xs text-gray-400 mt-0.5 line-clamp-1">{{ r.descricao || 'Ver cardápio' }}</p>
                        <span class="text-xs font-semibold text-green-600 mt-2 block">Ver cardápio →</span>
                      </div>
                    </div>
                  }
                </div>
              }
            }

            @if (abaAtiva === 'pratos') {
              @if (produtosFiltrados().length === 0) {
                <div class="text-center py-12">
                  <lucide-icon name="utensils" class="w-10 h-10 text-gray-200 mx-auto mb-3"></lucide-icon>
                  <p class="text-gray-400 font-semibold text-sm">Nenhum prato encontrado</p>
                </div>
              } @else {
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  @for (p of produtosFiltrados(); track p.id) {
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer"
                      (click)="abrirRestaurantePorProduto(p)">
                      <div class="w-full h-36 bg-gray-100 flex items-center justify-center overflow-hidden">
                        @if (p.imagemUrl) {
                          <img [src]="p.imagemUrl" [alt]="p.nome" class="w-full h-full object-cover">
                        } @else {
                          <lucide-icon name="utensils" class="w-10 h-10 text-gray-300"></lucide-icon>
                        }
                      </div>
                      <div class="p-4">
                        @if (p.categoria) {
                          <span class="text-[10px] font-bold text-green-600 uppercase tracking-widest">{{ p.categoria }}</span>
                        }
                        <h3 class="font-bold text-gray-900 text-sm mt-0.5">{{ p.nome }}</h3>
                        <p class="text-xs text-gray-400 mt-0.5 line-clamp-1">{{ p.descricao }}</p>
                        <div class="flex items-center justify-between mt-2">
                          <span class="font-black text-gray-900">{{ p.preco | currency:'BRL' }}</span>
                          <div class="flex items-center gap-1 text-xs text-gray-400">
                            <lucide-icon name="store" class="w-3 h-3"></lucide-icon>
                            <span class="truncate max-w-[80px]">{{ p.restaurante }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              }
            }
          </div>
        }

        @if (!termoBusca) {
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-base font-bold text-gray-800">
              {{ filtroCategoria ?? 'Todos os restaurantes' }}
            </h2>
            <span class="text-sm text-gray-400">{{ restaurantesFiltrados().length }} encontrados</span>
          </div>

          @if (restaurantesFiltrados().length === 0) {
            <div class="text-center py-20">
              <lucide-icon name="store" class="w-12 h-12 text-gray-200 mx-auto mb-3"></lucide-icon>
              <p class="font-bold text-gray-400 text-base">Nenhum restaurante encontrado</p>
              <p class="text-gray-300 text-sm mt-1">Nenhum restaurante cadastrado ainda</p>
            </div>
          }

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            @for (r of restaurantesFiltrados(); track r.id) {
              <div
                class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
                (click)="abrirRestaurante(r)">
                <div class="w-full h-40 bg-gray-100 overflow-hidden flex items-center justify-center relative">
                  @if (r.imagemUrl) {
                    <img [src]="r.imagemUrl" [alt]="r.nome" class="w-full h-full object-cover">
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
                    <span class="text-xs font-semibold text-green-600">Ver cardápio</span>
                    <lucide-icon name="chevron-right" class="w-4 h-4 text-gray-300"></lucide-icon>
                  </div>
                </div>
              </div>
            }
          </div>
        }

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
  abaAtiva: 'restaurantes' | 'pratos' = 'restaurantes';
  buscando = signal(false);
  modoResultadoProduto = false;
  todosProdutos = signal<any[]>([]);

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

  produtosFiltrados = computed(() => {
    const termo = this.termoBusca.toLowerCase().trim();
    if (!termo) return [];
    return this.todosProdutos().filter(p =>
      p.nome?.toLowerCase().includes(termo) ||
      p.descricao?.toLowerCase().includes(termo) ||
      p.categoria?.toLowerCase().includes(termo)
    );
  });

  ngOnInit() {
    this.service.listarRestaurantes();
    this.service.listarTodosProdutosObs().subscribe(res => this.todosProdutos.set(res));
  }

  abrirRestaurante(r: any) {
    this.router.navigate(['/restaurante', r.id]);
  }

  abrirRestaurantePorProduto(p: any) {
    if (p.restauranteId) {
      this.router.navigate(['/restaurante', p.restauranteId]);
    }
  }
}
