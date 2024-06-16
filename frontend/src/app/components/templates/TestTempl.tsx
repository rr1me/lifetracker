'use client';

const TestTempl = ({ str = 'none' }: {str?: string}) => {
	console.log(str);

	return (
		<div>
			{str}
		</div>
	);
};

export default TestTempl;
