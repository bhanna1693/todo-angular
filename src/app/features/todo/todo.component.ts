import {Component} from '@angular/core';
import {combineLatest, debounceTime, distinctUntilChanged, map, Observable, startWith} from "rxjs";
import {Todo, TodoService} from "./todo.service";
import {FormControl, FormGroup} from "@angular/forms";


@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent {
  todos$: Observable<Todo[]>
  todoFilter = new FormGroup({
    title: new FormControl<string>("", {nonNullable: true}),
    status: new FormControl<string>("NOT_COMPLETED", {nonNullable: true}),
  })

  constructor(private todoService: TodoService) {
    this.todos$ = combineLatest([
      this.todoService.todos$,
      this.todoFilter.valueChanges.pipe(
        startWith(this.todoFilter.value),
        debounceTime(100),
        distinctUntilChanged(),
      )
    ]).pipe(
      map(([todos, filter]) => {
        return todos.filter(todo => {
          return Object.entries(filter).every(([key, value]) => {
            switch (key) {
              case "title":
                if (value) {
                  return todo.title.includes(value);
                }
                break;
              case "status":
                if (value === "COMPLETED") {
                  return todo.completed;
                } else if (value === "NOT_COMPLETED") {
                  return !todo.completed;
                }
                break;
              default:
                console.warn("undefined filter logic");
            }
            return true; // Return true as the default case
          });
        });

      })
    )
    this.todoService.fetchTodos()
  }

  toggleCompleted(todo: Todo) {
    todo.completed = !todo.completed
    this.todoService.updateTodo(todo)
  }
}
