import { Component } from "@angular/core";

@Component({
  selector: "app-profile",
  templateUrl: `./profile.component.html`,
  styles: [],
})
export class ProfileComponent {
  isEditMode: boolean = false;

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }
}
