import { useForm } from 'react-hook-form';
import type { SchemaGetPlaylistsOutput, SchemaUpdatePlaylistRequestPayload } from '../../../../shared/api/schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { client } from '../../../../shared/api/client';
import { useEffect } from 'react';
import { useMeQuery } from '../../../api/use-me-query';

type Props = {
	playlistId: string | null;
};

export const EditPlaylistForm = ({ playlistId }: Props) => {
	const { register, handleSubmit, reset } = useForm<SchemaUpdatePlaylistRequestPayload>();

	const { data: meData } = useMeQuery();

	useEffect(() => {
		reset();
	}, [playlistId]);

	const { data, isPending, isError } = useQuery({
		queryKey: ['playlists', 'details', playlistId],
		queryFn: async () => {
			const response = await client.GET('/playlists/{playlistId}', { params: { path: { playlistId: playlistId! } } });
			return response.data!;
		},
		enabled: !!playlistId
	});

	const queryClient = useQueryClient();

	const key = ['playlists', 'my', meData!.userId];
	const { mutate } = useMutation({
		mutationFn: async (data: SchemaUpdatePlaylistRequestPayload) => {
			const response = await client.PUT('/playlists/{playlistId}', {
				params: { path: { playlistId: playlistId! } },
				body: { ...data, tagIds: [] }
			});
			return response.data;
		},
		onMutate: async (data: SchemaUpdatePlaylistRequestPayload) => {
			// Cancel any outgoing refetches
			// (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({ queryKey: ['playlists'] });

			// Snapshot the previous value
			const previousMyPlaylists = queryClient.getQueryData(key);

			// Optimistically update to the new value
			queryClient.setQueryData(key, (oldData: SchemaGetPlaylistsOutput) => {
				return {
					...oldData,
					data: oldData.data.map((p) => {
						if (p.id === playlistId)
							return {
								...p,
								attributes: { ...p.attributes, description: data.description, title: data.title }
							};
						else return p;
					})
				};
			});

			// Return a context with the previous and new todo
			return { previousMyPlaylists };
		},
		// If the mutation fails, use the context we returned above
		onError: (_, __: SchemaUpdatePlaylistRequestPayload, context) => {
			queryClient.setQueryData(['playlists', key], context!.previousMyPlaylists);
		},
		// Always refetch after error or success:
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ['playlists'],
				refetchType: 'all'
			});
		}
	});

	const onSubmit = (data: SchemaUpdatePlaylistRequestPayload) => {
		mutate(data);
	};

	if (!playlistId) return <></>;
	if (isPending) return <p>...Loading</p>;
	if (isError) return <p>Error</p>;

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<h2>Edit Playlist</h2>
			<p>
				<input {...register('title')} defaultValue={data.data.attributes.title} />
			</p>
			<p>
				<textarea {...register('description')} defaultValue={data.data.attributes.description!}></textarea>
			</p>
			<button type="submit">Save</button>
		</form>
	);
};
