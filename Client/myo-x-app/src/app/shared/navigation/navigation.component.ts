import { Component, signal } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
    selector: "navigation",
    templateUrl: "./navigation.component.html",
    imports: [RouterLink],
})
export class NavigationComponent {
    toggleSideNav = signal(false);

    toggle() {
        this.toggleSideNav.set(!this.toggleSideNav());
    }
}
