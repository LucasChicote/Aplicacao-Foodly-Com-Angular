import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../service/api.service';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  private fb     = inject(FormBuilder);
  private router = inject(Router);
  service        = inject(ApiService);

  carregando  = false;
  erroLogin   = '';
  mostrarSenha = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required]
  });

  toggleSenha() { this.mostrarSenha.update(v => !v); }

  entrar() {
    if (this.loginForm.invalid) return;
    this.carregando = true;
    this.erroLogin  = '';

    this.service.login(this.loginForm.value as any).subscribe({
      next: (res: any) => {
        this.carregando = false;
        this.service.salvarSessao(res.token, res.nome, res.email, res.role);
        
        if (res.role === 'ROLE_ADMIN')            this.router.navigate(['/admin']);
        else if (res.role === 'ROLE_RESTAURANT_OWNER') this.router.navigate(['/dashboard-owner']);
        else                                           this.router.navigate(['/home']);
      },
      error: (err: any) => {
        this.carregando = false;
        this.erroLogin = (err.status === 401 || err.status === 403)
          ? 'E-mail ou senha incorretos.'
          : 'Erro ao conectar com o servidor.';
      }
    });
  }
}