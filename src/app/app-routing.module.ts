import { RouterModule, Routes } from "@angular/router";
import { ChicksComponent } from "./production/chicks/chicks.component";
import { EggsComponent } from "./production/eggs/eggs.component";
import { NgModule } from "@angular/core";
import { HomeComponent } from "./home/home.component";
import { DispatchComponent } from "./production/dispatch/dispatch.component";
import { LoginComponent } from "./authentication/login/login.component";
import { RegisterComponent } from "./authentication/register/register.component";
import { AuthGuard } from "./authentication/auth.guard";
import { DashboardComponent } from "./home/dashboard/dashboard.component";
import { HatcheryComponent } from "./hatchery/hatchery.component";
import { PendingOrdersComponent as OrdersComponent } from "./sales/orders/orders.component";
import { ClientsComponent } from "./sales/clients/clients.component";
import { UsersComponent } from "./users/users.component";
import { ListAndCreateUsersComponent } from "./users/list/list.component";
import { UpdateAccountDetailsComponent } from "./users/update-account-details/update-account-details.component";
import { MyAccountDetailsComponent } from "./users/my-account-details/my-account-details.component";

const routes: Routes = [
    { 
        path: '', component: HomeComponent, 
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DashboardComponent},
            { path: 'chicks', component: ChicksComponent},
            { path: 'eggs', component: EggsComponent},
            { path: 'dispatch', component: DispatchComponent},
            { path: 'hatchery', component: HatcheryComponent},
            { path: 'orders', component: OrdersComponent},
            { path: 'clients', component: ClientsComponent},
            { path: 'users', component: ListAndCreateUsersComponent,
              children: [
                { path: 'update', component: UpdateAccountDetailsComponent},
              ]
            },
            { path: 'account', component: MyAccountDetailsComponent},
        ] },
        { path: 'login', component: LoginComponent},
        { path: 'register', component: RegisterComponent},
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule{} 