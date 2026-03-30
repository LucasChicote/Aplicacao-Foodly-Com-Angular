import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form.html' 
})
export class FormComponent {
  private fb = inject(FormBuilder);
  private service = inject(ApiService);
  private router = inject(Router);

  CadastroForm = this.fb.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    cep: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
    rua: [{ value: '', disabled: true }],
    bairro: [{ value: '', disabled: true }]
  });

  buscarEndereco() {
    const cep = this.CadastroForm.get('cep')?.value;
    if (cep && cep.length === 8) {
      this.service.buscarCep(cep).subscribe({
        next: (res) => {
          this.CadastroForm.patchValue({ 
            rua: res.logradouro, 
            bairro: res.bairro 
          });
        },
        error: (err) => console.error(err)
      });
    }
  }

  enviar() {
    if (this.CadastroForm.valid) {
      const dadosParaEnviar = this.CadastroForm.getRawValue();
      this.service.salvar(dadosParaEnviar).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => console.error(err)
      });
    }
  }
}