import { Navigate } from '@tanstack/react-router';
import { useMeQuery } from '../features/auth/api/use-me-query';
import { Playlists } from '../widgets/playlists/ui/playlists';
import { AddPlaylistForm } from '../features/playlists/add-playlist/ui/add-playlist-form';
import { useState } from 'react';
import { EditPlaylistForm } from '../features/playlists/edit-playlist/ui/edit-playlist-form';

export function MyPlaylistsPage() {
	const { data, isPending } = useMeQuery();
	const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>();

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
			<Playlists userId={data.userId} onPlaylistSelected={setEditingPlaylistId} />
			<hr />
			<EditPlaylistForm playlistId={editingPlaylistId} />
		</div>
	);
}
