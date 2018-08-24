import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard';
import { SingUpComponent } from './sing-up/sing-up';
@NgModule({
	declarations: [DashboardComponent,
    SingUpComponent],
	imports: [],
	exports: [DashboardComponent,
    SingUpComponent]
})
export class ComponentsModule {}
