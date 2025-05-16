import { Injectable, signal } from "@angular/core";
import { SwUpdate, VersionReadyEvent } from "@angular/service-worker";
import { filter } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class PWAService {
    installAvailable = signal(false);
    deferredPrompt: any;

    constructor(private swUpdate: SwUpdate) {
        window.addEventListener("beforeinstallprompt", (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.installAvailable.set(true);
        });

        if (swUpdate.isEnabled) {
            // Listen for version updates
            swUpdate.versionUpdates
                .pipe(
                    filter(
                        (evt): evt is VersionReadyEvent =>
                            evt.type === "VERSION_READY"
                    )
                )
                .subscribe((evt) => {
                    this.promptUser(evt);
                });
        }
    }

    private promptUser(event: VersionReadyEvent): void {
        // Prevent automatic activation
        this.swUpdate.activateUpdate().then(() => {
            // Only prompt after update is ready to activate
            if (confirm("A new version is available. Load it now?")) {
                window.location.reload();
            }
        });
    }

    promptInstall(): void {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            this.deferredPrompt.userChoice.finally(() => {
                this.deferredPrompt = null;
                this.installAvailable.set(false);
            });
        }
    }
}
