import localFont from 'next/font/local';
import { Inter, Roboto } from 'next/font/google';

const helveticaFont = localFont({
	src: [
		{
			path: '../../public/fonts/helvetica_regular.woff2'
		}
	]
});

const interFont = Inter({ subsets: ['latin'] });
const robotoFont = Roboto({ weight: '400', subsets: ['latin'] });
const robotoLightFont = Roboto({ weight: '300', subsets: ['latin'] });

export const roboto = robotoFont.className;
export const robotoLight = robotoLightFont.className;
