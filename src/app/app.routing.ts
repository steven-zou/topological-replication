/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { ModuleWithProviders } from '@angular/core/src/metadata/ng_module';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { RegistryComponent } from './registry/registry.component'
import { PolicyComponent } from './policy/policy.component'
import { LoginComponent } from './login/login.component';
import { ShellComponent } from './shell/shell.component';
import { AuthGuard } from './guard/auth.guard';
import { ServerFormComponent } from './server-form/server-form.component';
import { TopologyBuilderComponent } from './topology-builder/topology-builder.component';


export const ROUTES: Routes = [
    {path: '', redirectTo: 'harbor', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {
    	path: 'harbor', 
    	component: ShellComponent,
    	//canActivateChild: [AuthGuard],
    	children:[
    	  {path: '', redirectTo: 'registries', pathMatch: 'full'},
    	  {
              path: 'registries', 
              component: RegistryComponent,
              children: [
                {path: 'add', component: ServerFormComponent},
                {path: 'edit/:id', component: ServerFormComponent},
              ]
          },
          {
              path: 'policies', 
              component: PolicyComponent,
              children: [
                {path: 'build', component: TopologyBuilderComponent},
                {path: 'edit/:id', component: TopologyBuilderComponent},
              ]
          }
    	]
    },
    {path: '**', redirectTo: 'harbor', pathMatch: 'full'}
];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(ROUTES);
