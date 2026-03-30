import { Component, inject, OnInit, computed } from '@angular/core';
import { ApiService } from '../service/api.service';
import { TodoItemComponent } from '../components/todo-item/todo-item';
import { HeaderComponent } from '../components/header/header';
import { CategoriasComponent } from '../components/categorias/categorias';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TodoItemComponent, HeaderComponent, CategoriasComponent, CommonModule, LucideAngularModule],
  template: `
    <app-header />
    
    <div class="min-h-screen bg-gray-50/50">
      <main class="max-w-7xl mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        <div class="lg:col-span-3">
          <div class="relative mb-8">
            <lucide-icon name="search" class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5"></lucide-icon>
            <input type="text" placeholder="O que você quer comer hoje?" 
              class="w-full bg-white border-none shadow-sm rounded-3xl p-5 pl-14 outline-none focus:ring-2 focus:ring-orange-500/20 transition-all">
          </div>

          <app-categorias />
          
          <h2 class="text-2xl font-black mb-8 text-gray-900 tracking-tight">Os mais pedidos</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            @for (p of service.produtos(); track p.id) {
              <app-todo-item [item]="p" (adicionar)="adicionar(p)" />
            }
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50 p-8 sticky top-28 h-fit">
            <div class="flex items-center justify-between mb-8">
              <h2 class="text-2xl font-black flex items-center gap-3 text-gray-900">
                Sua Sacola
              </h2>
              <lucide-icon name="shopping-bag" class="text-orange-500 w-6 h-6"></lucide-icon>
            </div>

            @if (service.carrinhoItens().length > 0) {
              <div class="space-y-5 max-h-[40vh] overflow-y-auto mb-8 pr-2 no-scrollbar">
                @for (item of service.carrinhoItens(); track $index) {
                  <div class="flex justify-between items-center group">
                    <div class="flex flex-col">
                      <span class="font-bold text-gray-800">{{ item.nome }}</span>
                      <span class="text-[10px] font-bold text-orange-500 uppercase tracking-widest">1 Unidade</span>
                    </div>
                    <span class="font-bold text-gray-900">{{ item.preco | currency:'BRL' }}</span>
                  </div>
                }
              </div>

              <div class="border-t border-dashed pt-6">
                <div class="flex justify-between font-black text-2xl text-gray-900 mb-8">
                  <span>Total</span>
                  <span class="text-orange-600">{{ total() | currency:'BRL' }}</span>
                </div>
                
                <div class="space-y-4">
                  <button (click)="irParaPagamento()" class="w-full bg-orange-500 text-white font-black py-5 rounded-[1.5rem] hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                    Finalizar Pedido
                    <lucide-icon name="arrow-right" class="w-4 h-4"></lucide-icon>
                  </button>
                  
                  <button (click)="cancelarPedido()" class="w-full text-gray-400 font-bold text-xs py-2 flex items-center justify-center gap-2 hover:text-red-400 transition">
                    <lucide-icon name="trash-2" class="w-4 h-4"></lucide-icon>
                    Limpar sacola
                  </button>
                </div>
              </div>
            } @else {
              <div class="text-center py-16">
                <div class="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <lucide-icon name="shopping-cart" class="text-gray-200 w-8 h-8"></lucide-icon>
                </div>
                <p class="text-gray-300 text-sm font-medium">Sua sacola está vazia.</p>
              </div>
            }
          </div>
        </div>
      </main>
    </div>
  `
})
export class HomeComponent implements OnInit {
  service = inject(ApiService);
  router = inject(Router);

  total = computed(() => 
    this.service.carrinhoItens().reduce((acc, item) => acc + item.preco, 0)
  );

  ngOnInit() { 
    this.service.listarProdutos(); 
  }

  adicionar(p: any) { 
    this.service.adicionarAoCarrinho(p);
  }

  irParaPagamento() {
    this.router.navigate(['/pagamento']);
  }

  cancelarPedido() {
    this.service.limparCarrinho();
  }
}