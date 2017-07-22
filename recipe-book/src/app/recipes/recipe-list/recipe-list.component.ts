import {Component, OnInit} from '@angular/core';
import {Recipe} from "../recipe";
import {RecipeService} from "../recipe.service";
import {Response} from "@angular/http";
import {forEach} from "@angular/router/src/utils/collection";
import {Item} from "../Item";
import {Ingredient} from "../../shared/ingredient";
import {Assignment} from "../Assignment";

@Component({
  selector: 'rb-recipe-list',
  templateUrl: './recipe-list.component.html'
})
export class RecipeListComponent implements OnInit {
  items:Item[]=[];

  constructor(private recipeService:RecipeService) {

  }

  ngOnInit()
  {
    console.log('ngOninit of r-list-component is called');

    this.recipeService.fetchData();
    console.log('fetch data is called');
    this.recipeService.recipesChanged.subscribe(
      (data:Item[])=> {
        console.log('recipesChanged event occured');
        this.recipeService.addRecipes(data);
        console.log('emmited data '+data+'is set equal to local items');
        this.items = this.recipeService.getRecipes();
        console.log('get recipes is called items shown are'+this.items);

      });

  }
}
