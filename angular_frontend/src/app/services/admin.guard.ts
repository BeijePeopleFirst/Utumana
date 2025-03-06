import {inject} from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';

import {AuthService} from './auth.service';

export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn) {
    let isAdmin = false;
    let roles = localStorage.getItem("roles");
    if(roles != null){
      isAdmin = JSON.parse(roles).includes("ADMIN");
    }
    if (isAdmin){
        return true;
    }else {
        // If user is logged but is not an admin, redirect to the home page
        router.navigate(['/']);
        return false;
    }
  }

  // If user is not logged, redirect to the login page
  router.navigate(['/login'], { queryParams: { returnUrl: router.routerState.snapshot.url }});
  return false;
};