import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  async login() {
    this.error = null;
    this.loading = true;
    try {
      const response = await fetch('http://localhost:3000/api/login', {
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

      if (!response.ok || result.status !== 200) {
        this.error = result.message || 'Inloggen mislukt';
        this.loading = false;
        return;
      }

      // Login succesvol, doe hier wat je wilt met het resultaat
      alert('Login succesvol!');
      // Bijvoorbeeld: sla privateKey op in localStorage
      // localStorage.setItem('privateKey', result.data.privateKey);

    } catch (err) {
      this.error = 'Er is een fout opgetreden bij het inloggen.';
    } finally {
      this.loading = false;
    }
  }
}