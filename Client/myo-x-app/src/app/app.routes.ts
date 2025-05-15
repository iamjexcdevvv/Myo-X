import { Routes } from "@angular/router";
import { LoginComponent } from "./auth/auth-login.component";
import { HomeComponent } from "./home/home.component";
import { RegisterComponent } from "./auth/auth-register.component";

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent,
    },
    {
        path: "auth",
        children: [
            {
                path: "login",
                component: LoginComponent,
            },
            {
                path: "register",
                component: RegisterComponent,
            },
        ],
    },
];
