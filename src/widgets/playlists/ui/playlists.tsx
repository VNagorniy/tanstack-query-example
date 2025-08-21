import { Pagination } from '../../../shared/ui/pagination/pagination';
import { useState } from 'react';
import { DeletePlaylist } from '../../../features/playlists/delete-playlist/ui/delete-playlist';
import { usePlaylistsQuery } from '../../api/use-playlists-query';

type Props = {
	userId?: string;
	onPlaylistSelected?: (playlistId: string) => void;
	isSearchActive?: boolean;
};

export const Playlists = ({ userId, onPlaylistSelected, isSearchActive }: Props) => {
	const [pageNumber, setPageNumber] = useState(1);
	const [search, setSearch] = useState('');

	const query = usePlaylistsQuery(userId, { pageNumber, search });

	const handlePlaylistClick = (playlistId: string) => {
		onPlaylistSelected?.(playlistId);
	};

	if (query.isPending) return <span>Loading...</span>;
	if (query.isError) return <span>Error: {JSON.stringify(query.error)}</span>;

	return (
		<div>
			{isSearchActive && (
				<>
					<div>
						<input value={search} onChange={(e) => setSearch(e.currentTarget.value)} placeholder={'search...'} />
					</div>
					<hr />
				</>
			)}
			<div>
				<Pagination pagesCount={query.data.meta.pagesCount} currentPage={pageNumber} onPageNumberChange={setPageNumber} isFetching={query.isFetching} />
				<ul>
					{query.data.data.map((playlist) => (
						<li key={playlist.id} onClick={() => handlePlaylistClick(playlist.id)}>
							{playlist.attributes.title} <DeletePlaylist playlistId={playlist.id} />
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};
