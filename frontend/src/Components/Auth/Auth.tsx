import s from './Auth.module.scss';
const Auth = () => {
	const delay = (s: number) => new Promise(resolve => setTimeout(resolve, s * 1000));


	(async function() {
		const proxies = Array(10).fill(0).map((v, i) => i);
		const articles = Array(41).fill(0).map((v, i) => i);

		const maxStackCount = 5

		const articleStackSize = articles.length / proxies.length;
		const basicStackCount = articleStackSize > maxStackCount ? maxStackCount : articleStackSize;

		console.log(articleStackSize, basicStackCount);

		console.log(proxies.length, articles.length, maxStackCount, articles.length/maxStackCount);
		const buffer = Array(proxies.length).fill(0).map(()=>[]) as number[][];

		// for (let i = 0; i<buffer.length; i++){
		// 	if (typeof buffer[i] === 'number') buffer[i] = []
		// }

		for (let i = 0; i < articles.length; i++) {
			if (proxies.length < articles.length / maxStackCount) {
				const currentStackPart = Math.ceil((i + 1) / maxStackCount) - 1;
				const index = currentStackPart - Math.floor(currentStackPart / proxies.length) * proxies.length;
				console.log(i, index, Math.floor(currentStackPart / proxies.length) * proxies.length, Math.floor(currentStackPart));

				buffer[index].push(i)
			} else {
				const index = Math.floor(i/articleStackSize);
				buffer[index].push(i);
			}
		}
		console.log(buffer.reverse());
	})()

// console.log(Math.floor(i/articleStackSize), basicStackCount, articleStackSize, i/articleStackSize);


	return (
		<>

		</>
	)
};

export default Auth;
