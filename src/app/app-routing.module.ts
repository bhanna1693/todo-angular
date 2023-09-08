import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {todoResolver} from "./core/resolvers/todo.resolver";

const routes: Routes = [
  {
    path: 'todo',
    resolve: {todos: todoResolver},
    loadChildren: () => import('./features/todo/todo.module').then(m => m.TodoModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
