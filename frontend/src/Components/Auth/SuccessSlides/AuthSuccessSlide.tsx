import s from './AuthSuccessSlide.module.scss';
import { actions } from '../../../redux/slices/authSlice';
import { useAppDispatch } from '../../../redux/store';

const { successReady } = actions;

const AuthSuccessSlide = () => {
	const dispatch = useAppDispatch();

	const onReadyClick = () => dispatch(successReady());

	return (
		<div className={s.success}>
			<p className={s.signed}>You <span className={s.green}>successfully</span> signed up</p>
			Please confirm your email address by using a link in confirmation message that we&apos;ve sent on your email
			<p>After that, click on <span className={s.cyan}>button</span> below to continue</p>
			<button className={s.button} onClick={onReadyClick}>I&apos;m ready to sign in</button>
		</div>
	);
};

export default AuthSuccessSlide;
