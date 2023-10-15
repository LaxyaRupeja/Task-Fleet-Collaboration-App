import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { NgToastService } from "ng-angular-popup";

@Component({
  selector: "app-notification-page",
  templateUrl: `./notification-page.component.html`,
  styles: [],
})
export class NotificationPageComponent implements OnInit {
  notifications: any[] = [];

  constructor(private httpClient: HttpClient, private toast: NgToastService) {}
  ngOnInit(): void {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders().set("Authorization", `${token}`);
    this.httpClient
      .get(`https://transparent-potent-typhoon.glitch.me/notifications`, { headers })
      .subscribe(
        (response: any) => {
          this.notifications = response.notifications;
        },
        (error) => {
          this.toast.error({
            detail: "Something went Wrong",
            summary: "Some Error occurred while Fetching Notificaiton",
          });
          // alert("Error while fetching Notication");
          console.log("Error while fetching notificaiton", error);
        }
      );
  }
}
