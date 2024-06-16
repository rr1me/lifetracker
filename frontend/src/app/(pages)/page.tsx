import s from './page.module.scss';
import TestTempl from '@/app/components/templates/TestTempl';
import { cookies } from 'next/headers';

export default function page() {

	return (
		<main className={s.main}>
			<TestTempl str={cookies().get('auth')?.value}/>
		</main>
	);
}
