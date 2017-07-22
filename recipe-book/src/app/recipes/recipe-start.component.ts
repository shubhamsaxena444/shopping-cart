import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rb-recipe-start',
  template: `
    <p>
     Please select a recipe
    </p>
  `,
  styles: []
})
export class RecipeStartComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
