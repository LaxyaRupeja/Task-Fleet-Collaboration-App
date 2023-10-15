import { NotificationPageComponent } from "./notification-page/notification-page.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { AppComponent } from "./app.component";
import { SignupComponent } from "./signup/signup.component";
import { ProjectsComponent } from "./projects/projects.component";
import { ProjectComponent } from "./project/project.component";
import { ProjectUpdateComponent } from "./project-update/project-update.component";
import { ProfileComponent } from "./profile/profile.component";
import { JoinedProjectTaskComponent } from "./joined-project-task/joined-project-task.component";
import { JoinedProjectUpdateComponent } from "./joined-project-update/joined-project-update.component";
import { CallbackComponent } from "./callback/callback.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "projects", component: ProjectsComponent },
  { path: "projects/my/:projectId", component: ProjectComponent },
  { path: "projects/joined/:projectId", component: JoinedProjectTaskComponent },
  { path: "profile/:userId", component: ProfileComponent },
  { path: "notifications", component: NotificationPageComponent },
  { path: "callback", component: CallbackComponent },
  {
    path: "projects/:projectId/my/update/:taskId",
    component: ProjectUpdateComponent,
  },
  {
    path: "projects/:projectId/joined/update/:taskId",
    component: JoinedProjectUpdateComponent,
  },
  { path: "", redirectTo: "/projects", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
