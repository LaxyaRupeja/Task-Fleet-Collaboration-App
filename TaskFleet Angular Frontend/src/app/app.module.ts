import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { ProjectsComponent } from "./projects/projects.component";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ProjectComponent } from "./project/project.component";
import { ProjectUpdateComponent } from './project-update/project-update.component';
import { ProfileComponent } from './profile/profile.component';
import { NotificationPageComponent } from './notification-page/notification-page.component';
import { JoinedProjectTaskComponent } from './joined-project-task/joined-project-task.component';
import { JoinedProjectUpdateComponent } from './joined-project-update/joined-project-update.component';
import { CallbackComponent } from './callback/callback.component';
import { NgToastModule } from "ng-angular-popup";
import { StartingBackendComponent } from './starting-backend/starting-backend.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ProjectsComponent,
    ProjectComponent,
    ProjectUpdateComponent,
    ProfileComponent,
    NotificationPageComponent,
    JoinedProjectTaskComponent,
    JoinedProjectUpdateComponent,
    CallbackComponent,
    StartingBackendComponent
  ],
  imports: [
    NgToastModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
