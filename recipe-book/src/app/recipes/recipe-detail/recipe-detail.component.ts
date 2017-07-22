import {Component, OnInit} from '@angular/core';
import {Recipe} from "../recipe";
import {ShoppingListService} from "../../shopping-list/shopping-list.service";
import {Subscription} from "rxjs/Rx";
import {ActivatedRoute, Router} from "@angular/router";
import {RecipeService} from "../recipe.service";
import {Item} from "../Item";

@Component({
  selector: 'rb-recipe-detail',
  templateUrl: './recipe-detail.component.html'
})
export class RecipeDetailComponent implements OnInit {
  selectedRecipe:Item;
  private subscription:Subscription;
  private recipeIndex:number;
  constructor(private router:Router,private sls: ShoppingListService,private route: ActivatedRoute, private recipeService:RecipeService) {}

  ngOnInit() {
    console.log('oninit of r-details component is called');
    this.subscription=this.route.params.subscribe(
      (params:any)=>{
          this.recipeIndex=params['id'];
        console.log('oninit of r-details component is called and this recipe is the selected recipe with index '+this.recipeIndex);
          this.selectedRecipe=this.recipeService.getRecipe(this.recipeIndex);

      }


    );

  }
  ngOnDestroy(){
    this.subscription.unsubscribe();

  }
  onAddToShoppingList() {
    console.log('onAddtoShoppinglist is called');

    this.sls.addItemToServer(this.selectedRecipe.id);
    this.sls.recipeAddedToShoppingCart.subscribe(
      (data:string)=> {
        console.log('emmitted data is ' + data);
        this.sls.addItem(this.selectedRecipe);

      },
          error=>console.log(error)

    );

  }

  onEdit(){
    this.router.navigate(['/recipes',this.recipeIndex,'edit']);
  }

  onDelete(){
  this.recipeService.deleteRecipe(this.selectedRecipe);
  this.router.navigate(['/recipes']);

  }
}
