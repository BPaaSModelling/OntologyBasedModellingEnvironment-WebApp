import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild,
  SimpleChanges,
  EventEmitter
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';

/**
 * You may include a different variant of BpmnJS:
 *
 * bpmn-viewer  - displays BPMN diagrams without the ability
 *                to navigate them
 * bpmn-modeler - bootstraps a full-fledged BPMN editor
 */
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import Modeler from 'bpmn-js/lib/Modeler';
import {Subscription} from 'rxjs/internal/Subscription';
import {Observable} from 'rxjs/internal/Observable';
import {from} from 'rxjs/internal/observable/from';

import customRendererModule from './custom';

@Component({
  selector: 'app-diagram',
  template: `
    <div #ref class="diagram-container"></div>
  `,
  styles: [
    `
      .diagram-container {
        height: 100%;
        width: 100%;
      }
    `
  ]
})
export class DiagramComponent implements AfterContentInit, OnDestroy {
  private bpmnJS: BpmnJS;

  @ViewChild('ref', { static: true }) private el: ElementRef;
  @Output() private importDone: EventEmitter<any> = new EventEmitter();

  private url = 'https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';

  constructor(private http: HttpClient) {

    this.bpmnJS = new BpmnJS({
      additionalModules: [
        customRendererModule
      ]
    });

    this.bpmnJS.on('import.done', ({ error }) => {
      if (!error) {
        this.bpmnJS.get('canvas').zoom('fit-viewport');
      }
    });
  }

  ngAfterContentInit(): void {
    this.bpmnJS.attachTo(this.el.nativeElement);
    this.loadUrl(this.url);
  }

  ngOnDestroy(): void {
    this.bpmnJS.destroy();
  }

  /**
   * Load diagram from URL and emit completion event
   */
  loadUrl(url: string): Subscription {

    return (
      this.http.get(url, { responseType: 'text' }).pipe(
        switchMap((xml: string) => this.importDiagram(xml)),
        map(result => result.warnings),
      ).subscribe(
        (warnings) => {
          this.importDone.emit({
            type: 'success',
            warnings
          });

          // access modeler components
          const canvas = this.bpmnJS.get('canvas');
          const overlays = this.bpmnJS.get('overlays');


          // zoom to fit full viewport
          canvas.zoom('fit-viewport');

          // attach an overlay to a node
          overlays.add('SCAN_OK', 'note', {
            position: {
              bottom: 0,
              right: 0
            },
            html: '<div class="diagram-note">Mixed up the labels?</div>'
          });

          // add marker
          canvas.addMarker('SCAN_OK', 'needs-discussion');
        },
        (err) => {
          this.importDone.emit({
            type: 'error',
            error: err
          });
        }
      )
    );
  }

  /**
   * Creates a Promise to import the given XML into the current
   * BpmnJS instance, then returns it as an Observable.
   *
   * @see https://github.com/bpmn-io/bpmn-js-callbacks-to-promises#importxml
   */
  private importDiagram(xml: string): Observable<{warnings: Array<any>}> {
    return from(this.bpmnJS.importXML(xml) as Promise<{warnings: Array<any>}>);
  }
}
