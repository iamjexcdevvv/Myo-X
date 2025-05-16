import { inject, Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot,
    CanActivate,
    GuardResult,
    MaybeAsync,
    Router,
    RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "./core/auth.service";
import { LoadingSpinnerService } from "./core/loading-spinner.service";
import { catchError, finalize, of, switchMap, tap } from "rxjs";
import { TokenService } from "./core/token.service";

@Injectable({
    providedIn: "root",
})
export class AuthGuard implements CanActivate {
    private readonly _authService = inject(AuthService);
    private readonly _loadingSpinnerService = inject(LoadingSpinnerService);
    private readonly _router = inject(Router);
    private readonly _tokenService = inject(TokenService);

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): MaybeAsync<GuardResult> {
        this._loadingSpinnerService.toggleLoadingSpinner.set(true);

        return this._authService.checkAuthentication().pipe(
            tap(() => {
                this._authService.isAuthenticated.set(true);
                this._loadingSpinnerService.toggleLoadingSpinner.set(false);
            }),
            catchError(() => {
                return this._tokenService.refreshToken().pipe(
                    tap({
                        next: () => this._authService.isAuthenticated.set(true),
                        error: () =>
                            this._authService.isAuthenticated.set(false),
                    }),
                    catchError(() => {
                        this._router.navigate(["/auth/login"], {
                            queryParams: { returnUrl: state.url },
                        });
                        return of(false);
                    }),
                    switchMap(() => of(this._authService.isAuthenticated()))
                );
            }),
            switchMap(() => of(this._authService.isAuthenticated())),
            finalize(() =>
                this._loadingSpinnerService.toggleLoadingSpinner.set(false)
            )
        );
    }
}
