// import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
// import { provideRouter, withInMemoryScrolling } from '@angular/router';
// import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
// import { routes } from './app.routes';
// import { provideHttpClient, HttpClient } from '@angular/common/http';
// import { provideAnimations } from '@angular/platform-browser/animations';
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { Observable } from 'rxjs';

// /**
//  * Loads translation files from the assets i18n directory.
//  */
// class AssetsTranslateLoader implements TranslateLoader {
//   constructor(private http: HttpClient) { }

//   /**
//    * Fetches the translation file for the given language.
//    *
//    * @param lang The language code.
//    * @returns An observable containing the translation data.
//    */
//   getTranslation(lang: string): Observable<any> {
//     return this.http.get(`/assets/i18n/${lang}.json`);
//   }
// }

// /**
//  * Creates the translation loader for ngx-translate.
//  *
//  * @param http The Angular HTTP client.
//  * @returns A configured translation loader.
//  */
// function createTranslateLoader(http: HttpClient): TranslateLoader {
//   return new AssetsTranslateLoader(http);
// }

// /**
//  * Creates the router scrolling configuration.
//  *
//  * @returns The configured router scrolling feature.
//  */
// function getRouterConfig() {
//   return withInMemoryScrolling({
//     anchorScrolling: 'disabled',
//     scrollPositionRestoration: 'top',
//   });
// }

// /**
//  * Creates the ngx-translate module configuration.
//  *
//  * @returns The configured translation module.
//  */
// function getTranslateConfig() {
//   return TranslateModule.forRoot({
//     defaultLanguage: 'en',
//     useDefaultLang: true,
//     loader: {
//       provide: TranslateLoader,
//       useFactory: createTranslateLoader,
//       deps: [HttpClient],
//     },
//   });
// }

// /**
//  * Global Angular application configuration.
//  */
// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideZoneChangeDetection({ eventCoalescing: true }),
//     provideRouter(routes, getRouterConfig()),
//     provideClientHydration(withEventReplay()),
//     provideHttpClient(),
//     provideAnimations(),
//     importProvidersFrom(getTranslateConfig()),
//   ],
// };



import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection
} from '@angular/core';

import {
  provideRouter,
  withInMemoryScrolling
} from '@angular/router';

import {
  provideClientHydration,
  withEventReplay
} from '@angular/platform-browser';

import { routes } from './app.routes';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import {
  TranslateModule,
  TranslateLoader
} from '@ngx-translate/core';

import { Observable } from 'rxjs';

/**
 * Loads translation files from the assets i18n directory.
 */
class AssetsTranslateLoader implements TranslateLoader {

  constructor(private http: HttpClient) {}

  /**
   * Fetches the translation file for the given language.
   *
   * @param lang The language code.
   * @returns An observable containing the translation data.
   */
  getTranslation(lang: string): Observable<any> {
    return this.http.get(`/assets/i18n/${lang}.json`);
  }
}

/**
 * Creates the translation loader for ngx-translate.
 */
function createTranslateLoader(
  http: HttpClient
): TranslateLoader {
  return new AssetsTranslateLoader(http);
}

/**
 * Router scrolling configuration.
 *
 * Angular's automatic anchor scrolling is disabled because
 * anchor scrolling is handled manually inside AppComponent.
 *
 * Scroll position restoration is set to "top" so that a page
 * reload/navigation starts at the top instead of restoring
 * the previous browser scroll position.
 */
function getRouterConfig() {
  return withInMemoryScrolling({
    anchorScrolling: 'disabled',
    scrollPositionRestoration: 'top',
  });
}

/**
 * ngx-translate configuration.
 */
function getTranslateConfig() {
  return TranslateModule.forRoot({
    defaultLanguage: 'en',
    useDefaultLang: true,

    loader: {
      provide: TranslateLoader,
      useFactory: createTranslateLoader,
      deps: [HttpClient],
    },
  });
}

/**
 * Global Angular application configuration.
 */
export const appConfig: ApplicationConfig = {

  providers: [

    provideZoneChangeDetection({
      eventCoalescing: true
    }),

    provideRouter(
      routes,
      getRouterConfig()
    ),

    provideClientHydration(
      withEventReplay()
    ),

    provideHttpClient(),

    provideAnimations(),

    importProvidersFrom(
      getTranslateConfig()
    ),
  ],
};