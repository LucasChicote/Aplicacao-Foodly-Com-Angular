import { Component, inject, computed } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header';

@Component({
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  template: `
    <app-header />
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div class="bg-white max-w-md w-full rounded-3xl shadow-xl border p-8">
        <div class="text-center mb-8">
          <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
            ✅
          </div>
          <h2 class="text-2xl font-black text-gray-800">Quase lá!</h2>
          <p class="text-gray-400">Revise seu pedido antes de finalizar.</p>
        </div>

        <div class="bg-gray-50 rounded-2xl p-4 mb-8">
           @for (item of service.carrinhoItens(); track $index) {
             <div class="flex justify-between py-2 text-sm">
               <span class="text-gray-600">{{ item.nome }}</span>
               <span class="font-bold">{{ item.preco | currency:'BRL' }}</span>
             </div>
           }
           <div class="border-t mt-4 pt-4 flex justify-between font-black text-xl text-orange-600">
             <span>Total</span>
             <span>{{ total() | currency:'BRL' }}</span>
           </div>
        </div>

        <div class="space-y-3">
          <button (click)="confirmarPagamento()" class="w-full bg-green-500 text-white font-bold py-4 rounded-2xl hover:bg-green-600 transition">
            Confirmar e Pagar
          </button>
          <button (click)="voltar()" class="w-full text-gray-400 font-bold py-2">
            Voltar ao cardápio
          </button>
        </div>
      </div>
    </div>
  `
})
export class PagamentoComponent {
  service = inject(ApiService);
  router = inject(Router);

  total = computed(() => 
    this.service.carrinhoItens().reduce((acc, item: any) => acc + item.preco, 0)
  );

  confirmarPagamento() {
    alert('Pedido realizado com sucesso!');
    this.service.limparCarrinho();
    this.router.navigate(['/home']);
  }

  voltar() { this.router.navigate(['/home']); }
}