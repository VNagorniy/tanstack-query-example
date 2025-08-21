import { useForm } from 'react-hook-form';
import type { SchemaCreatePlaylistRequestPayload } from '../../../../shared/api/schema';
import { useAddPlaylistMutation } from '../api/use-add-playlist-mutation';

export const AddPlaylistForm = () => {
	const { register, handleSubmit } = useForm<SchemaCreatePlaylistRequestPayload>();

	const { mutate } = useAddPlaylistMutation();

	const onSubmit = (data: SchemaCreatePlaylistRequestPayload) => {
		mutate(data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<h2>Add New Playlist</h2>
			<p>
				<input {...register('title')} />
			</p>
			<p>
				<textarea {...register('description')}></textarea>
			</p>
			<button type="submit">Create</button>
		</form>
	);
};
