import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { HeaderComponent } from '../../components/header/header';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

type FiltroRole = 'TODOS' | 'ROLE_CUSTOMER' | 'ROLE_RESTAURANT_OWNER' | 'ROLE_ADMIN';

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
            <div class="flex items-center justify-between mb-2">
              <lucide-icon name="users" class="w-5 h-5 text-green-500"></lucide-icon>
              <span class="text-xs font-bold text-gray-400 uppercase">Total</span>
            </div>
            <p class="text-2xl font-black text-gray-800">{{ usuarios().length }}</p>
            <p class="text-xs text-gray-400 mt-0.5">usuários</p>
          </div>
          <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div class="flex items-center justify-between mb-2">
              <lucide-icon name="user" class="w-5 h-5 text-green-500"></lucide-icon>
              <span class="text-xs font-bold text-gray-400 uppercase">Clientes</span>
            </div>
            <p class="text-2xl font-black text-gray-800">{{ contarRole('ROLE_CUSTOMER') }}</p>
          </div>
          <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div class="flex items-center justify-between mb-2">
              <lucide-icon name="store" class="w-5 h-5 text-teal-500"></lucide-icon>
              <span class="text-xs font-bold text-gray-400 uppercase">Restaurantes</span>
            </div>
            <p class="text-2xl font-black text-gray-800">{{ contarRole('ROLE_RESTAURANT_OWNER') }}</p>
          </div>
          <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div class="flex items-center justify-between mb-2">
              <lucide-icon name="shield" class="w-5 h-5 text-gray-500"></lucide-icon>
              <span class="text-xs font-bold text-gray-400 uppercase">Admins</span>
            </div>
            <p class="text-2xl font-black text-gray-800">{{ contarRole('ROLE_ADMIN') }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            <div class="p-5 border-b border-gray-50">
              <div class="flex items-center justify-between mb-4">
                <h2 class="font-black text-gray-800 flex items-center gap-2">
                  <lucide-icon name="users" class="w-5 h-5 text-green-500"></lucide-icon>
                  Usuários Cadastrados
                </h2>
                <button (click)="recarregarUsuarios()"
                  class="p-2 rounded-xl text-gray-400 hover:text-green-500 hover:bg-green-50 transition">
                  <lucide-icon name="refresh-cw" class="w-4 h-4"></lucide-icon>
                </button>
              </div>

              <div class="flex gap-2 flex-wrap">

                <button (click)="filtroAtivo.set('TODOS')"
                  class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black border-2 transition-all"
                  [class.bg-gray-800]="filtroAtivo() === 'TODOS'"
                  [class.text-white]="filtroAtivo() === 'TODOS'"
                  [class.border-gray-800]="filtroAtivo() === 'TODOS'"
                  [class.bg-white]="filtroAtivo() !== 'TODOS'"
                  [class.text-gray-500]="filtroAtivo() !== 'TODOS'"
                  [class.border-gray-100]="filtroAtivo() !== 'TODOS'"
                  [class.hover:border-gray-300]="filtroAtivo() !== 'TODOS'">
                  <lucide-icon name="users" class="w-3.5 h-3.5"></lucide-icon>
                  Todos ({{ usuarios().length }})
                </button>

                <button (click)="filtroAtivo.set('ROLE_CUSTOMER')"
                  class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black border-2 transition-all"
                  [class.bg-green-500]="filtroAtivo() === 'ROLE_CUSTOMER'"
                  [class.text-white]="filtroAtivo() === 'ROLE_CUSTOMER'"
                  [class.border-green-500]="filtroAtivo() === 'ROLE_CUSTOMER'"
                  [class.bg-white]="filtroAtivo() !== 'ROLE_CUSTOMER'"
                  [class.text-gray-500]="filtroAtivo() !== 'ROLE_CUSTOMER'"
                  [class.border-gray-100]="filtroAtivo() !== 'ROLE_CUSTOMER'"
                  [class.hover:border-green-300]="filtroAtivo() !== 'ROLE_CUSTOMER'">
                  <lucide-icon name="user" class="w-3.5 h-3.5"></lucide-icon>
                  Clientes ({{ contarRole('ROLE_CUSTOMER') }})
                </button>

                <button (click)="filtroAtivo.set('ROLE_RESTAURANT_OWNER')"
                  class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black border-2 transition-all"
                  [class.bg-teal-500]="filtroAtivo() === 'ROLE_RESTAURANT_OWNER'"
                  [class.text-white]="filtroAtivo() === 'ROLE_RESTAURANT_OWNER'"
                  [class.border-teal-500]="filtroAtivo() === 'ROLE_RESTAURANT_OWNER'"
                  [class.bg-white]="filtroAtivo() !== 'ROLE_RESTAURANT_OWNER'"
                  [class.text-gray-500]="filtroAtivo() !== 'ROLE_RESTAURANT_OWNER'"
                  [class.border-gray-100]="filtroAtivo() !== 'ROLE_RESTAURANT_OWNER'"
                  [class.hover:border-teal-300]="filtroAtivo() !== 'ROLE_RESTAURANT_OWNER'">
                  <lucide-icon name="store" class="w-3.5 h-3.5"></lucide-icon>
                  Restaurantes ({{ contarRole('ROLE_RESTAURANT_OWNER') }})
                </button>

                <button (click)="filtroAtivo.set('ROLE_ADMIN')"
                  class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black border-2 transition-all"
                  [class.bg-gray-700]="filtroAtivo() === 'ROLE_ADMIN'"
                  [class.text-white]="filtroAtivo() === 'ROLE_ADMIN'"
                  [class.border-gray-700]="filtroAtivo() === 'ROLE_ADMIN'"
                  [class.bg-white]="filtroAtivo() !== 'ROLE_ADMIN'"
                  [class.text-gray-500]="filtroAtivo() !== 'ROLE_ADMIN'"
                  [class.border-gray-100]="filtroAtivo() !== 'ROLE_ADMIN'"
                  [class.hover:border-gray-400]="filtroAtivo() !== 'ROLE_ADMIN'">
                  <lucide-icon name="shield" class="w-3.5 h-3.5"></lucide-icon>
                  Admins ({{ contarRole('ROLE_ADMIN') }})
                </button>

              </div>
            </div>

            <div class="divide-y divide-gray-50 max-h-[420px] overflow-y-auto">
              @if (usuariosFiltrados().length === 0) {
                <div class="text-center py-12 text-gray-300">
                  <lucide-icon name="users" class="w-8 h-8 mx-auto mb-2"></lucide-icon>
                  <p class="text-sm font-bold">Nenhum usuário nesta categoria</p>
                </div>
              }

              @for (u of usuariosFiltrados(); track u.id) {
                <div class="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/80 transition group">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-none"
                         [class.bg-green-50]="u.role === 'ROLE_CUSTOMER'"
                         [class.bg-teal-50]="u.role === 'ROLE_RESTAURANT_OWNER'"
                         [class.bg-gray-100]="u.role === 'ROLE_ADMIN'">
                      <lucide-icon
                        [name]="u.role === 'ROLE_ADMIN' ? 'shield' : u.role === 'ROLE_RESTAURANT_OWNER' ? 'store' : 'user'"
                        class="w-4 h-4"
                        [class.text-green-500]="u.role === 'ROLE_CUSTOMER'"
                        [class.text-teal-500]="u.role === 'ROLE_RESTAURANT_OWNER'"
                        [class.text-gray-500]="u.role === 'ROLE_ADMIN'">
                      </lucide-icon>
                    </div>
                    <div>
                      <p class="font-bold text-gray-800 text-sm">{{ u.nome }}</p>
                      <p class="text-xs text-gray-400">{{ u.email }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <span class="hidden sm:inline text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
                          [class.bg-green-50]="u.role === 'ROLE_CUSTOMER'"
                          [class.text-green-600]="u.role === 'ROLE_CUSTOMER'"
                          [class.bg-teal-50]="u.role === 'ROLE_RESTAURANT_OWNER'"
                          [class.text-teal-600]="u.role === 'ROLE_RESTAURANT_OWNER'"
                          [class.bg-gray-100]="u.role === 'ROLE_ADMIN'"
                          [class.text-gray-500]="u.role === 'ROLE_ADMIN'">
                      {{ getRoleLabel(u.role) }}
                    </span>
                    
                    <button (click)="deletarUsuario(u.id, u.nome)"
                      class="p-1.5 rounded-lg text-gray-200 hover:text-red-400 hover:bg-red-50 transition opacity-0 group-hover:opacity-100">
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
                  class="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-300 transition text-gray-700 min-w-0">
                <button type="submit" [disabled]="categoriaForm.invalid"
                  class="bg-gradient-to-r from-green-500 to-teal-500 text-white px-3 py-2.5 rounded-xl font-bold text-sm hover:from-green-600 hover:to-teal-600 transition disabled:from-gray-200 disabled:to-gray-200 flex-none">
                  <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
                </button>
              </form>
            </div>
            <div class="p-4 flex flex-wrap gap-2 max-h-80 overflow-y-auto">
              @for (c of service.categorias(); track c.id) {
                <div class="flex items-center gap-1.5 bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold px-3 py-2 rounded-xl">
                  <lucide-icon name="tag" class="w-3 h-3 flex-none"></lucide-icon>
                  <span>{{ c.nome }}</span>
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

    @if (toastMsg()) {
      <div class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm font-bold px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 z-50 animate-bounce-once">
        <lucide-icon name="check-circle" class="w-4 h-4 text-green-400"></lucide-icon>
        {{ toastMsg() }}
      </div>
    }
  `
})
export class AdminComponent implements OnInit {
  service = inject(ApiService);
  private fb = inject(FormBuilder);

  usuarios    = signal<any[]>([]);
  filtroAtivo = signal<FiltroRole>('TODOS');
  toastMsg    = signal('');

  categoriaForm = this.fb.group({ nome: ['', Validators.required] });

  usuariosFiltrados = computed(() => {
    const f = this.filtroAtivo();
    return f === 'TODOS' ? this.usuarios() : this.usuarios().filter(u => u.role === f);
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

  contarRole(role: string): number {
    return this.usuarios().filter(u => u.role === role).length;
  }

  getRoleLabel(role: string): string {
    if (role === 'ROLE_ADMIN') return 'Admin';
    if (role === 'ROLE_RESTAURANT_OWNER') return 'Restaurante';
    return 'Cliente';
  }

  deletarUsuario(id: number, nome: string) {
    if (!confirm(`Remover o usuário "${nome}"?\nEsta ação não pode ser desfeita.`)) return;
    this.service.deletarUsuario(id).subscribe({
      next: () => {
        this.recarregarUsuarios();
        this.toast(`Usuário "${nome}" removido.`);
      },
      error: () => this.toast('Erro ao remover usuário.')
    });
  }

  criarCategoria() {
    const { nome } = this.categoriaForm.value;
    this.service.criarCategoria({ nome: nome! }).subscribe(() => {
      this.categoriaForm.reset();
      this.service.listarCategorias();
      this.toast(`Categoria "${nome}" criada!`);
    });
  }

  deletarCategoria(id: number) {
    if (!confirm('Remover esta categoria?')) return;
    this.service.deletarCategoria(id).subscribe(() => {
      this.service.listarCategorias();
      this.toast('Categoria removida.');
    });
  }

  private toast(msg: string) {
    this.toastMsg.set(msg);
    setTimeout(() => this.toastMsg.set(''), 3000);
  }
}