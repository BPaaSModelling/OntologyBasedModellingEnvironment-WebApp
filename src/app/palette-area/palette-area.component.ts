import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-palette-area',
  templateUrl: './palette-area.component.html',
  styleUrls: ['./palette-area.component.css']
})
export class PaletteAreaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  private addNewShape(): void {
    console.log("hello");
  }

}
