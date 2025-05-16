import { Component, HostListener, inject } from "@angular/core";
import { PWAService } from "./core/pwa.service";
import { RouterOutlet } from "@angular/router";
import { NavigationComponent } from "./shared/components/navigation/navigation.component";
import { LoadingComponent } from "./shared/components/loading/loading.component";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    imports: [RouterOutlet, NavigationComponent, LoadingComponent],
})
export class AppComponent {}
