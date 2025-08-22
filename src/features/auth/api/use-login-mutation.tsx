import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '../../../shared/api/client';
import { localStorageKeys } from '../../../shared/config/localstorage-keys';

export const callbackUrl = 'http://localhost:5173/oauth/callback';

export const useLoginMutation = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ code }: { code: string }) => {
			const response = await client.POST('/auth/login', {
				body: {
					code: code,
					redirectUri: callbackUrl,
					rememberMe: true,
					accessTokenTTL: '1d'
				}
			});
			if (response.error) {
				throw new Error(response.error.message);
			}
			return response.data;
		},
		onSuccess: (data) => {
			localStorage.setItem(localStorageKeys.refreshToken, data.refreshToken);
			localStorage.setItem(localStorageKeys.accessToken, data.accessToken);
			queryClient.invalidateQueries({
				queryKey: ['auth', 'me']
			});
		}
	});

	return mutation;
};
