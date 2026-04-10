import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

type Role = 'ROLE_CUSTOMER' | 'ROLE_RESTAURANT_OWNER' | 'ROLE_ADMIN';
type Etapa = 'tipo' | 'dados';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './form.html'
})
export class FormComponent {
  private fb     = inject(FormBuilder);
  private service = inject(ApiService);
  private router  = inject(Router);

  etapa          = signal<Etapa>('tipo');
  roleSelecionada = signal<Role>('ROLE_CUSTOMER');
  mostrarSenha   = signal(false);
  carregando     = false;
  erro           = '';
  cepCarregando  = false;

  tipos = [
    {
      role: 'ROLE_CUSTOMER' as Role,
      icon: 'user',
      titulo: 'Cliente',
      descricao: 'Quero explorar restaurantes e fazer pedidos.',
      cor: 'green'
    },
    {
      role: 'ROLE_RESTAURANT_OWNER' as Role,
      icon: 'store',
      titulo: 'Restaurante',
      descricao: 'Quero cadastrar meu restaurante e vender pratos.',
      cor: 'teal'
    },
    {
      role: 'ROLE_ADMIN' as Role,
      icon: 'shield',
      titulo: 'Administrador',
      descricao: 'Acesso administrativo à plataforma Foodly.',
      cor: 'gray'
    }
  ];

  form = this.fb.group({
    nome:   ['', Validators.required],
    email:  ['', [Validators.required, Validators.email]],
    senha:  ['', [Validators.required, Validators.minLength(6)]],
    cep:    ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
    rua:    [{ value: '', disabled: true }],
    bairro: [{ value: '', disabled: true }]
  });

  toggleSenha() { this.mostrarSenha.update(v => !v); }

  selecionarTipo(role: Role) {
    this.roleSelecionada.set(role);
    this.etapa.set('dados');
  }

  voltarEtapa() {
    this.etapa.set('tipo');
    this.erro = '';
    this.form.reset();
  }

  getTipoAtual() {
    return this.tipos.find(t => t.role === this.roleSelecionada())!;
  }

  getLabelNome(): string {
    if (this.roleSelecionada() === 'ROLE_RESTAURANT_OWNER') return 'Nome do Responsável';
    if (this.roleSelecionada() === 'ROLE_ADMIN') return 'Nome do Administrador';
    return 'Nome Completo';
  }

  getPlaceholderNome(): string {
    if (this.roleSelecionada() === 'ROLE_RESTAURANT_OWNER') return 'Ex: Carlos Silva';
    if (this.roleSelecionada() === 'ROLE_ADMIN') return 'Ex: Admin Foodly';
    return 'Ex: Ana Costa';
  }

  buscarEndereco() {
    const cep = this.form.get('cep')?.value;
    if (cep && cep.length === 8) {
      this.cepCarregando = true;
      this.service.buscarCep(cep).subscribe({
        next: (res) => {
          this.cepCarregando = false;
          this.form.patchValue({ rua: res.logradouro, bairro: res.bairro });
        },
        error: () => {
          this.cepCarregando = false;
          this.erro = 'CEP não encontrado.';
        }
      });
    }
  }

  enviar() {
    if (this.form.invalid) return;
    this.carregando = true;
    this.erro = '';

    const raw = this.form.getRawValue();
    const payload = {
      nome:  raw.nome!,
      email: raw.email!,
      senha: raw.senha!,
      cep:   raw.cep!,
      role:  this.roleSelecionada() 
    };

    this.service.cadastrar(payload).subscribe({
      next: (res) => {
        this.carregando = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.carregando = false;
        if (err.error?.erro?.toLowerCase().includes('e-mail')) {
          this.erro = 'Este e-mail já está cadastrado.';
        } else {
          this.erro = err.error?.erro ?? 'Erro ao cadastrar. Tente novamente.';
        }
      }
    });
  }
}