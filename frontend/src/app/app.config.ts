import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import {
  MAT_DATE_FNS_FORMATS,
  provideDateFnsAdapter,
} from '@angular/material-date-fns-adapter';
import { enUS } from 'date-fns/locale';

const EN_US_DATE_FORMATS = {
  parse: { dateInput: 'MM/dd/yyyy' },
  display: {
    dateInput: 'MM/dd/yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'MMMM d, yyyy',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimations(),
    provideHttpClient(),
    provideDateFnsAdapter(EN_US_DATE_FORMATS),
    { provide: LOCALE_ID, useValue: 'en-US' },
    { provide: MAT_DATE_LOCALE, useValue: enUS },
  ],
};
