import { Component, inject, computed, signal } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header';
import { LucideAngularModule } from 'lucide-angular';

type MetodoPagamento = 'PIX' | 'DEBITO' | 'CREDITO' | null;

@Component({
  standalone: true,
  imports: [CommonModule, HeaderComponent, LucideAngularModule],
  template: `
    <app-header />
    <div class="min-h-screen bg-gray-50 flex items-start justify-center p-4 pt-8">
      <div class="w-full max-w-lg">

        @if (pedidoConfirmado()) {
          <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center">
            <div class="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <lucide-icon name="check-circle" class="w-10 h-10 text-emerald-600"></lucide-icon>
            </div>
            <h2 class="text-2xl font-black text-gray-900 mb-2">Pedido Confirmado!</h2>
            <p class="text-gray-500 mb-8">Obrigado por escolher o Foodly e ajudar o planeta 🌍</p>

            <div class="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-8 text-left">
              <p class="text-emerald-700 font-semibold flex items-center gap-2">
                <lucide-icon name="leaf" class="w-5 h-5"></lucide-icon>
                Impacto da sua compra
              </p>
              <p class="text-3xl font-black text-emerald-600 mt-2">
                {{ co2Economizado() }} kg de CO₂ evitados
              </p>
              <p class="text-sm text-emerald-600 mt-1">Você contribuiu para um futuro mais sustentável.</p>
            </div>

            <button (click)="voltarHome()"
              class="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl hover:bg-emerald-700 transition">
              Voltar ao Início
            </button>
          </div>
        }

        @if (!pedidoConfirmado()) {
          <div class="space-y-6">

            <!-- Resumo -->
            <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h2 class="font-bold text-lg mb-4">Resumo do Pedido</h2>
              <div class="space-y-3 max-h-52 overflow-y-auto">
                @for (item of service.carrinhoItens(); track $index) {
                  <div class="flex justify-between">
                    <span class="text-gray-600">{{ item.nome }}</span>
                    <span class="font-medium">{{ (item.precoPromocional || item.preco) | currency:'BRL' }}</span>
                  </div>
                }
              </div>
              <div class="border-t border-gray-100 mt-5 pt-5 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{{ total() | currency:'BRL' }}</span>
              </div>
            </div>

            <!-- Impacto Ambiental -->
            <div class="bg-emerald-50 border border-emerald-200 rounded-3xl p-6">
              <div class="flex gap-4">
                <lucide-icon name="leaf" class="w-6 h-6 text-emerald-600 mt-1"></lucide-icon>
                <div>
                  <p class="font-semibold text-emerald-800">Impacto Ambiental</p>
                  <p class="text-emerald-700">
                    Esta compra ajudará a evitar <strong>{{ co2Economizado() }} kg de CO₂</strong>
                  </p>
                </div>
              </div>
            </div>

            <!-- Forma de Pagamento -->
            <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h2 class="font-bold text-lg mb-4">Forma de Pagamento</h2>
              
              <div class="space-y-3">
                <button (click)="selecionarMetodo('PIX')" 
                  class="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition"
                  [class.border-emerald-500]="metodoPagamento() === 'PIX'"
                  [class.bg-emerald-50]="metodoPagamento() === 'PIX'">
                  <lucide-icon name="zap" class="w-6 h-6 text-green-600"></lucide-icon>
                  <div class="flex-1 text-left">
                    <p class="font-bold">PIX</p>
                    <p class="text-xs text-gray-500">Pagamento instantâneo</p>
                  </div>
                </button>

                <button (click)="selecionarMetodo('DEBITO')" 
                  class="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition"
                  [class.border-emerald-500]="metodoPagamento() === 'DEBITO'"
                  [class.bg-emerald-50]="metodoPagamento() === 'DEBITO'">
                  <lucide-icon name="credit-card" class="w-6 h-6 text-blue-600"></lucide-icon>
                  <div class="flex-1 text-left">
                    <p class="font-bold">Cartão de Débito</p>
                  </div>
                </button>

                <button (click)="selecionarMetodo('CREDITO')" 
                  class="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition"
                  [class.border-emerald-500]="metodoPagamento() === 'CREDITO'"
                  [class.bg-emerald-50]="metodoPagamento() === 'CREDITO'">
                  <lucide-icon name="wallet" class="w-6 h-6 text-purple-600"></lucide-icon>
                  <div class="flex-1 text-left">
                    <p class="font-bold">Cartão de Crédito</p>
                  </div>
                </button>
              </div>
            </div>

            <button (click)="confirmarPagamento()" 
              [disabled]="!metodoPagamento() || enviando()"
              class="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-3xl transition">
              {{ enviando() ? 'Processando...' : 'Confirmar Pedido' }}
            </button>

          </div>
        }
      </div>
    </div>
  `
})
export class PagamentoComponent {
  service = inject(ApiService);
  router = inject(Router);

  enviando = signal(false);
  pedidoConfirmado = signal(false);
  metodoPagamento = signal<MetodoPagamento>(null);

  total = computed(() =>
    this.service.carrinhoItens().reduce((acc, item: any) => 
      acc + (item.precoPromocional || item.preco || 0), 0)
  );

  co2Economizado = computed(() => {
    const total = this.service.carrinhoItens().reduce((acc, item: any) => {
      return acc + (item.co2EconomizadoKg || 2.5);
    }, 0);
    return total.toFixed(1);
  });

  selecionarMetodo(m: MetodoPagamento) {
    this.metodoPagamento.set(m);
  }

  confirmarPagamento() {
    if (!this.metodoPagamento()) return;

    const itens = this.service.carrinhoItens();
    if (itens.length === 0) return;

    const restauranteId = itens[0]?.restauranteId;
    if (!restauranteId) return;

    const payload = {
      restauranteId,
      itens: itens.map((item: any) => ({ produtoId: item.id, quantidade: 1 }))
    };

    this.enviando.set(true);

    this.service.realizarPedido(payload).subscribe({
      next: () => {
        this.enviando.set(false);
        this.service.limparCarrinho();
        this.pedidoConfirmado.set(true);
      },
      error: () => {
        this.enviando.set(false);
        alert('Erro ao confirmar pedido. Tente novamente.');
      }
    });
  }

  voltarHome() {
    this.router.navigate(['/restaurantes']);
  }
}