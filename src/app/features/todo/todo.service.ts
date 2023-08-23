import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, Observable, of, throwError} from "rxjs";
import {FormControl} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export interface TodoForm {
  title: FormControl<string | null>;
  completed: FormControl<boolean | null>;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private _todos$ = new BehaviorSubject<Todo[]>([])
  todos$: Observable<Todo[]> = this._todos$.asObservable()

  constructor(private http: HttpClient) {
  }

  fetchTodos() {
    this.http.get<Todo[]>("https://jsonplaceholder.typicode.com/todos?userId=1")
      .pipe(
        catchError(err => {
          console.error("ERROR", err)
          return of<Todo[]>([])
        }),
      ).subscribe((todos) => this._todos$.next(todos))
  }

  addTodo(todo: Todo) {
    const optimisticTodo = this.optimisticallyAddTodo(todo);

    this.postTodo(todo, optimisticTodo.id)
  }

  updateTodo(todo: Todo) {
    const oldTodo = this.getTodo(todo.id)!
    this.updateCurrentTodos(oldTodo.id, todo)

    this.postUpdatedTodo(todo, oldTodo)
  }

  private optimisticallyAddTodo(todo: Todo) {
    todo.id = this.getRandomWholeNumberInRange(888888, 999999)
    const todos = this._todos$.getValue()
    this._todos$.next([todo, ...todos])
    return todo;
  }

  private postTodo(todo: Todo, todoIdentifier: number) {
    this.http.post<Todo>("https://jsonplaceholder.typicode.com/todos?userId=1", {
      body: todo
    })
      .pipe(
        catchError((err) => {
          console.error("ERROR", err)
          this.removeCurrentTodo(todoIdentifier)
          return throwError(() => err)
        }),
      ).subscribe((updatedTodo) => {
      this.updateCurrentTodos(todoIdentifier, todo);
    })
  }

  private updateCurrentTodos(todoIdentifier: number, updatedTodo: Todo) {
    const todos = this._todos$.getValue()
    this._todos$.next(
      todos.map(t => {
        if (t.id === todoIdentifier) {
          return updatedTodo
        }
        return t
      })
    )
  }

  private getRandomWholeNumberInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private removeCurrentTodo(todoIdentifier: number) {
    const todos = this._todos$.getValue()
    this._todos$.next(
      todos.filter(t => t.id !== todoIdentifier)
    )
  }

  private postUpdatedTodo(todo: Todo, oldTodo: Todo) {
    this.http.post<Todo>("https://jsonplaceholder.typicode.com/todos?userId=1", {
      body: todo
    }).pipe(
      catchError((err) => {
        console.error("ERROR", err)
        this.updateCurrentTodos(oldTodo.id, oldTodo)
        return throwError(() => err)
      }),
    ).subscribe((updatedTodo) => {
      this.updateCurrentTodos(todo.id, todo);
    })

  }

  private getTodo(id: number) {
    return this._todos$.getValue().find(todo => todo.id === id)
  }
}
