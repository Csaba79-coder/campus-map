import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  login(username: string, password: string): Observable<{ username: string; token: string; userId: string }> {
    return this.http.post<{ username: string; token: string; userId: string }>(
      `${this.apiUrl}/api/login`,
      { username, password }
    );
  }
}
