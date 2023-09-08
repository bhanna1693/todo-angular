import {ResolveFn} from '@angular/router';
import {inject} from "@angular/core";
import {Todo, TodoService} from "../services/todo.service";
import {Observable} from "rxjs";

export const todoResolver: ResolveFn<Observable<Todo[]>> = (route, state) => {
  return inject(TodoService).fetchTodos();
};
