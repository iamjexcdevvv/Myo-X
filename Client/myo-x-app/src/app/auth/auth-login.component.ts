import { Component, inject } from "@angular/core";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";

@Component({
    selector: "login",
    templateUrl: "./auth-login.component.html",
    imports: [ReactiveFormsModule],
})
export class LoginComponent {
    private readonly _formBuilder = inject(FormBuilder);

    loginAuth = this._formBuilder.group({
        email: new FormControl("", [Validators.required, Validators.email]),
        password: new FormControl("", [Validators.required]),
    });

    onSubmit() {
        console.log(this.loginAuth.value);
    }
}
