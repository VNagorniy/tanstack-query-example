import { createRoot } from 'react-dom/client';
import '../styles/reset.css';
import '../styles/index.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from '@tanstack/react-router';
import { queryClientInstance } from '../tanstack-query/query-client-instance';
import { routerInstance } from '../tanstack-router/router-instance';

createRoot(document.getElementById('root')!).render(
	<QueryClientProvider client={queryClientInstance}>
		<RouterProvider router={routerInstance} />
		<ReactQueryDevtools initialIsOpen={false} />
	</QueryClientProvider>
);
