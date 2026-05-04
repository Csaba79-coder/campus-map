import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsLoggedIn, selectUsername } from './auth/store/auth.selectors';
import * as AuthActions from './auth/store/auth.actions';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    AsyncPipe,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private store = inject(Store);

  isLoggedIn$ = this.store.select(selectIsLoggedIn);
  username$ = this.store.select(selectUsername);

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
