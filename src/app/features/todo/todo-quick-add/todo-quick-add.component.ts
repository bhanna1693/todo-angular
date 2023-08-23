import { Component } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Todo, TodoService} from "../todo.service";

@Component({
  selector: 'app-todo-quick-add',
  templateUrl: './todo-quick-add.component.html',
  styleUrls: ['./todo-quick-add.component.css']
})
export class TodoQuickAddComponent {
  form = new FormGroup<{
    title: FormControl<string|null>,
    completed: FormControl<boolean>
  }>({
    title: new FormControl(""),
    completed: new FormControl(false, {nonNullable: true})
  })

  constructor(private todoService: TodoService) {
  }

  onSubmit() {
    this.todoService.addTodo(<Todo>this.form.value)
  }
}
