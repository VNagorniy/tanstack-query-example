import { Outlet } from '@tanstack/react-router';
import { Header } from '../../shared/ui/header/header';
import styles from './root-layout.module.css';
import { AccountBar } from '../../features/auth/ui/account-bar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const RootLayout = () => (
	<>
		<Header renderAccountBar={() => <AccountBar />} />
		<div className={styles.container}>
			<Outlet />
			<ToastContainer />
		</div>
	</>
);
