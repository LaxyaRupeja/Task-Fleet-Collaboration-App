import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
@Component({
  selector: "app-callback",
  template: ` <p class="text-center text-3xl">Loading....</p> `,
  styles: [],
})
export class CallbackComponent implements OnInit {
  userToken: string | null = "";
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.userToken = this.route.snapshot.queryParamMap.get("token");
    const headers = new HttpHeaders().set(
      "Authorization",
      this.userToken || ""
    );
    this.http.get("https://transparent-potent-typhoon.glitch.me/getUser", { headers }).subscribe(
      (response: any) => {
        console.log(response);
        localStorage.setItem("user", JSON.stringify(response.user));
        if (this.userToken) {
          localStorage.setItem("token", this.userToken);
          this.router.navigate(["/projects"]);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
