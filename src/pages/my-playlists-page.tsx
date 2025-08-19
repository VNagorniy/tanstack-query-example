import { Navigate } from '@tanstack/react-router';
import { useMeQuery } from '../features/api/use-me-query';
import { Playlists } from '../widgets/playlists/ui/playlists';
import { AddPlaylistForm } from '../features/playlists/add-playlist/ui/add-playlist-form';

export function MyPlaylistsPage() {
	const { data, isPending } = useMeQuery();

	if (isPending) return <div>Loading...</div>;

	if (!data) {
		return <Navigate to="/" replace />;
	}

	return (
		<div>
			<h2>My playlists</h2>
			<hr />
			<AddPlaylistForm />
			<hr />
			<Playlists userId={data.userId} />
		</div>
	);
}
