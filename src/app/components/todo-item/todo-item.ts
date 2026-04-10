import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">

      <div class="w-full h-44 bg-gradient-to-br from-green-50 to-teal-50 overflow-hidden flex items-center justify-center relative">
        @if (item().imagemUrl) {
          <img [src]="item().imagemUrl" [alt]="item().nome"
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        } @else {
          <span class="text-6xl opacity-60">🍽️</span>
        }
        @if (item().restaurante) {
          <div class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-bold text-green-700 px-3 py-1 rounded-full border border-green-100">
            🏪 {{ item().restaurante }}
          </div>
        }
      </div>

      <div class="p-5">
        @if (item().categoria) {
          <span class="text-[10px] font-black text-teal-500 uppercase tracking-widest">{{ item().categoria }}</span>
        }
        <h3 class="font-black text-gray-800 text-base mt-1 leading-tight">{{ item().nome }}</h3>
        <p class="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
          {{ item().descricao || 'Ingredientes selecionados com cuidado e qualidade.' }}
        </p>

        <div class="flex items-center justify-between mt-4">
          <span class="font-black text-xl text-green-600">{{ item().preco | currency:'BRL' }}</span>
          <button (click)="adicionar.emit(item())"
            class="bg-gradient-to-r from-green-500 to-teal-500 text-white w-10 h-10 rounded-2xl flex items-center justify-center hover:from-green-600 hover:to-teal-600 shadow-md shadow-green-200 active:scale-90 transition-all text-xl font-bold">
            +
          </button>
        </div>
      </div>
    </div>
  `
})
export class TodoItemComponent {
  item = input.required<any>();
  adicionar = output<any>();
}