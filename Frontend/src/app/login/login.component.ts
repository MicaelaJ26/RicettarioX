import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [ReactiveFormsModule, CommonModule, RouterModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {  
  loginForm!: FormGroup;
  loginError: string = '';
  passwordFieldType: string = 'password';

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router, 
    private authService: AuthService  
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  get email() { return this.loginForm.get('email') as FormControl; }
  get password() { return this.loginForm.get('password') as FormControl; }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials.email, credentials.password).subscribe({
      next: (response: any) => {
        if (response.access) {
          localStorage.setItem('access_token', response.access);
          this.router.navigate(['/home']);  
        } else {
          this.loginError = 'Impossibile accedere. Verificare le credenziali.';
        }
      },
      error: (error: any) => {
        console.error('Error en login:', error);
        this.loginError = error.error?.message || 'Errore di login.';
      }
    });
  }
  togglePassword(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
  
}
