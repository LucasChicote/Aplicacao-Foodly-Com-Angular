import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { HeaderComponent } from '../../components/header/header';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-kits',
  standalone: true,
  imports: [HeaderComponent, CommonModule, LucideAngularModule],
  template: `
    <app-header />

    <div class="min-h-screen bg-emerald-50">
      <main class="max-w-7xl mx-auto p-6">
        <div class="flex items-center gap-3 mb-8">
          <lucide-icon name="leaf" class="w-10 h-10 text-emerald-600"></lucide-icon>
          <div>
            <h1 class="text-4xl font-black text-emerald-800">Kits Sustentáveis</h1>
            <p class="text-emerald-700">Produtos próximos da validade ou cancelados com desconto especial</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (kit of service.kits(); track kit.id) {
            <div class="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
              <div class="relative">
                <img [src]="kit.imagemUrl" class="w-full h-52 object-cover" *ngIf="kit.imagemUrl">
                <div class="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  {{ kit.precoPromocional ? 'PROMOÇÃO' : 'KIT' }}
                </div>
              </div>

              <div class="p-6">
                <h3 class="font-bold text-xl text-gray-900">{{ kit.nome }}</h3>
                <p class="text-emerald-600 font-medium">{{ kit.restaurante?.nome || 'Vários Restaurantes' }}</p>

                <div class="flex items-baseline gap-3 mt-4">
                  <span class="text-3xl font-black text-emerald-700">
                    {{ kit.precoPromocional | currency:'BRL' }}
                  </span>
                  @if (kit.precoPromocional) {
                    <span class="text-gray-400 line-through text-sm">
                      {{ kit.preco | currency:'BRL' }}
                    </span>
                  }
                </div>

                <p class="mt-5 text-sm flex items-center gap-2 text-emerald-700 font-medium">
                  <lucide-icon name="leaf" class="w-5 h-5"></lucide-icon>
                  Você evitou <strong>{{ kit.co2EconomizadoKg || 2.5 }} kg de CO₂</strong>
                </p>

                <button (click)="adicionarAoCarrinho(kit)"
                  class="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition">
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          }

          @if (service.kits().length === 0) {
            <div class="col-span-full text-center py-20">
              <lucide-icon name="leaf" class="w-16 h-16 text-emerald-200 mx-auto"></lucide-icon>
              <p class="text-emerald-700 mt-4 text-lg">Nenhum kit sustentável disponível no momento.</p>
            </div>
          }
        </div>
      </main>
    </div>
  `
})
export class KitsComponent implements OnInit {
  service = inject(ApiService);

  ngOnInit() {
    this.service.listarKits();
  }

  adicionarAoCarrinho(item: any) {
    this.service.adicionarAoCarrinho(item);
    alert('Produto adicionado à sacola!');
  }
}