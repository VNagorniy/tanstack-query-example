import { Outlet } from '@tanstack/react-router';
import { Header } from '../../shared/ui/header/header';
import styles from './root-layout.module.css';
// import { LoginButton } from '../../features/auth/ui/login.button';
import { AccountBar } from '../../features/auth/ui/account-bar';

export const RootLayout = () => (
	<>
		<Header renderAccountBar={() => <AccountBar />} />
		<div className={styles.container}>
			<Outlet />
		</div>
	</>
);
