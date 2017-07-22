import {Injectable, EventEmitter} from '@angular/core';
import {Recipe} from "./recipe";
import {Ingredient} from "../shared/ingredient";
import {Http, Response, Headers} from "@angular/http";
import 'rxjs/Rx';
import {Item} from "./Item";



@Injectable()
export class RecipeService {

  recipesChanged=new EventEmitter<Item[]>();
  recipeAdded=new EventEmitter<string>();
  private recipes: Item[]=[];


  constructor(private http:Http) { }


  addRecipes(items:Item[])
  {
    this.recipes=items;
  }

  pushItem(item:Item)
  {
    console.log('new item is pushed in the front end recipe array of recipeServices');

    this.recipes.push(item);
    console.log('after push item the value of recipes is '+this.recipes);
  }

  public getRecipes()
  {

    return this.recipes;
  }

  getRecipe(id:number)
  {

    return this.recipes[id];
  }


  deleteRecipe(recipe:Item)
  {
    this.recipes.splice(this.recipes.indexOf(recipe),1);

  }
  addRecipe(recipe: Item) {
    console.log('addRecipe is called for post call at backend to save new item');
    const body=JSON.stringify(recipe);
    const headers=new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('api/availableItems',body,{headers:headers})
      .map((response:Response)=>response)
      .subscribe(
        (data:any)=> {
          this.recipeAdded.emit(data._body);
        },
        error=>console.log(error)

      );
  }

  editRecipe(oldRecipe: Item, newRecipe: Item) {
    newRecipe.id=oldRecipe.id;
    this.recipes[this.recipes.indexOf(oldRecipe)] = newRecipe;
  }

  fetchData()
  {
    return this.http.get('api/availableItems')
      .map((response:Response)=>response.json())
        .subscribe(
          (data:Item[])=> {
            this.recipesChanged.emit(data);
            console.log('data fetched in get API call'+data);
          },
          error=>console.log(error)

        );




  }

}
