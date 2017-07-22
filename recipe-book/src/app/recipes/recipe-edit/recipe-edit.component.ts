import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RecipeService} from "../recipe.service";
import {Subscription} from "rxjs/Rx";
import {Recipe} from "../recipe";
import {FormArray, FormGroup, FormControl, Validator, Validators, FormBuilder} from "@angular/forms";
import {Item} from "../Item";

@Component({
  selector: 'rb-recipe-edit',
  templateUrl: './recipe-edit.component.html'
})
export class RecipeEditComponent implements OnInit,OnDestroy {
  recipeForm: FormGroup;
  private recipeIndex: number;
  private recipe: Item;
  private isNew = true;
  private subscription: Subscription;
  private id:string;

  constructor(private route: ActivatedRoute,
              private recipeService: RecipeService,
              private formBuilder: FormBuilder,
              private router: Router) {}

  ngOnInit()
  {
    console.log('oninit of edit component is called');
    this.subscription = this.route.params.subscribe(
      (params: any) => {
        if (params.hasOwnProperty('id'))
        {
          this.isNew = false;
          this.recipeIndex = +params['id'];
          this.recipe = this.recipeService.getRecipe(this.recipeIndex);
        }
        else
        {
          this.isNew = true;
          this.recipe = null;
        }
        console.log('initform() of edit component is called');
        this.initForm();
      }
    );
  }

  onSubmit() {
    console.log('onSubmit() is called since save button is clicked');
    const newRecipe = this.recipeForm.value;
    console.log('recipefor vaule is '+newRecipe);
    if (this.isNew) {

      this.recipeService.addRecipe(newRecipe);
      this.recipeService.recipeAdded.subscribe(
        (data:string)=> {
          console.log('recipe Added event is occured to emit data '+data);
          this.id=data;
          this.recipeService.pushItem(new Item(newRecipe.name,this.id,newRecipe.type,newRecipe.price,newRecipe.quantity,newRecipe.imagePath))

        },
        error=>console.log(error)

      );

        } else {

      //back end service
      //front end service

      this.recipeService.editRecipe(this.recipe, newRecipe);
    }
    this.navigateBack();
  }

  onCancel() {
    this.navigateBack();
  }

  onAddItem(name: string, amount: string) {
    (<FormArray>this.recipeForm.controls['ingredients']).push(
      new FormGroup({
        name: new FormControl(name, Validators.required),
        amount: new FormControl(amount, [
          Validators.required,
          Validators.pattern("\\d+")
        ])
      })
    );
  }

  onRemoveItem(index: number) {
    (<FormArray>this.recipeForm.controls['ingredients']).removeAt(index);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private navigateBack() {
    this.router.navigate(['../']);
  }

  private initForm()
  {
    let recipeName = '';
    let recipeImageUrl = '';
    let recipeType= '';
    let recipePrice ='';
    let recipeQuantity='';
      if (!this.isNew) {
      recipeName = this.recipe.name;
      recipeType=this.recipe.type;
      recipePrice=this.recipe.price;
      recipeQuantity=this.recipe.quantity;
      recipeImageUrl = this.recipe.imagePath;
    }
    this.recipeForm = this.formBuilder.group({
      name: [recipeName, Validators.required],
      type:[recipeType,Validators.required],
      price:[recipePrice,Validators.required],
      quantity:[recipeQuantity,Validators.required],
      imagePath: [recipeImageUrl, Validators.required]
    });
  }
}
