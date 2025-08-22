import { useMeQuery } from '../api/use-me-query';
import { CurrentUser } from './current-user/current-user';
import { LoginButton } from './login-button';

export const AccountBar = () => {
	const query = useMeQuery();

	return (
		<div>
			{!query.data && <LoginButton />}
			{query.data && <CurrentUser />}
		</div>
	);
};
