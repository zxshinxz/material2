// TODO(kara): prevent-close functionality

import {
  AfterContentInit,
  Attribute,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {MenuPositionX, MenuPositionY} from './menu-positions';
import {MdMenuInvalidPositionX, MdMenuInvalidPositionY} from './menu-errors';
import {MdMenuItem} from './menu-item';
import {ListKeyManager} from '../core/a11y/list-key-manager';
import {MdMenuPanel} from './menu-panel';
import {Subscription} from 'rxjs/Subscription';
import {transformMenu, fadeInItems} from './menu-animations';

@Component({
  moduleId: module.id,
  selector: 'md-menu, mat-menu',
  host: {'role': 'menu'},
  templateUrl: 'menu.html',
  styleUrls: ['menu.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    transformMenu,
    fadeInItems
  ],
  exportAs: 'mdMenu'
})
export class MdMenu implements AfterContentInit, MdMenuPanel, OnDestroy {
  private _keyManager: ListKeyManager;

  /** Subscription to tab events on the menu panel */
  private _tabSubscription: Subscription;

  /** Config object to be passed into the menu's ngClass */
  _classList: any = {};

  positionX: MenuPositionX = 'after';
  positionY: MenuPositionY = 'below';

  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;
  @ContentChildren(MdMenuItem) items: QueryList<MdMenuItem>;

  constructor(@Attribute('x-position') posX: MenuPositionX,
              @Attribute('y-position') posY: MenuPositionY) {
    if (posX) { this._setPositionX(posX); }
    if (posY) { this._setPositionY(posY); }
    this.setPositionClasses(this.positionX, this.positionY);
  }

  // TODO: internal
  ngAfterContentInit() {
    this._keyManager = new ListKeyManager(this.items).withFocusWrap();
    this._tabSubscription = this._keyManager.tabOut.subscribe(() => {
      this._emitCloseEvent();
    });
  }

  // TODO: internal
  ngOnDestroy() {
    this._tabSubscription.unsubscribe();
  }


  /**
   * This method takes classes set on the host md-menu element and applies them on the
   * menu template that displays in the overlay container.  Otherwise, it's difficult
   * to style the containing menu from outside the component.
   * @param classes list of class names
   */
  @Input('class')
  set classList(classes: string) {
    this._classList = classes.split(' ').reduce((obj: any, className: string) => {
      obj[className] = true;
      return obj;
    }, {});
    this.setPositionClasses(this.positionX, this.positionY);
  }

  @Output() close = new EventEmitter<void>();

  /**
   * Focus the first item in the menu. This method is used by the menu trigger
   * to focus the first item when the menu is opened by the ENTER key.
   * TODO: internal
   */
  focusFirstItem() {
    this._keyManager.focusFirstItem();
  }

  /**
   * This emits a close event to which the trigger is subscribed. When emitted, the
   * trigger will close the menu.
   */
  _emitCloseEvent(): void {
    this.close.emit();
  }

  private _setPositionX(pos: MenuPositionX): void {
    if ( pos !== 'before' && pos !== 'after') {
      throw new MdMenuInvalidPositionX();
    }
    this.positionX = pos;
  }

  private _setPositionY(pos: MenuPositionY): void {
    if ( pos !== 'above' && pos !== 'below') {
      throw new MdMenuInvalidPositionY();
    }
    this.positionY = pos;
  }

  /**
   * It's necessary to set position-based classes to ensure the menu panel animation
   * folds out from the correct direction.
   */
  setPositionClasses(posX: MenuPositionX, posY: MenuPositionY): void {
    this._classList['md-menu-before'] = posX == 'before';
    this._classList['md-menu-after'] = posX == 'after';
    this._classList['md-menu-above'] = posY == 'above';
    this._classList['md-menu-below'] = posY == 'below';
  }

}
