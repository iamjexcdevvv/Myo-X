import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class AuthService {
    private readonly _http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    register(userCredentials: {
        email: string;
        password: string;
        confirmPassword: string;
    }) {
        return this._http.post<{ success: boolean }>(
            `${this.apiUrl}/api/auth/register`,
            userCredentials
        );
    }
}
