import { Component, inject } from "@angular/core";
import {
    FormBuilder,
    FormControl,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { AuthService } from "../core/auth.service";
import { passwordMatchValidator } from "../shared/custom-validators/password-match.directive";

@Component({
    selector: "selector-name",
    templateUrl: "./auth-register.component.html",
    imports: [ReactiveFormsModule],
})
export class RegisterComponent {
    private readonly _formBuilder = inject(FormBuilder);
    private readonly _authService = inject(AuthService);

    registerAuth = this._formBuilder.group(
        {
            email: new FormControl("", [Validators.required, Validators.email]),
            password: new FormControl("", [
                Validators.required,
                Validators.minLength(8),
            ]),
            confirmPassword: new FormControl("", [Validators.required]),
        },
        { validators: passwordMatchValidator() }
    );

    onSubmit() {
        console.log(this.registerAuth.value);

        if (
            this.registerAuth.value.email &&
            this.registerAuth.value.password &&
            this.registerAuth.value.confirmPassword
        ) {
            this._authService
                .register({
                    email: this.registerAuth.value.email,
                    password: this.registerAuth.value.password,
                    confirmPassword: this.registerAuth.value.confirmPassword,
                })
                .subscribe({
                    next: (response) => {
                        if (response.success) {
                            this.registerAuth.reset();
                        }
                    },
                    error: (errRes) => {
                        if ("Email" in errRes.error.errors) {
                            this.registerAuth.get("email")?.setErrors({
                                emailBackendValidator:
                                    errRes.error.errors.Email[0],
                            });
                        }
                    },
                });
        }
    }
}
