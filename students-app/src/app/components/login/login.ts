import { Component, signal } from '@angular/core';
import { StudentService } from '../../services/student-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = signal('');
  password = signal('');
  error = signal('');

  constructor(private service: StudentService, private router: Router) {}

   login() {
    this.service.login(this.email(), this.password()).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/components/students']); 
      },
       error: (err) => {
              console.error('Login failed:', err);
              console.error('Status:', err.status);
              console.error('Status Text:', err.statusText);
              console.error('Error Body:', err.error);
              console.error('Full URL:', err.url);
              this.error.set('Invalid credentials');
      }
    });
  }

}
