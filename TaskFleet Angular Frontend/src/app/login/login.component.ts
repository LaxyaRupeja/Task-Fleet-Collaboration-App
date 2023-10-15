import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NgToastService } from "ng-angular-popup";
import { Router } from "@angular/router";
interface User {
  username: string;
  email: string;
  password: string;
}
@Component({
  selector: "app-login",
  templateUrl: `./login.component.html`,
  styles: [],
})
export class LoginComponent implements OnInit {
  user: User = {
    username: "",
    email: "",
    password: "",
  };
  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: NgToastService
  ) {}
  onSubmit() {
    const payload = {
      email: this.user.email,
      password: this.user.password,
    };

    this.http.post("https://transparent-potent-typhoon.glitch.me/login", payload).subscribe(
      (response: any) => {
        console.log("Signup successful", response);
        if (response.token) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));
          // location.href = "/projects";
          this.router.navigate(["/projects"]);
        }
      },
      (error) => {
        this.toast.error({
          detail: "Wrong Email/Passowrd",
          summary: "Some Error occurred while Login",
          sticky: true,
        });
        console.error("Signup failed", error);
      }
    );
  }
  ngOnInit(): void {
    localStorage.clear();
  }
}
