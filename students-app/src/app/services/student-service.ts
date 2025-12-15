import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, tap, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl = 'http://localhost:5296/api/students';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(
      'http://localhost:5296/api/auth/register',
      { userName: username, email, password }
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>('http://localhost:5296/api/auth/login', { email, password })
      .pipe(
        tap(res => {
          if (isPlatformBrowser(this.platformId) && res?.token) {
            localStorage.setItem('token', res.token);
          }
        })
      );
  }

  private getAuthHeaders() {
    if (!isPlatformBrowser(this.platformId)) {
      return {};
    }

    const token = localStorage.getItem('token');
    if (!token) return {};

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  getStudents(): Observable<any[]> {
    if (!isPlatformBrowser(this.platformId)) {
      return of([]);
    }

    return this.http.get<any[]>(this.apiUrl, this.getAuthHeaders());
  }

  addStudent(student: any): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
        return of({}); 
    }
    return this.http.post<any>(this.apiUrl, student, this.getAuthHeaders());
  }

  updateStudent(student: any): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
        return of({}); 
    }
    return this.http.put<any>(
      `${this.apiUrl}/${student.id}`,
      student,
      this.getAuthHeaders()
    );
  }

  deleteStudent(id: number): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
        return of({}); 
    }
    return this.http.delete<any>(
      `${this.apiUrl}/${id}`,
      this.getAuthHeaders()
    );
  }
}