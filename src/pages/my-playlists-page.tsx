import { Navigate } from '@tanstack/react-router';
import { useMeQuery } from '../features/api/use-me-query';
import { Playlists } from '../features/playlists';

export function MyPlaylistsPage() {
	const { data, isPending } = useMeQuery();

	if (isPending) return <div>Loading...</div>;

	if (!data) {
		return <Navigate to="/" replace />;
	}

	return (
		<div>
			<h2>My playlists</h2>
			<Playlists userId={data.userId} />
		</div>
	);
}
