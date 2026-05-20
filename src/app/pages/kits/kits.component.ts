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
        <h1 class="text-4xl font-black text-emerald-800 mb-2 flex items-center gap-3">
          🌱 Kits Sustentáveis
        </h1>
        <p class="text-emerald-700 text-lg mb-10">Produtos próximos da validade com desconto + impacto ambiental</p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (kit of service.kits(); track kit.id) {
            <div class="bg-white rounded-3xl overflow-hidden shadow-xl">
              <img [src]="kit.imagemUrl" class="w-full h-52 object-cover" *ngIf="kit.imagemUrl">
              <div class="p-6">
                <h3 class="font-bold text-xl">{{ kit.nome }}</h3>
                <p class="text-emerald-600 font-semibold">{{ kit.restaurante?.nome }}</p>
                
                <div class="flex gap-3 mt-4">
                  <span class="text-3xl font-black text-emerald-700">
                    {{ kit.precoPromocional | currency:'BRL' }}
                  </span>
                  <span class="text-gray-400 line-through">{{ kit.preco | currency:'BRL' }}</span>
                </div>

                <p class="mt-4 text-sm flex items-center gap-2 text-emerald-600">
                  <lucide-icon name="leaf"></lucide-icon>
                  Você ajudou a evitar <strong>{{ kit.co2EconomizadoKg }} kg de CO₂</strong>
                </p>

                <button (click)="adicionarAoCarrinho(kit)" 
                  class="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl">
                  Adicionar ao carrinho
                </button>
              </div>
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
  }
}