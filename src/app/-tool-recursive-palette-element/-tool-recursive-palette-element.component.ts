import {Component, Input, OnInit} from '@angular/core';
import {PaletteElementModel} from "../_models/PaletteElement.model";

@Component({
  selector: 'app--tool-recursive-palette-element',
  templateUrl: './-tool-recursive-palette-element.component.html',
  styleUrls: ['./-tool-recursive-palette-element.component.css']
})
export class ToolRecursivePaletteElementComponent implements OnInit {
@Input() child: PaletteElementModel;
  constructor() { }

  ngOnInit() {
  }

}
