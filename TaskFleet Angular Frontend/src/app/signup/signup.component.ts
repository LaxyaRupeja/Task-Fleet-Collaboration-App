import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { NgToastService } from "ng-angular-popup";
interface User {
  username: string;
  email: string;
  password: string;
}

@Component({
  selector: "app-signup",
  templateUrl: `./signup.component.html`,
  styles: [],
})
export class SignupComponent {
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
      username: this.user.username,
      email: this.user.email,
      password: this.user.password,
    };

    this.http.post("https://transparent-potent-typhoon.glitch.me/register", payload).subscribe(
      (response) => {
        console.log("Signup successful", response);
        this.toast.success({
          detail: "Account Created",
          summary: "Please Login with the same credentials",
          duration: 5000,
        });
        this.router.navigate(["/login"]);
      },
      (error) => {
        this.toast.error({
          detail: "Can't able to create your account",
          summary: "Some Error Occurred While Creating your account",
        });
        console.error("Signup failed", error);
      }
    );
  }
}
