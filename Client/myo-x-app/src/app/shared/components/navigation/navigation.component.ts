import { NgIf } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { PWAService } from "../../../core/pwa.service";
import { AuthService } from "../../../core/auth.service";

@Component({
    selector: "navigation",
    templateUrl: "./navigation.component.html",
    imports: [RouterLink, NgIf],
})
export class NavigationComponent {
    private readonly _pwaService = inject(PWAService);
    private readonly _authService = inject(AuthService);

    toggleSideNav = signal(false);

    toggle() {
        this.toggleSideNav.set(!this.toggleSideNav());
    }

    isAvailableForInstall() {
        return this._pwaService.installAvailable();
    }

    installApp() {
        this._pwaService.promptInstall();
    }

    isAuthenticated() {
        return this._authService.isAuthenticated();
    }

    logout() {
        this._authService.logout();
    }
}
