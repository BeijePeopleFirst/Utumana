import { Component, OnInit } from '@angular/core';
import { Theme } from 'src/app/models/theme';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-admin-dashboard-customize',
  templateUrl: './admin-dashboard-customize.component.html',
  styleUrls: ['./admin-dashboard-customize.component.css']
})
export class AdminDashboardCustomizeComponent implements OnInit {
  theme!: Theme;
  currentTheme!: Theme;
  document = document;
  isColorsModalOpen: boolean = false;

  success: boolean = false;
  error: boolean = false;

  constructor(
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.loadTheme();
  }

  loadTheme(): void {
    this.settingsService.getTheme().subscribe(theme => {
      this.theme = theme;
      this.currentTheme = {
        primary_default: theme.primary_default,
        primary_dark: theme.primary_dark,
        primary_light: theme.primary_light,
        primary_contrast: theme.primary_contrast,
        secondary_default: theme.secondary_default,
        secondary_dark: theme.secondary_dark,
        secondary_light: theme.secondary_light,
        secondary_contrast: theme.secondary_contrast,
        neutral1: theme.neutral1,
        neutral2: theme.neutral2,
        neutral_contrast: theme.neutral_contrast
      };
      console.log("Theme: ", this.theme);
    });
  }

  resetTheme(): void {
    this.theme = {
      primary_default: this.currentTheme.primary_default,
      primary_dark: this.currentTheme.primary_dark,
      primary_light: this.currentTheme.primary_light,
      primary_contrast: this.currentTheme.primary_contrast,
      secondary_default: this.currentTheme.secondary_default,
      secondary_dark: this.currentTheme.secondary_dark,
      secondary_light: this.currentTheme.secondary_light,
      secondary_contrast: this.currentTheme.secondary_contrast,
      neutral1: this.currentTheme.neutral1,
      neutral2: this.currentTheme.neutral2,
      neutral_contrast: this.currentTheme.neutral_contrast
    };
  }

  updateTheme(): void {
    this.settingsService.updateTheme(this.theme).subscribe(ok => {
      if(ok === true){
        this.success = true;
        this.loadTheme();
        setTimeout(() => {
          this.success = false;
          this.closeConfirmColorsModal();
        }, 1500);
      }else{
        this.error = true;
      }
    });
  }

  showConfirmColorsModal(): void {
    this.isColorsModalOpen = true;
    document.body.style.overflow = 'hidden';
  }
  
  closeConfirmColorsModal(): void {
    this.isColorsModalOpen = false;
    document.body.style.overflow = 'auto';
  }
}
