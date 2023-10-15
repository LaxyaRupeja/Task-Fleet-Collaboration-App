import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { NgToastService } from "ng-angular-popup";

@Component({
  selector: "app-joined-project-update",
  templateUrl: `./joined-project-update.component.html`,
  styles: [],
})
export class JoinedProjectUpdateComponent implements OnInit {
  taskId?: string;
  projectId?: string;
  updatedTask = {
    taskName: "",
    description: "",
    priority: "",
    status: "",
    deadline: "",
  };
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private toast: NgToastService
  ) {}
  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.taskId = params["taskId"];
      this.projectId = params["projectId"];
      this.httpClient
        .get(`https://transparent-potent-typhoon.glitch.me/tasks/${this.taskId}`)
        .subscribe((response: any) => {
          const isoDate = response.task.deadline;
          const date = new Date(isoDate);
          const formattedDate = date.toISOString().split("T")[0];
          this.updatedTask.taskName = response.task.taskName;
          this.updatedTask.description = response.task.description;
          this.updatedTask.deadline = formattedDate;
          this.updatedTask.priority = response.task.priority;
          this.updatedTask.status = response.task.status;
        }),
        (error: any) => {
          console.error("Error adding task:", error);
          this.toast.error({
            detail: "Something went Wrong",
            summary: "Some Error occurred",
          });
        };
    });
  }
  onClick() {
    this.router.navigate([`/projects/joined/${this.projectId}`]);
  }
  onSubmit() {
    this.httpClient
      .put(`https://transparent-potent-typhoon.glitch.me/tasks/${this.taskId}`, this.updatedTask)
      .subscribe(
        (response) => {
          this.toast.success({
            detail: "SUCCESS",
            summary: "Updated Successfully",
            duration: 5000,
          });
          this.router.navigate([`/projects/joined/${this.projectId}`]);
        },
        (error) => {
          // alert("Error occured");
          this.toast.error({
            detail: "Something went Wrong",
            summary: "Some Error occurred",
          });
          console.log("Error while updating error", error);
        }
      );
  }
}
