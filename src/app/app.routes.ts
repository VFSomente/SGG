import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
	},
	{
		path: 'viaturas',
		loadComponent: () => import('./pages/viaturas/viaturas.component').then(m => m.Viaturas)
	},
		{
			path: 'viaturas/detalhe',
			loadComponent: () => import('./pages/viatura-detalhe/viatura-detalhe.component').then(m => m.ViaturaDetalhe)
		},
	{
		path: '**',
		redirectTo: '',
		pathMatch: 'full'
	}
];

// For prerendering: routes that include params should expose their prerender params.
// Return empty arrays for parameterized routes to skip prerendering them.
export const getPrerenderParams = async () => ({
	'viaturas/:id': []
});
