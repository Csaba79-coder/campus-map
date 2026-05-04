import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsLoggedIn } from '../store/auth.selectors';
import { map } from 'rxjs';

export const guestGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsLoggedIn).pipe(
    map((loggedIn) => {
      if (loggedIn) {
        router.navigate(['/']);
        return false;
      }
      return true;
    })
  );
};
