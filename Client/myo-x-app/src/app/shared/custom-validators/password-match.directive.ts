import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const isMisMatch =
            control.get("password")?.value !==
            control.get("confirmPassword")?.value;

        return isMisMatch ? { passwordMismatch: true } : null;
    };
}
