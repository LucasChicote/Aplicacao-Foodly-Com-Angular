import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { HeaderComponent } from '../../components/header/header';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

const STATUS_INFO: Record<string, { label: string; icon: string; cor: string; step: number }> = {
  PENDENTE:          { label: 'Pendente',          icon: 'clock',       cor: 'yellow', step: 1 },
  CONFIRMADO:        { label: 'Confirmado',         icon: 'check-circle',cor: 'blue',   step: 2 },
  EM_PREPARO:        { label: 'Em Preparo',         icon: 'flame',       cor: 'orange', step: 3 },
  SAIU_PARA_ENTREGA: { label: 'Saiu p/ Entrega',   icon: 'bike',        cor: 'teal',   step: 4 },
  ENTREGUE:          { label: 'Entregue',           icon: 'package-check',cor: 'green', step: 5 },
  CANCELADO:         { label: 'Cancelado',          icon: 'x-circle',   cor: 'red',    step: 0 }
};

const STEPS = ['PENDENTE','CONFIRMADO','EM_PREPARO','SAIU_PARA_ENTREGA','ENTREGUE'];

@Component({
  selector: 'app-meus-pedidos',
  standalone: true,
  imports: [CommonModule, HeaderComponent, LucideAngularModule],
  template: `
    <app-header />
    <div class="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-teal-50/30 p-4 pt-6">
      <div class="max-w-2xl mx-auto">

        <div class="flex items-center gap-3 mb-6">
          <button (click)="router.navigate(['/home'])"
            class="p-2 rounded-xl text-gray-400 hover:text-green-600 hover:bg-green-50 transition">
            <lucide-icon name="arrow-left" class="w-5 h-5"></lucide-icon>
          </button>
          <h1 class="text-2xl font-black text-gray-800 flex items-center gap-2">
            <lucide-icon name="package" class="w-6 h-6 text-green-500"></lucide-icon>
            Meus Pedidos
          </h1>
        </div>

        @if (carregando()) {
          <div class="text-center py-20">
            <lucide-icon name="loader" class="w-10 h-10 text-green-400 mx-auto mb-4 animate-spin"></lucide-icon>
            <p class="text-gray-400 font-medium">Buscando seus pedidos...</p>
          </div>
        }

        @if (!carregando() && pedidos().length === 0) {
          <div class="text-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
            <lucide-icon name="package" class="w-16 h-16 text-gray-200 mx-auto mb-4"></lucide-icon>
            <h2 class="font-black text-gray-400 text-lg">Nenhum pedido ainda</h2>
            <p class="text-gray-300 text-sm mt-2 mb-6">Que tal pedir algo agora?</p>
            <button (click)="router.navigate(['/home'])"
              class="bg-gradient-to-r from-green-500 to-teal-500 text-white font-black px-8 py-3 rounded-2xl hover:from-green-600 hover:to-teal-600 transition shadow-md shadow-green-200">
              Ver Cardápio
            </button>
          </div>
        }

        <div class="space-y-5">
          @for (pedido of pedidos(); track pedido.id) {
            <div class="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">

              <div class="p-5 border-b border-gray-50 flex items-start justify-between">
                <div>
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Pedido #{{ pedido.id }}</p>
                  <p class="font-black text-gray-800 mt-0.5">{{ pedido.nomeRestaurante }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">{{ pedido.criadoEm | date:'dd/MM/yyyy HH:mm' }}</p>
                </div>
                <div class="text-right">
                  <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black"
                       [class.bg-yellow-50]="pedido.status === 'PENDENTE'"
                       [class.text-yellow-600]="pedido.status === 'PENDENTE'"
                       [class.bg-blue-50]="pedido.status === 'CONFIRMADO'"
                       [class.text-blue-600]="pedido.status === 'CONFIRMADO'"
                       [class.bg-orange-50]="pedido.status === 'EM_PREPARO'"
                       [class.text-orange-500]="pedido.status === 'EM_PREPARO'"
                       [class.bg-teal-50]="pedido.status === 'SAIU_PARA_ENTREGA'"
                       [class.text-teal-600]="pedido.status === 'SAIU_PARA_ENTREGA'"
                       [class.bg-green-50]="pedido.status === 'ENTREGUE'"
                       [class.text-green-600]="pedido.status === 'ENTREGUE'"
                       [class.bg-red-50]="pedido.status === 'CANCELADO'"
                       [class.text-red-500]="pedido.status === 'CANCELADO'">
                    <lucide-icon [name]="getInfo(pedido.status).icon" class="w-3.5 h-3.5"></lucide-icon>
                    {{ getInfo(pedido.status).label }}
                  </div>
                  <p class="font-black text-green-600 text-lg mt-1">{{ pedido.total | currency:'BRL' }}</p>
                </div>
              </div>

              @if (pedido.status !== 'CANCELADO') {
                <div class="px-5 py-4 bg-gray-50/50">
                  <div class="flex items-center gap-1">
                    @for (step of STEPS; track step; let i = $index) {
                      <div class="flex items-center flex-1">
                        <!-- Círculo -->
                        <div class="w-8 h-8 rounded-full flex items-center justify-center flex-none transition-all"
                             [class.bg-green-500]="getInfo(pedido.status).step > i"
                             [class.bg-green-100]="getInfo(pedido.status).step === i + 1"
                             [class.bg-gray-100]="getInfo(pedido.status).step <= i">
                          <lucide-icon [name]="getInfo(step).icon" class="w-4 h-4"
                            [class.text-white]="getInfo(pedido.status).step > i"
                            [class.text-green-600]="getInfo(pedido.status).step === i + 1"
                            [class.text-gray-300]="getInfo(pedido.status).step <= i">
                          </lucide-icon>
                        </div>
                        
                        @if (i < STEPS.length - 1) {
                          <div class="flex-1 h-1 rounded-full mx-1 transition-all"
                               [class.bg-green-400]="getInfo(pedido.status).step > i + 1"
                               [class.bg-gray-100]="getInfo(pedido.status).step <= i + 1">
                          </div>
                        }
                      </div>
                    }
                  </div>
                  <p class="text-xs text-center text-gray-400 font-medium mt-3">
                    {{ getInfo(pedido.status).label }}
                    @if (pedido.status === 'SAIU_PARA_ENTREGA') { — Entregador a caminho! }
                    @if (pedido.status === 'ENTREGUE') { — Bom apetite! }
                  </p>
                </div>
              }

              <div class="p-5">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Itens do Pedido</p>
                <div class="space-y-2">
                  @for (item of pedido.itens; track item.nomeProduto) {
                    <div class="flex justify-between items-center text-sm py-1.5 border-b border-gray-50 last:border-0">
                      <div class="flex items-center gap-2">
                        <lucide-icon name="utensils" class="w-4 h-4 text-gray-300"></lucide-icon>
                        <span class="text-gray-600">{{ item.quantidade }}x {{ item.nomeProduto }}</span>
                      </div>
                      <span class="font-bold text-gray-800">{{ item.subtotal | currency:'BRL' }}</span>
                    </div>
                  }
                </div>
              </div>

            </div>
          }
        </div>

      </div>
    </div>
  `
})
export class MeusPedidosComponent implements OnInit {
  service = inject(ApiService);
  router  = inject(Router);

  pedidos    = signal<any[]>([]);
  carregando = signal(true);
  STEPS = STEPS;

  ngOnInit() {
    this.service.meusPedidos().subscribe({
      next:  (res) => { this.pedidos.set(res); this.carregando.set(false); },
      error: ()    => this.carregando.set(false)
    });
  }

  getInfo(status: string) {
    return STATUS_INFO[status] ?? STATUS_INFO['PENDENTE'];
  }
}