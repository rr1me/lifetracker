import { AuthData } from '../../../../redux/slices/authSlice';
import { useSelector } from 'react-redux';

const HelpActions = () => {
	const helpChoice = useSelector((state: { authSlice: AuthData }) => state.authSlice.helpChoice);

	return <>{helpChoice === 0 ? 'input' : 'hey'}</>;
};

export default HelpActions;
