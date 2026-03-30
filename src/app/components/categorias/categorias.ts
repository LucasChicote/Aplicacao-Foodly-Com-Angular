import { Component } from '@angular/core';

@Component({
  selector: 'app-categorias',
  standalone: true,
  template: `
    <div class="flex gap-4 overflow-x-auto pb-4 no-scrollbar my-6">
      @for (c of lista; track c.nome) {
        <div class="flex-none flex flex-col items-center gap-2 cursor-pointer group">
          <div class="w-16 h-16 bg-white rounded-2xl shadow-sm border flex items-center justify-center text-3xl group-hover:border-orange-500 transition">
            {{ c.emoji }}
          </div>
          <span class="text-xs font-bold text-gray-600">{{ c.nome }}</span>
        </div>
      }
    </div>
  `,
  styles: `.no-scrollbar::-webkit-scrollbar { display: none; }`
})
export class CategoriasComponent {
  lista = [
    { nome: 'Promoções', emoji: '🏷️' },
    { nome: 'Lanches', emoji: '🍔' },
    { nome: 'Pizza', emoji: '🍕' },
    { nome: 'Japonesa', emoji: '🍣' },
    { nome: 'Doces', emoji: '🍦' },
    { nome: 'Bebidas', emoji: '🥤' }
  ];
}