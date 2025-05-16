import { Component, inject } from "@angular/core";
import { AuthService } from "../core/auth.service";

@Component({
    selector: "dashboard",
    templateUrl: "./dashboard.component.html",
})
export class DashboardComponent {
    private readonly _authService = inject(AuthService);

    isUserAuthenticated() {
        return this._authService.isAuthenticated();
    }
}
