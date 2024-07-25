import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { NgxSpinnerModule } from 'ngx-spinner';
import {
  provideAngularQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';

import { AuthInterceptor } from './auth/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    provideAngularQuery(
      new QueryClient({
        defaultOptions: { queries: { refetchOnWindowFocus: false } },
      })
    ),
    importProvidersFrom(NgxSpinnerModule.forRoot({ type: 'square-jelly-box' })),
    provideAnimations(),
    provideAnimationsAsync(),
  ],
};
