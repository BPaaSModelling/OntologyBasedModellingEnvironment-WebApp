import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-property-window',
  templateUrl: './property-window.component.html',
  styleUrls: ['./property-window.component.css']
})
export class PropertyWindowComponent implements OnInit {
  @Input() showMe;
  @Input() element;
  constructor() { }

  ngOnInit() {
  }

}
