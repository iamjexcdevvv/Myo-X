import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class AuthService {
    private readonly _http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    isAuthenticated = signal(false);

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

    login(userCredentials: { email: string; password: string }) {
        return this._http.post<{ success: boolean; accessToken: string }>(
            `${this.apiUrl}/api/auth/login`,
            userCredentials,
            { withCredentials: true }
        );
    }

    checkAuthentication() {
        return this._http.get(`${this.apiUrl}/api/auth/check`, {
            withCredentials: true,
        });
    }

    logout() {
        this._http
            .post(`${this.apiUrl}/api/auth/logout`, null, {
                withCredentials: true,
            })
            .subscribe(() => this.isAuthenticated.set(false));
    }
}
