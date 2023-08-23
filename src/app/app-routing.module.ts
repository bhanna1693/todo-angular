import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TodoComponent} from "./features/todo/components/todo.component";

const routes: Routes = [
  { path: 'todo', loadChildren: () => import('./features/todo/todo.module').then(m => m.TodoModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
