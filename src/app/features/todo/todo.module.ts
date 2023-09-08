import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoRoutingModule } from './todo-routing.module';
import {TodoComponent} from "./components/todo.component";
import {TodoQuickAddComponent} from "./components/todo-quick-add/todo-quick-add.component";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    TodoComponent,
    TodoQuickAddComponent
  ],
  imports: [
    CommonModule,
    TodoRoutingModule,
    ReactiveFormsModule
  ]
})
export class TodoModule { }
