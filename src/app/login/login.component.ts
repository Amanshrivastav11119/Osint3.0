import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../service/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  loginUser() {
    if (this.loginForm.invalid) return;

    const credentials = this.loginForm.value;

    this.accountService.login(credentials).subscribe({
      next: (res) => {
        console.log('Login success:', res);
        // alert('Login successful');
        if (res.token) {
          localStorage.setItem('token', res.token);
        }
        this.router.navigate(['/dashboard']); // navigate after login
      },
      error: (err) => {
        console.error('Login error:', err);
        alert('Invalid email or password or connection failed');
      }
    });
  }
}
