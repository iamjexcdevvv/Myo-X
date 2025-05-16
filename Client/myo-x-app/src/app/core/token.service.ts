import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: "root",
})
export class TokenService {
    private readonly _http = inject(HttpClient);
    refreshToken() {
        return this._http.post(
            `${environment.apiUrl}/api/auth/refresh-token`,
            null,
            {
                withCredentials: true,
            }
        );
    }
}
