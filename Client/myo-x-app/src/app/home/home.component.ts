import { Component } from "@angular/core";
import { NavigationComponent } from "../shared/components/navigation/navigation.component";

@Component({
    selector: "home",
    templateUrl: "./home.component.html",
    imports: [NavigationComponent],
})
export class HomeComponent {}
