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
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberme: [false]   // default unchecked
    });

  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  loginUser() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value; // { email, password, rememberme }
      this.accountService.login(credentials).subscribe({
        next: (res) => {
          console.log('Login successful:', res);
          if (credentials.rememberme) {
            localStorage.setItem('token', res.token);  // persist token
          } else {
            sessionStorage.setItem('token', res.token); // session-only
          }
        },
        error: (err) => {
          console.error('Login failed:', err);
        }
      });
    }
  }

}
