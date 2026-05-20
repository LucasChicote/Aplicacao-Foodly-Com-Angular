import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">

      <div class="w-full h-40 bg-gray-100 overflow-hidden flex items-center justify-center relative">
        @if (item().imagemUrl) {
          <img [src]="item().imagemUrl" [alt]="item().nome"
               class="w-full h-full object-cover">
        } @else {
          <lucide-icon name="utensils" class="w-10 h-10 text-gray-300"></lucide-icon>
        }
        @if (item().restaurante) {
          <div class="absolute top-2 left-2 bg-white text-xs font-semibold text-gray-700 px-2.5 py-1 rounded-full border border-gray-100 shadow-sm">
            {{ item().restaurante }}
          </div>
        }
      </div>

      <div class="p-4">
        @if (item().categoria) {
          <span class="text-[10px] font-bold text-red-500 uppercase tracking-widest">{{ item().categoria }}</span>
        }
        <h3 class="font-bold text-gray-900 text-sm mt-0.5 leading-tight">{{ item().nome }}</h3>
        <p class="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
          {{ item().descricao || 'Ingredientes selecionados com cuidado.' }}
        </p>

        <div class="flex items-center justify-between mt-3">
          <span class="font-black text-lg text-gray-900">{{ item().preco | currency:'BRL' }}</span>
          <button (click)="adicionar.emit(item())"
            class="bg-red-500 text-white w-9 h-9 rounded-xl flex items-center justify-center hover:bg-red-600 active:scale-90 transition-all">
            <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
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
