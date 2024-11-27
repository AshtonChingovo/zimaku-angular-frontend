import { RouterModule, Routes } from "@angular/router";
import { ChicksComponent } from "./production/chicks/chicks.component";
import { EggsComponent } from "./production/eggs/eggs.component";
import { NgModule } from "@angular/core";
import { HomeComponent } from "./home/home.component";
import { DashboardComponent } from "./home/dashboard/dashboard.component";
import { DispatchComponent } from "./production/dispatch/dispatch.component";
import { LoginComponent } from "./authentication/login/login.component";
import { RegisterComponent } from "./authentication/register/register.component";

const routes: Routes = [
    { path: '', component: HomeComponent, children: [
        { path: '' , component: DashboardComponent},
        { path: 'chicks', component: ChicksComponent},
        { path: 'eggs', component: EggsComponent},
        { path: 'dispatch', component: DispatchComponent}],
    },
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule{}