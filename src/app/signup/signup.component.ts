import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AccountService } from '../service/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  submitDetails() {
    if (this.signupForm.invalid) return;

    const userData = {
      username: this.signupForm.value.username,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
      confirmpassword: this.signupForm.value.confirmPassword
    };

    this.accountService.signup(userData).subscribe({
  next: (res) => {
    console.log('Signup success:', res);
    alert('Registration successful');

    // Prepare login data
    const loginData = {
      email: userData.email,
      password: userData.password
    };

    // Automatically login after signup
    this.accountService.login(loginData).subscribe({
      next: (loginRes: any) => {
        console.log('Login success:', loginRes);

        // Save token or user info if API returns it
        localStorage.setItem('token', loginRes.token);

        // Navigate to dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (loginErr) => {
        console.error('Login failed after signup', loginErr);
        alert('Signup successful, but auto-login failed. Please login manually.');
        this.router.navigate(['/login']);
      }
    });
  },
  error: (err) => {
    console.error('Signup error:', err);
    alert('Registration failed');
  }
   });

  }
}
