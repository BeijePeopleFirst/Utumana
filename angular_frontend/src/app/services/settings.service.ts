import { Injectable } from '@angular/core';
import { Theme } from '../models/theme';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL_PREFIX } from 'src/costants';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private http: HttpClient
  ) { }

  private getRGBTuple(hex: string): string {
    let color = hex.replace(/#/g, "")
    // rgb values
    let r = parseInt(color.substring(0, 2), 16)
    let g = parseInt(color.substring(2, 4), 16)
    let b = parseInt(color.substring(4, 6), 16)

    return `${r}, ${g}, ${b}`
  }

  // // calculate contrast color to make text written on background in color "hex"  readable
  // private getAccessibleColor(hex: string) {
  //   let color = hex.replace(/#/g, "")
  //   // rgb values
  //   let r = parseInt(color.substring(0, 2), 16)
  //   let g = parseInt(color.substring(2, 4), 16)
  //   let b = parseInt(color.substring(4, 6), 16)
  //   let yiq = (r * 299 + g * 587 + b * 114) / 1000
  //   return yiq >= 128 ? "#000000" : "#FFFFFF"
  // }

  getTheme(): Observable<Theme> {
    return this.http.get<Theme>(`${BACKEND_URL_PREFIX}/api/settings/theme`);
  }

  getAndSetSavedTheme(): void {
    this.getTheme().subscribe(theme => {
      this.setTheme(theme);
    })
  }

  setTheme(theme: Theme): void {
    document.documentElement.style.setProperty('--primary-default', this.getRGBTuple(theme.primary_default));
    document.documentElement.style.setProperty('--primary-dark', this.getRGBTuple(theme.primary_dark));
    document.documentElement.style.setProperty('--primary-light', this.getRGBTuple(theme.primary_light));
    document.documentElement.style.setProperty('--secondary-default', this.getRGBTuple(theme.secondary_default));
    document.documentElement.style.setProperty('--secondary-dark', this.getRGBTuple(theme.secondary_dark));
    document.documentElement.style.setProperty('--secondary-light', this.getRGBTuple(theme.secondary_light));
    document.documentElement.style.setProperty('--neutral-1', this.getRGBTuple(theme.neutral1));
    document.documentElement.style.setProperty('--neutral-2', this.getRGBTuple(theme.neutral2));
  }

  updateTheme(theme: Theme): Observable<boolean> {
    return this.http.put<Theme>(`${BACKEND_URL_PREFIX}/api/settings/theme`, theme).pipe(
      map(updatedTheme => {
        this.setTheme(updatedTheme);
        return true;
      }),
      catchError(() => of(false))
    );
  }
}
