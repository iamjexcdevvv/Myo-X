import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { AuthGuard } from "./auth.guard";
import { PageNotFoundComponent } from "./404/page-not-found.component";

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
                loadComponent: () =>
                    import("./auth/auth-login.component").then(
                        (c) => c.LoginComponent
                    ),
            },
            {
                path: "register",
                loadComponent: () =>
                    import("./auth/auth-register.component").then(
                        (c) => c.RegisterComponent
                    ),
            },
        ],
    },
    {
        path: "dashboard",
        loadComponent: () =>
            import("./dashboard/dashboard.component").then(
                (c) => c.DashboardComponent
            ),
        canActivate: [AuthGuard],
    },
    { path: "**", component: PageNotFoundComponent },
];
