import { Component } from "@angular/core";
import { PromptUpdateService } from "./core/prompt-update.service";
import { RouterOutlet } from "@angular/router";
import { NavigationComponent } from "./shared/navigation/navigation.component";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    imports: [RouterOutlet, NavigationComponent],
})
export class AppComponent {
    constructor(private updateService: PromptUpdateService) {}
}
