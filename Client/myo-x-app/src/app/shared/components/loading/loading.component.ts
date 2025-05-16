import { NgIf } from "@angular/common";
import { Component, inject } from "@angular/core";
import { LoadingSpinnerService } from "../../../core/loading-spinner.service";

@Component({
    selector: "loading",
    templateUrl: "./loading.component.html",
    imports: [NgIf],
})
export class LoadingComponent {
    private readonly _loadingSpinnerService = inject(LoadingSpinnerService);

    showLoading() {
        return this._loadingSpinnerService.toggleLoadingSpinner();
    }
}
