import {inject} from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';

import {AuthService} from './auth.service';

// https://v15.angular.io/guide/router-tutorial-toh#milestone-5-route-guards
// https://jasonwatmore.com/post/2016/09/29/angular-2-user-registration-and-login-example-tutorial
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn) {
    return true;
  }

  // Redirect to the login page
  router.navigate(['/login'], { queryParams: { returnUrl: router.routerState.snapshot.url }});
  return false;
};