import { HttpClient, HttpHeaders } from "@angular/common/http";
import { OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { Modal } from "flowbite";
import type { ModalOptions, ModalInterface } from "flowbite";
import { NgToastService } from "ng-angular-popup";

import { Router } from "@angular/router";
interface Project {
  _id: string;
  projectName: string;
  description: string;
  startDate: string; // Consider using Date type if appropriate
  endDate: string; // Consider using Date type if appropriate
  projectLead: string;
  members: string[];
  task: string[];
  __v: number;
}
interface ProjectNew {
  projectName: string;
  description: string;
  startDate: string;
  endDate: string;
}

@Component({
  selector: "app-projects",
  templateUrl: "./projects.component.html",
  styles: [],
})
export class ProjectsComponent implements OnInit {
  activeTab: string = "my_projects";
  newProject: any = {
    projectName: "",
    description: "",
    startDate: "",
    endDate: "",
  };
  allProjects: Project[] = [];
  joinedProjects: Project[] = [];
  constructor(
    private router: Router,
    private http: HttpClient,
    private toast: NgToastService
  ) {}
  showNotiFication() {
    this.toast.success({
      detail: "SUCCESS",
      summary: "Your Success Message",
      duration: 5000,
    });
  }
  onSubmit() {
    const url = "https://transparent-potent-typhoon.glitch.me/projects";

    // Get the token from localStorage
    const token = localStorage.getItem("token");

    // Create headers with the authorization token
    const headers = new HttpHeaders().set("Authorization", `${token}`);

    // Prepare the payload for the POST request
    const payload = {
      projectName: this.newProject.projectName,
      description: this.newProject.description,
      startDate: this.newProject.startDate,
      endDate: this.newProject.endDate,
    };

    // Make the POST request
    this.http.post(url, payload, { headers }).subscribe(
      (response) => {
        console.log("Post request successful:", response);
        const headers = new HttpHeaders({
          Authorization: `${token}`,
        });
        this.http
          .get<any>("https://transparent-potent-typhoon.glitch.me/projects/me", { headers })
          .subscribe(
            (response) => {
              this.allProjects = response.projects; // Save the response to the variable
              console.log("Projects response:", this.allProjects);
              this.toast.success({
                detail: "Project Added",
                summary: "Project has been added",
                duration: 5000,
              });
              // let $modalEle = document.getElementById("authentication-modal");
              // const modal: ModalInterface = new Modal($modalEle, {});
              // $modalEle?.remove();
            },
            (error) => {
              console.error("Error fetching projects:", error);
              this.toast.error({
                detail: "Something went Wrong",
                summary: "Some Error occurred while creating project",
              });
            }
          );
      },
      (error) => {
        console.error("Error making POST request:", error);
        this.toast.error({
          detail: "Something went Wrong",
          summary: "Some Error occurred while creating project",
        });
      }
    );
  }
  onInputChange(value: string) {
    console.log(value);
    this.newProject.startDate = value;
  }
  selectTab(tab: string): void {
    this.activeTab = tab;
  }
  ngOnInit(): void {
    const token = localStorage.getItem("token");
    if (!token) {
      this.router.navigate(["/login"]);
    }
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });
    this.http
      .get<any>("https://transparent-potent-typhoon.glitch.me/projects/me", { headers })
      .subscribe(
        (response) => {
          this.allProjects = response.projects; // Save the response to the variable
          console.log("Projects response:", this.allProjects);
        },
        (error) => {
          console.error("Error fetching projects:", error);
        }
      );
    this.http
      .get<any>("https://transparent-potent-typhoon.glitch.me/members/projects", { headers })
      .subscribe(
        (response) => {
          this.joinedProjects = response.projects; // Save the response to the variable
          console.log("Projects response:", this.joinedProjects);
        },
        (error) => {
          console.error("Error fetching projects:", error);
        }
      );
  }
}
