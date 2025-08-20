import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '../../../../shared/api/client';
import type { SchemaGetPlaylistsOutput } from '../../../../shared/api/schema';

export const useDeleteMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (playlistId: string) => {
			const response = await client.DELETE('/playlists/{playlistId}', {
				params: { path: { playlistId } }
			});
			return response.data;
		},
		onSuccess: (_, playlistId) => {
			queryClient.setQueriesData({ queryKey: ['playlists'] }, (oldData: SchemaGetPlaylistsOutput) => {
				return {
					...oldData,
					data: oldData.data.filter((p) => p.id !== playlistId)
				};
			});
		}
	});
};
