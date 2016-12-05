import {
  inject,
  async,
  fakeAsync,
  flushMicrotasks,
  ComponentFixture,
  TestBed,
  tick,
} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {NgModule, Component, Directive, ViewChild, ViewContainerRef} from '@angular/core';
import {MdDialog, MdDialogModule} from './dialog';
import {OverlayContainer} from '../core';
import {MdDialogRef} from './dialog-ref';
import {MdDialogContainer} from './dialog-container';


describe('MdDialog', () => {
  let dialog: MdDialog;
  let overlayContainerElement: HTMLElement;

  let testViewContainerRef: ViewContainerRef;
  let viewContainerFixture: ComponentFixture<ComponentWithChildViewContainer>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MdDialogModule.forRoot(), DialogTestModule],
      providers: [
        {provide: OverlayContainer, useFactory: () => {
          overlayContainerElement = document.createElement('div');
          return {getContainerElement: () => overlayContainerElement};
        }}
      ],
    });

    TestBed.compileComponents();
  }));

  beforeEach(inject([MdDialog], (d: MdDialog) => {
    dialog = d;
  }));

  beforeEach(() => {
    viewContainerFixture = TestBed.createComponent(ComponentWithChildViewContainer);

    viewContainerFixture.detectChanges();
    testViewContainerRef = viewContainerFixture.componentInstance.childViewContainer;
  });

  it('should open a dialog with a component', () => {
    let dialogRef = dialog.open(PizzaMsg, {
      viewContainerRef: testViewContainerRef
    });

    viewContainerFixture.detectChanges();

    expect(overlayContainerElement.textContent).toContain('Pizza');
    expect(dialogRef.componentInstance).toEqual(jasmine.any(PizzaMsg));
    expect(dialogRef.componentInstance.dialogRef).toBe(dialogRef);

    viewContainerFixture.detectChanges();
    let dialogContainerElement = overlayContainerElement.querySelector('md-dialog-container');
    expect(dialogContainerElement.getAttribute('role')).toBe('dialog');
  });

  it('should open a dialog with a component and no ViewContainerRef', () => {
    let dialogRef = dialog.open(PizzaMsg);

    viewContainerFixture.detectChanges();

    expect(overlayContainerElement.textContent).toContain('Pizza');
    expect(dialogRef.componentInstance).toEqual(jasmine.any(PizzaMsg));
    expect(dialogRef.componentInstance.dialogRef).toBe(dialogRef);

    viewContainerFixture.detectChanges();
    let dialogContainerElement = overlayContainerElement.querySelector('md-dialog-container');
    expect(dialogContainerElement.getAttribute('role')).toBe('dialog');
  });

  it('should apply the configured role to the dialog element', () => {
    dialog.open(PizzaMsg, { role: 'alertdialog' });

    viewContainerFixture.detectChanges();

    let dialogContainerElement = overlayContainerElement.querySelector('md-dialog-container');
    expect(dialogContainerElement.getAttribute('role')).toBe('alertdialog');
  });

  it('should close a dialog and get back a result', () => {
    let dialogRef = dialog.open(PizzaMsg, {
      viewContainerRef: testViewContainerRef
    });

    viewContainerFixture.detectChanges();

    let afterCloseResult: string;
    dialogRef.afterClosed().subscribe(result => {
      afterCloseResult = result;
    });

    dialogRef.close('Charmander');

    expect(afterCloseResult).toBe('Charmander');
    expect(overlayContainerElement.querySelector('md-dialog-container')).toBeNull();
  });


  it('should close a dialog via the escape key', () => {
    dialog.open(PizzaMsg, {
      viewContainerRef: testViewContainerRef
    });

    viewContainerFixture.detectChanges();

    let dialogContainer: MdDialogContainer =
        viewContainerFixture.debugElement.query(By.directive(MdDialogContainer)).componentInstance;

    // Fake the user pressing the escape key by calling the handler directly.
    dialogContainer.handleEscapeKey();

    expect(overlayContainerElement.querySelector('md-dialog-container')).toBeNull();
  });

  it('should close when clicking on the overlay backdrop', () => {
    dialog.open(PizzaMsg, {
      viewContainerRef: testViewContainerRef
    });

    viewContainerFixture.detectChanges();

    let backdrop = overlayContainerElement.querySelector('.md-overlay-backdrop') as HTMLElement;
    backdrop.click();

    expect(overlayContainerElement.querySelector('md-dialog-container')).toBeFalsy();
  });

  it('should should override the width of the overlay pane', () => {
    dialog.open(PizzaMsg, {
      width: '500px'
    });

    viewContainerFixture.detectChanges();

    let overlayPane = overlayContainerElement.querySelector('.md-overlay-pane') as HTMLElement;

    expect(overlayPane.style.width).toBe('500px');
  });

  it('should should override the height of the overlay pane', () => {
    dialog.open(PizzaMsg, {
      height: '100px'
    });

    viewContainerFixture.detectChanges();

    let overlayPane = overlayContainerElement.querySelector('.md-overlay-pane') as HTMLElement;

    expect(overlayPane.style.height).toBe('100px');
  });

  it('should should override the top offset of the overlay pane', () => {
    dialog.open(PizzaMsg, {
      position: {
        top: '100px'
      }
    });

    viewContainerFixture.detectChanges();

    let overlayPane = overlayContainerElement.querySelector('.md-overlay-pane') as HTMLElement;

    expect(overlayPane.style.marginTop).toBe('100px');
  });

  it('should should override the bottom offset of the overlay pane', () => {
    dialog.open(PizzaMsg, {
      position: {
        bottom: '200px'
      }
    });

    viewContainerFixture.detectChanges();

    let overlayPane = overlayContainerElement.querySelector('.md-overlay-pane') as HTMLElement;

    expect(overlayPane.style.marginBottom).toBe('200px');
  });

  it('should should override the left offset of the overlay pane', () => {
    dialog.open(PizzaMsg, {
      position: {
        left: '250px'
      }
    });

    viewContainerFixture.detectChanges();

    let overlayPane = overlayContainerElement.querySelector('.md-overlay-pane') as HTMLElement;

    expect(overlayPane.style.marginLeft).toBe('250px');
  });

  it('should should override the right offset of the overlay pane', () => {
    dialog.open(PizzaMsg, {
      position: {
        right: '125px'
      }
    });

    viewContainerFixture.detectChanges();

    let overlayPane = overlayContainerElement.querySelector('.md-overlay-pane') as HTMLElement;

    expect(overlayPane.style.marginRight).toBe('125px');
  });

  it('should close all of the dialogs', () => {
    dialog.open(PizzaMsg);
    dialog.open(PizzaMsg);
    dialog.open(PizzaMsg);

    expect(overlayContainerElement.querySelectorAll('md-dialog-container').length).toBe(3);

    dialog.closeAll();

    expect(overlayContainerElement.querySelectorAll('md-dialog-container').length).toBe(0);
  });

  describe('disableClose option', () => {
    it('should prevent closing via clicks on the backdrop', () => {
      dialog.open(PizzaMsg, {
        disableClose: true,
        viewContainerRef: testViewContainerRef
      });

      viewContainerFixture.detectChanges();

      let backdrop = overlayContainerElement.querySelector('.md-overlay-backdrop') as HTMLElement;
      backdrop.click();

      expect(overlayContainerElement.querySelector('md-dialog-container')).toBeTruthy();
    });

    it('should prevent closing via the escape key', () => {
      dialog.open(PizzaMsg, {
        disableClose: true,
        viewContainerRef: testViewContainerRef
      });

      viewContainerFixture.detectChanges();

      let dialogContainer: MdDialogContainer = viewContainerFixture.debugElement.query(
          By.directive(MdDialogContainer)).componentInstance;

      // Fake the user pressing the escape key by calling the handler directly.
      dialogContainer.handleEscapeKey();

      expect(overlayContainerElement.querySelector('md-dialog-container')).toBeTruthy();
    });
  });

  describe('focus management', () => {

    // When testing focus, all of the elements must be in the DOM.
    beforeEach(() => {
      document.body.appendChild(overlayContainerElement);
    });

    afterEach(() => {
      document.body.removeChild(overlayContainerElement);
    });

    it('should focus the first tabbable element of the dialog on open', fakeAsync(() => {
      dialog.open(PizzaMsg, {
        viewContainerRef: testViewContainerRef
      });

      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(document.activeElement.tagName)
          .toBe('INPUT', 'Expected first tabbable element (input) in the dialog to be focused.');
    }));

    it('should re-focus trigger element when dialog closes', fakeAsync(() => {
      // Create a element that has focus before the dialog is opened.
      let button = document.createElement('button');
      button.id = 'dialog-trigger';
      document.body.appendChild(button);
      button.focus();

      let dialogRef = dialog.open(PizzaMsg, {
        viewContainerRef: testViewContainerRef
      });

      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(document.activeElement.id)
          .not.toBe('dialog-trigger', 'Expected the focus to change when dialog was opened.');

      dialogRef.close();
      tick(500);
      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(document.activeElement.id)
          .toBe('dialog-trigger', 'Expected that the trigger was refocused after dialog close');
    }));
  });
});


@Directive({selector: 'dir-with-view-container'})
class DirectiveWithViewContainer {
  constructor(public viewContainerRef: ViewContainerRef) { }
}

@Component({
  selector: 'arbitrary-component',
  template: `<dir-with-view-container></dir-with-view-container>`,
})
class ComponentWithChildViewContainer {
  @ViewChild(DirectiveWithViewContainer) childWithViewContainer: DirectiveWithViewContainer;

  get childViewContainer() {
    return this.childWithViewContainer.viewContainerRef;
  }
}

/** Simple component for testing ComponentPortal. */
@Component({template: '<p>Pizza</p> <input> <button>Close</button>'})
class PizzaMsg {
  constructor(public dialogRef: MdDialogRef<PizzaMsg>) { }
}

// Create a real (non-test) NgModule as a workaround for
// https://github.com/angular/angular/issues/10760
const TEST_DIRECTIVES = [ComponentWithChildViewContainer, PizzaMsg, DirectiveWithViewContainer];
@NgModule({
  imports: [MdDialogModule],
  exports: TEST_DIRECTIVES,
  declarations: TEST_DIRECTIVES,
  entryComponents: [ComponentWithChildViewContainer, PizzaMsg],
})
class DialogTestModule { }
