import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '../../../shared/api/client';
import { localStorageKeys } from '../../../shared/config/localstorage-keys';

export const useLogoutMutation = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async () => {
			const response = await client.POST('/auth/logout', {
				body: {
					refreshToken: localStorage.getItem(localStorageKeys.refreshToken)!
				}
			});

			return response.data;
		},
		onSuccess: () => {
			localStorage.removeItem(localStorageKeys.accessToken);
			localStorage.removeItem(localStorageKeys.refreshToken);
			queryClient.resetQueries({
				queryKey: ['auth', 'me']
			});
		}
	});

	return mutation;
};
