import {inject} from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';

import {AuthService} from './auth.service';
import { lastValueFrom } from 'rxjs';

export const adminGuard = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn) {
    let checkIsAdmin = authService.isAdmin();
    let isAdmin;
    await lastValueFrom(checkIsAdmin).then(isUserAdmin => {
      isAdmin = isUserAdmin;
      authService.isUserAdmin$.next(isAdmin);
    });
    console.log("Checking if is admin");
    if (isAdmin){
      return true;
    }else {
      // If user is logged but is not an admin, redirect to the home page
      router.navigate(['/']);
      return false;
    }
  }else{
    // If user is not logged, redirect to the login page
    router.navigate(['/login'], { queryParams: { returnUrl: router.routerState.snapshot.url }});
    return false;
  }
};