import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { client } from '../../../shared/api/client';
import { Pagination } from '../../../shared/ui/pagination/pagination';
import { useState } from 'react';
import { DeletePlaylist } from '../../../features/playlists/delete-playlist/ui/delete-playlist';

type Props = {
	userId?: string;
	onPlaylistSelected?: (playlistId: string) => void;
	isSearchActive?: boolean;
};

export const Playlists = ({ userId, onPlaylistSelected, isSearchActive }: Props) => {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState('');

	const key = userId ? ['playlists', 'my', userId] : ['playlists', { page, search }];
	const queryParams = userId
		? {
				userId
		  }
		: {
				pageNumber: page,
				search
		  };

	const query = useQuery({
		//eslint-disable-next-line @tanstack/query/exhaustive-deps
		queryKey: key,
		queryFn: async ({ signal }) => {
			const response = await client.GET('/playlists', {
				params: {
					query: queryParams
				},
				signal
			});
			if (response.error) {
				throw (response as unknown as { error: Error }).error;
			}
			return response.data;
		},
		placeholderData: keepPreviousData
	});

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
				<Pagination pagesCount={query.data.meta.pagesCount} currentPage={query.data.meta.page} onPageNumberChange={setPage} isFetching={query.isFetching} />
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
