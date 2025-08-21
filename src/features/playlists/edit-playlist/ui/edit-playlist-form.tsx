import { useForm } from 'react-hook-form';
import type { SchemaUpdatePlaylistRequestPayload } from '../../../../shared/api/schema';
import { useEffect } from 'react';
import { usePlaylistQuery } from '../api/use-playlist-query';
import { useUpdatePlaylistMutation } from '../api/use-update-playlist-mutation';

type Props = {
	playlistId: string | null;
};

export const EditPlaylistForm = ({ playlistId }: Props) => {
	const { register, handleSubmit, reset } = useForm<SchemaUpdatePlaylistRequestPayload>();

	useEffect(() => {
		reset();
	}, [playlistId]);

	const { data, isPending, isError } = usePlaylistQuery(playlistId);

	const { mutate } = useUpdatePlaylistMutation();

	const onSubmit = (data: SchemaUpdatePlaylistRequestPayload) => {
		mutate({ ...data, playlistId: playlistId! });
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
