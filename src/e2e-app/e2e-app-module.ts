import {NgModule} from '@angular/core';
import {BrowserModule, AnimationDriver} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {SimpleCheckboxes} from './checkbox/checkbox-e2e';
import {E2EApp, Home} from './e2e-app/e2e-app';
import {IconE2E} from './icon/icon-e2e';
import {ButtonE2E} from './button/button-e2e';
import {MenuE2E} from './menu/menu-e2e';
import {SimpleRadioButtons} from './radio/radio-e2e';
import {BasicTabs} from './tabs/tabs-e2e';
import {DialogE2E, TestDialog} from './dialog/dialog-e2e';
import {GridListE2E} from './grid-list/grid-list-e2e';
import {ListE2E} from './list/list-e2e';
import {ProgressBarE2E} from './progress-bar/progress-bar-e2e';
import {ProgressCircleE2E} from './progress-circle/progress-circle-e2e';
import {MaterialModule} from '@angular/material';
import {E2E_APP_ROUTES} from './e2e-app/routes';


@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(E2E_APP_ROUTES),
    MaterialModule.forRoot(),
  ],
  declarations: [
    E2EApp,
    IconE2E,
    ButtonE2E,
    MenuE2E,
    BasicTabs,
    SimpleRadioButtons,
    SimpleCheckboxes,
    Home,
    DialogE2E,
    TestDialog,
    GridListE2E,
    ListE2E,
    ProgressBarE2E,
    ProgressCircleE2E,
  ],
  bootstrap: [E2EApp],
  providers: [
    {provide: AnimationDriver, useValue: AnimationDriver.NOOP}
  ],
  entryComponents: [TestDialog]
})
export class E2eAppModule { }
