import { Component } from '@angular/core';
import { FullscreenService } from './service/fullscreen.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'OSINT3.0';
  isAdmin: boolean = false;
  username: string = '';
  welcomeMessage: string = '';

  constructor(
    private fullscreenService: FullscreenService,
    private router: Router,
    private cdr: ChangeDetectorRef // Add this line
  ) {  }

  ngOnInit() {

  }

    isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // adjust based on how you store login
  }

  getUsername(): string {
    return localStorage.getItem('username') || ''; // store username on login
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }

  toggleFullscreen() {
    const element = document.documentElement;
    this.fullscreenService.toggleFullscreen(element);
  }

  isFullscreen() {
    return this.fullscreenService.getFullscreenStatus();
  }

}
