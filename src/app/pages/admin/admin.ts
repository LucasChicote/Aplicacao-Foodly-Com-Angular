import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { HeaderComponent } from '../../components/header/header';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ReactiveFormsModule, LucideAngularModule],
  template: `
    <app-header />
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 p-4 pt-6">
      <div class="max-w-6xl mx-auto">

        <div class="bg-gradient-to-r from-gray-700 to-gray-900 rounded-3xl p-6 mb-6 text-white shadow-xl">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
              <lucide-icon name="shield" class="w-8 h-8 text-white"></lucide-icon>
            </div>
            <div>
              <p class="text-gray-300 text-sm font-bold uppercase tracking-widest">Painel do</p>
              <h1 class="text-2xl font-black">Administrador</h1>
              <p class="text-gray-400 text-sm mt-0.5">{{ service.getEmail() }}</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <lucide-icon name="users" class="w-5 h-5 text-green-500"></lucide-icon>
              <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Usuários</span>
            </div>
            <p class="text-2xl font-black text-gray-800">{{ usuarios().length }}</p>
          </div>
          <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <lucide-icon name="tag" class="w-5 h-5 text-teal-500"></lucide-icon>
              <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Categorias</span>
            </div>
            <p class="text-2xl font-black text-gray-800">{{ service.categorias().length }}</p>
          </div>
          <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <lucide-icon name="store" class="w-5 h-5 text-blue-500"></lucide-icon>
              <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Restaurantes</span>
            </div>
            <p class="text-2xl font-black text-gray-800">{{ service.restaurantes().length }}</p>
          </div>
          <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <lucide-icon name="utensils" class="w-5 h-5 text-orange-400"></lucide-icon>
              <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Produtos</span>
            </div>
            <p class="text-2xl font-black text-gray-800">{{ service.produtos().length }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="p-5 border-b border-gray-50 flex items-center justify-between">
              <h2 class="font-black text-gray-800 flex items-center gap-2">
                <lucide-icon name="users" class="w-5 h-5 text-green-500"></lucide-icon>
                Usuários Cadastrados
              </h2>
              <button (click)="recarregarUsuarios()"
                class="text-gray-400 hover:text-green-500 transition">
                <lucide-icon name="refresh-cw" class="w-4 h-4"></lucide-icon>
              </button>
            </div>
            <div class="divide-y divide-gray-50 max-h-80 overflow-y-auto">
              @for (u of usuarios(); track u.id) {
                <div class="flex items-center justify-between p-4 hover:bg-gray-50 transition">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl flex items-center justify-center"
                         [class.bg-green-100]="u.role === 'ROLE_CUSTOMER'"
                         [class.bg-teal-100]="u.role === 'ROLE_RESTAURANT_OWNER'"
                         [class.bg-gray-100]="u.role === 'ROLE_ADMIN'">
                      <lucide-icon
                        [name]="u.role === 'ROLE_ADMIN' ? 'shield' : u.role === 'ROLE_RESTAURANT_OWNER' ? 'store' : 'user'"
                        class="w-4 h-4"
                        [class.text-green-600]="u.role === 'ROLE_CUSTOMER'"
                        [class.text-teal-600]="u.role === 'ROLE_RESTAURANT_OWNER'"
                        [class.text-gray-500]="u.role === 'ROLE_ADMIN'">
                      </lucide-icon>
                    </div>
                    <div>
                      <p class="font-bold text-gray-800 text-sm">{{ u.nome }}</p>
                      <p class="text-xs text-gray-400">{{ u.email }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full"
                          [class.bg-green-50]="u.role === 'ROLE_CUSTOMER'"
                          [class.text-green-600]="u.role === 'ROLE_CUSTOMER'"
                          [class.bg-teal-50]="u.role === 'ROLE_RESTAURANT_OWNER'"
                          [class.text-teal-600]="u.role === 'ROLE_RESTAURANT_OWNER'"
                          [class.bg-gray-50]="u.role === 'ROLE_ADMIN'"
                          [class.text-gray-500]="u.role === 'ROLE_ADMIN'">
                      {{ getRoleLabel(u.role) }}
                    </span>
                    <button (click)="deletarUsuario(u.id)"
                      class="text-gray-300 hover:text-red-400 transition p-1 rounded-lg hover:bg-red-50">
                      <lucide-icon name="trash-2" class="w-4 h-4"></lucide-icon>
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="p-5 border-b border-gray-50">
              <h2 class="font-black text-gray-800 flex items-center gap-2 mb-4">
                <lucide-icon name="tag" class="w-5 h-5 text-teal-500"></lucide-icon>
                Categorias
              </h2>
              
              <form [formGroup]="categoriaForm" (ngSubmit)="criarCategoria()" class="flex gap-2">
                <input formControlName="nome" placeholder="Nova categoria..."
                  class="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-300 transition text-gray-700">
                <button type="submit" [disabled]="categoriaForm.invalid"
                  class="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:from-green-600 hover:to-teal-600 transition disabled:from-gray-200 disabled:to-gray-200 flex items-center gap-1">
                  <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
                  Add
                </button>
              </form>
            </div>
            <div class="p-4 flex flex-wrap gap-2 max-h-64 overflow-y-auto">
              @for (c of service.categorias(); track c.id) {
                <div class="flex items-center gap-2 bg-teal-50 border border-teal-100 text-teal-700 text-sm font-bold px-3 py-2 rounded-xl">
                  <lucide-icon name="tag" class="w-3.5 h-3.5"></lucide-icon>
                  {{ c.nome }}
                  <button (click)="deletarCategoria(c.id)"
                    class="text-teal-300 hover:text-red-400 transition ml-1">
                    <lucide-icon name="x" class="w-3.5 h-3.5"></lucide-icon>
                  </button>
                </div>
              }
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class AdminComponent implements OnInit {
  service = inject(ApiService);
  private fb = inject(FormBuilder);

  usuarios = signal<any[]>([]);

  categoriaForm = this.fb.group({
    nome: ['', Validators.required]
  });

  ngOnInit() {
    this.recarregarUsuarios();
    this.service.listarCategorias();
    this.service.listarRestaurantes();
    this.service.listarProdutos();
  }

  recarregarUsuarios() {
    this.service.listarUsuarios().subscribe(res => this.usuarios.set(res));
  }

  getRoleLabel(role: string): string {
    if (role === 'ROLE_ADMIN') return 'Admin';
    if (role === 'ROLE_RESTAURANT_OWNER') return 'Restaurante';
    return 'Cliente';
  }

  deletarUsuario(id: number) {
    if (!confirm('Remover este usuário?')) return;
    this.service.deletarUsuario(id).subscribe(() => this.recarregarUsuarios());
  }

  criarCategoria() {
    if (this.categoriaForm.invalid) return;
    const { nome } = this.categoriaForm.value;
    this.service.criarCategoria({ nome: nome! }).subscribe(() => {
      this.categoriaForm.reset();
      this.service.listarCategorias();
    });
  }

  deletarCategoria(id: number) {
    if (!confirm('Remover esta categoria?')) return;
    this.service.deletarCategoria(id).subscribe(() => this.service.listarCategorias());
  }
}