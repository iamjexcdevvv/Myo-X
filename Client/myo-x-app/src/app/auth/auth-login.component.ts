import { Component, inject } from "@angular/core";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { AuthService } from "../core/auth.service";
import { Router } from "@angular/router";

@Component({
    selector: "login",
    templateUrl: "./auth-login.component.html",
    imports: [ReactiveFormsModule],
})
export class LoginComponent {
    private readonly _formBuilder = inject(FormBuilder);
    private readonly _authService = inject(AuthService);
    private readonly _router = inject(Router);

    loginAuth = this._formBuilder.group({
        email: new FormControl("", [Validators.required, Validators.email]),
        password: new FormControl("", [Validators.required]),
    });

    onSubmit() {
        if (!this.loginAuth.value.email || !this.loginAuth.value.password)
            return;

        this._authService
            .login({
                email: this.loginAuth.value.email,
                password: this.loginAuth.value.password,
            })
            .subscribe({
                next: (res) => {
                    if (res.success) {
                        this._authService.isAuthenticated.set(true);
                        this._router.navigate(["/dashboard"]);
                    }
                },
                error: ({ error }) => {
                    if ("Email" in error.errors) {
                        this.loginAuth.get("email")?.setErrors({
                            emailBackendValidator: error.errors.Email[0],
                        });
                    }
                    if ("Password" in error.errors) {
                        this.loginAuth.get("password")?.setErrors({
                            passwordBackendValidator: error.errors.Password[0],
                        });
                    }
                },
            });
    }
}
