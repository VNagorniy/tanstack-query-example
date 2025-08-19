import type { ReactNode } from 'react';
import styles from './header.module.css';
import { Link } from '@tanstack/react-router';

type Props = {
	renderAccountBar: () => ReactNode;
};

export const Header = ({ renderAccountBar }: Props) => (
	<header className={styles.header}>
		<div className={styles.container}>
			<div className={styles.linksBlock}>
				<Link to="/">Playlists</Link>
			</div>
			<div>{renderAccountBar()}</div>
		</div>
	</header>
);
