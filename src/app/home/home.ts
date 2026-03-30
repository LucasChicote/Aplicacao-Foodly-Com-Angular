import { Component, inject, OnInit, computed } from '@angular/core';
import { ApiService } from '../service/api.service';
import { TodoItemComponent } from '../components/todo-item/todo-item';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [TodoItemComponent, CommonModule],
  template: `
    <div class="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="md:col-span-2">
        <h1 class="text-3xl font-bold mb-6 text-orange-600">Cardápio Foodly</h1>
        <div class="grid gap-4">
          @for (p of service.produtos(); track p.id) {
            <app-todo-item [item]="p" (adicionar)="adicionar(p)" />
          }
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-lg h-fit border border-gray-100">
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
          🛒 Seu Pedido
        </h2>
        
        @if (service.carrinhoItens().length > 0) {
          <div class="space-y-3 mb-6">
            @for (item of service.carrinhoItens(); track $index) {
              <div class="flex justify-between text-sm border-b pb-2">
                <span>{{ item.nome }}</span>
                <span class="font-medium">{{ item.preco | currency:'BRL' }}</span>
              </div>
            }
            <div class="flex justify-between font-bold text-lg pt-2 text-orange-600">
              <span>Total:</span>
              <span>{{ total() | currency:'BRL' }}</span>
            </div>
          </div>
          
          <div class="space-y-2">
            <button (click)="irParaPagamento()" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition">
              Ir para Pagamento
            </button>
            
            <button (click)="cancelarPedido()" class="w-full bg-red-100 hover:bg-red-200 text-red-600 font-bold py-2 rounded-lg transition text-sm">
              Esvaziar Carrinho
            </button>
          </div>
        } @else {
          <p class="text-gray-400 text-center py-10">Seu carrinho está vazio</p>
        }
        
        <button (click)="voltarMenu()" class="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2 rounded-lg transition text-sm">
          Sair / Voltar ao Login
        </button>
      </div>
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

  voltarMenu() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}