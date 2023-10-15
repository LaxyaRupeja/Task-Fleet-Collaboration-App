import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { initFlowbite } from "flowbite";
@Component({
  selector: "app-root",
  templateUrl: `./app.component.html`,
  styles: [],
})
export class AppComponent implements OnInit {
  showNavbar: boolean = true;
  loggedIn: boolean = false;
  profilePicture!: string;
  title = "TaskFleet";
  username!: string;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.url;
        this.showNavbar = !["/login", "/signup", "/callback"].includes(
          currentRoute
        );
      }
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem("token");
    const userJson = localStorage.getItem("user");
    if (userJson !== null) {
      const user = JSON.parse(userJson);
      this.profilePicture = user.userProfile;
      this.username = user.username;
    } else {
      this.username = "Default Username";
    }
    if (token) {
      this.loggedIn = true;
    }

    initFlowbite();
  }
  onNavigationEnd() {
    // Trigger ngOnInit()
    this.ngOnInit();
  }

  ngAfterViewInit() {
    // Subscribe to the NavigationEnd event
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.onNavigationEnd();
      }
    });
  }
}
