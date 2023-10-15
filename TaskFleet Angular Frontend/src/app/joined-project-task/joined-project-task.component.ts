import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgToastService } from "ng-angular-popup";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client";
@Component({
  selector: "app-joined-project-task",
  templateUrl: "./joined-project-task.component.html",
  styles: [],
})
export class JoinedProjectTaskComponent implements OnInit {
  private socket: Socket;
  project: any;
  user: any;
  projectId: string | undefined;
  tasks: any;
  message: any;
  allMessages: any;
  userId!: string;
  searchDataUser: any;
  searchUsername: string = "";
  members: any;
  activeTab: string = "tasks";
  username: string = "Select Member";
  newTask: any = {
    taskName: "",
    description: "",
    deadline: "",
    priority: "Select Priority",
  };
  selectTab(tab: string): void {
    this.activeTab = tab;
  }
  getTabClass(tab: string): string {
    return this.activeTab === tab ? "active-tab" : "inactive-tab";
  }
  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private toast: NgToastService
  ) {
    const userJson = localStorage.getItem("user");
    if (userJson !== null) {
      const user = JSON.parse(userJson);
      this.user = user;
    }
    this.route.params.subscribe((params) => {
      this.projectId = params["projectId"];
    });
    console.log("this is user", this.user);
    this.socket = io("https://transparent-potent-typhoon.glitch.me", {
      transports: ["websocket"],
    });
    this.socket.emit("join room", {
      projectId: this.projectId,
      userId: this.user._id,
    });
    this.socket.on("chat messages", (data) => {
      console.log(data);
      this.allMessages = data.messages;
    });
  }

  onSendMessage() {
    this.socket.emit("chat message", {
      userId: this.user._id,
      projectId: this.projectId,
      message: this.message,
    });
  }

  fetchData() {
    this.route.params.subscribe((params) => {
      this.projectId = params["projectId"];
      const token = localStorage.getItem("token");
      const headers = new HttpHeaders().set("Authorization", `${token}`);

      this.httpClient
        .get(
          `https://transparent-potent-typhoon.glitch.me/projects/tasks/${this.projectId}`,
          {
            headers,
          }
        )
        .subscribe((response: any) => {
          let userJson = localStorage.getItem("user");
          console.log(userJson);
          if (userJson) {
            this.userId = JSON.parse(userJson)._id;
          }
          this.project = response.project;
          this.tasks = response.project.task;
          this.members = response.project.members;
          console.log(this.project);
          console.log(this.tasks[0]);
        }),
        (error: any) => {
          console.log(error);
          this.toast.error({
            detail: "Something went Wrong",
            summary: "Some Error occurred while fetching the data",
          });
        };
    });
  }
  onSubmit() {
    console.log("started");

    const url = `https://transparent-potent-typhoon.glitch.me/task/${this.projectId}/${this.username}`;
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders().set("Authorization", `${token}`);
    this.httpClient
      .post(url, this.newTask, {
        headers,
      })
      .subscribe(
        (response) => {
          console.log("Task added successfully:", response);
          this.toast.success({
            detail: "Task Added",
            summary: "Task has been added to the project",
            duration: 5000,
          });
          this.fetchData();
        },
        (error) => {
          console.error("Error adding task:", error);
          this.toast.error({
            detail: "Something went Wrong",
            summary: "Some Error occurred while creating Task",
          });
        }
      );
  }
  onSearch() {
    this.httpClient
      .get(
        `https://transparent-potent-typhoon.glitch.me/users?username=${this.searchUsername}`
      )
      .subscribe(
        (response) => {
          this.searchDataUser = response;
        },
        (error) => {
          console.error("Error fetching useers:", error);
          this.toast.error({
            detail: "Something went Wrong",
            summary: "Some Error occurred while fetching users",
          });
        }
      );
  }
  addMember(username: string) {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders().set("Authorization", `${token}`);
    this.httpClient
      .post(
        `https://transparent-potent-typhoon.glitch.me/${this.projectId}/add/${username}`,
        {},
        { headers }
      )
      .subscribe(
        (response) => {
          this.toast.success({
            detail: "Member Added",
            summary: "Member has been added to the project",
            duration: 5000,
          });
          console.log("Member added successfully:", response);
          this.fetchData();
        },
        (error) => {
          console.error("Error adding Member:", error);
          // alert("Error while post the data");
          this.toast.error({
            detail: "Something went Wrong",
            summary: "Some Error occurred while adding member",
          });
        }
      );
  }
  removeMember(username: string) {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders().set("Authorization", `${token}`);
    this.httpClient
      .post(
        `https://transparent-potent-typhoon.glitch.me/projects/${this.projectId}/remove/${username}`,
        {},
        { headers }
      )
      .subscribe(
        (response) => {
          console.log("Member remove successfully:", response);
          this.fetchData();
          this.toast.success({
            detail: "SUCCESS",
            summary: "Member Removed",
            duration: 5000,
          });
        },
        (error) => {
          console.error("Error removing Member:", error);
          this.toast.error({
            detail: "Something went Wrong",
            summary: "Some Error occurred",
          });
        }
      );
  }
  onTaskDelete(taskId: any) {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders().set("Authorization", `${token}`);
    this.httpClient
      .delete(
        `https://transparent-potent-typhoon.glitch.me/task/${this.projectId}/${taskId}`,
        {
          headers,
        }
      )
      .subscribe(
        (response) => {
          console.log("Task Deleted successfully:", response);
          this.fetchData();
          this.toast.success({
            detail: "Task Deleted",
            summary: "Task has been deleted",
            duration: 5000,
          });
        },
        (error) => {
          console.error("Error removing Task:", error);
          this.toast.error({
            detail: "Something went Wrong",
            summary: "Some Error occurred",
          });
        }
      );
  }
  ngOnInit() {
    let scrollingDiv = document.getElementById("scrollingDiv");
    if (scrollingDiv) {
      scrollingDiv.scrollTop = scrollingDiv.scrollHeight;
    }
    this.fetchData();
  }
}
