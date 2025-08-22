import { useForm, type Path } from 'react-hook-form';
import type { SchemaCreatePlaylistRequestPayload } from '../../../../shared/api/schema';
import { useAddPlaylistMutation } from '../api/use-add-playlist-mutation';
import { isJsonApiErrorDocument, parseJsonApiErrors } from '../../../../shared/util/json-api-error';

export const AddPlaylistForm = () => {
	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors }
	} = useForm<SchemaCreatePlaylistRequestPayload>();

	const { mutateAsync } = useAddPlaylistMutation();

	const onSubmit = async (data: SchemaCreatePlaylistRequestPayload) => {
		try {
			await mutateAsync(data);
			reset();
		} catch (error) {
			if (isJsonApiErrorDocument(error)) {
				const { fieldErrors, globalErrors } = parseJsonApiErrors(error);
				for (const [field, message] of Object.entries(fieldErrors)) {
					setError(field as Path<SchemaCreatePlaylistRequestPayload>, { type: 'server', message });
				}
				if (globalErrors.length > 0) {
					setError('root.sever', {
						type: 'server',
						message: globalErrors.join('\n')
					});
				}
			}
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<h2>Add New Playlist</h2>
			<p>
				<input {...register('title')} />
			</p>
			{errors.title && <p>{errors.title.message}</p>}
			<p>
				<textarea {...register('description')}></textarea>
			</p>
			{errors.description && <p>{errors.description.message}</p>}
			<button type="submit">Create</button>

			{errors.root?.server && <p>{errors.root?.server.message}</p>}
		</form>
	);
};
