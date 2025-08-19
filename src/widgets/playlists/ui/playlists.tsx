import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { client } from '../../../shared/api/client';
import { Pagination } from '../../../shared/ui/pagination/pagination';
import { useState } from 'react';
import { DeletePlaylist } from '../../../features/playlists/delete-playlist/ui/delete-playlist';

type Props = {
	userId?: string;
};

export const Playlists = ({ userId }: Props) => {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState('');

	const query = useQuery({
		queryKey: ['playlists', { page, search, userId }],
		queryFn: async ({ signal }) => {
			const response = await client.GET('/playlists', {
				params: {
					query: {
						pageNumber: page,
						search,
						userId
					}
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

	if (query.isPending) return <span>Loading...</span>;
	if (query.isError) return <span>Error: {JSON.stringify(query.error)}</span>;

	return (
		<div>
			<div>
				<input value={search} onChange={(e) => setSearch(e.currentTarget.value)} placeholder={'search...'} />
			</div>
			<hr />
			<div>
				<Pagination pagesCount={query.data.meta.pagesCount} currentPage={query.data.meta.page} onPageNumberChange={setPage} isFetching={query.isFetching} />
				<ul>
					{query.data.data.map((playlist) => (
						<li key={playlist.id}>
							{playlist.attributes.title} <DeletePlaylist playlistId={playlist.id} />
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};
