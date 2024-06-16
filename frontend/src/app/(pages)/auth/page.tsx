import s from './page.module.scss';
import Lamp from '@/app/components/atoms/Lamp/Lamp';
import AuthInputZone from '@/app/components/organisms/AuthInputZone/AuthInputZone';
import AuthHeaderZone from '@/app/components/organisms/AuthHeaderZone/AuthHeaderZone';
import Button from '@/app/components/atoms/Button/Button';
import AuthSubmitZone from '@/app/components/organisms/AuthSubmitZone/AuthSubmitZone';

const page = () => {
	return (
		<main className={s.auth}>
			<div className={s.light}>
				<Lamp sx={{
					height: 1600,
					width: 2000,
					background:
						'radial-gradient(50% 50%, rgba(0, 204, 168, 0.21), ' +
						'rgba(0, 204, 168, 0.12) 40%, transparent)'
				}} />
			</div>

			<AuthHeaderZone />

			<AuthInputZone />

			<AuthSubmitZone />
		</main>
	);
};

export default page;
