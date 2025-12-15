import { StudentService } from './../../services/student-service';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule,RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
    username=signal('');
    email=signal('');
    password=signal('');

    constructor(private service: StudentService, private router: Router) {}

    register(){
      this.service.register(this.username(),this.email(),this.password()).subscribe({
        next: (res) => {
          this.router.navigate(['/login']); 
        },
        error: (err) => {
          console.error('Registration failed:', err);
          console.error('Status:', err.status);
          console.error('Status Text:', err.statusText);
          console.error('Error Body:', err.error);
          console.error('Full URL:', err.url);
        }
      });
    }
}