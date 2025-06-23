import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';  // <-- import Router

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  username = '';
  password = '';
  error: string | null = null;
  loading = false;

  constructor(private router: Router) {}

async login() {
  this.error = null;
  this.loading = true;
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.username,
        password: this.password
      })
    });

    const result = await response.json();
    console.log('Login response:', result);

    if (!response.ok || result.statusCode !== 200) {
      this.error = result.message || 'Inloggen mislukt';
      return;
    }

    document.cookie = `privateKey=${encodeURIComponent(result.data.privateKey)}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `userId=${encodeURIComponent(result.data.userId)}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `user=${encodeURIComponent(this.username)}; path=/; max-age=86400; SameSite=Lax`;

    setTimeout(() => {
      const cookies = document.cookie.split(';');
      const privateKeyCookie = cookies.find(c => c.trim().startsWith('privateKey='));
      const privateKey = privateKeyCookie ? decodeURIComponent(privateKeyCookie.split('=')[1]) : null;
      console.log('Gelezen privateKey uit cookie:', privateKey);

      this.router.navigateByUrl('/');
    }, 100);

  } catch (err) {
    this.error = 'Er is een fout opgetreden bij het inloggen.';
  } finally {
    this.loading = false;
  }
}

}
