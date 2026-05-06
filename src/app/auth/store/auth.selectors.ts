import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  (state) => !!state.token
);

export const selectUsername = createSelector(
  selectAuthState,
  (state) => state.username
);

export const selectUserId = createSelector(
  selectAuthState,
  (state) => state.userId
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);
