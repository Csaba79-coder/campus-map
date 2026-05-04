import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  login(username: string, password: string): Observable<{ username: string; token: string }> {
    return this.http
      .get<any[]>(`${this.apiUrl}/users`, {
        params: { username, password },
      })
      .pipe(
        map((users) => {
          if (users.length === 0) {
            throw new Error('Invalid username or password');
          }
          return { username: users[0].username, token: users[0].token };
        })
      );
  }
}
