import {join} from 'path';

export const PROJECT_ROOT = join(__dirname, '../..');
export const SOURCE_ROOT = join(PROJECT_ROOT, 'src');

export const DIST_ROOT = join(PROJECT_ROOT, 'dist');
export const DIST_COMPONENTS_ROOT = join(DIST_ROOT, '@angular/material');

export const SASS_AUTOPREFIXER_OPTIONS = {
  browsers: [
    'last 2 versions',
    'not ie <= 10',
    'not ie_mob <= 10',
  ],
  cascade: false,
};

export const NPM_VENDOR_FILES = [
  '@angular', 'core-js/client', 'hammerjs', 'rxjs', 'systemjs/dist', 'zone.js/dist'
];
