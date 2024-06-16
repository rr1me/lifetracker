import s from './Button.module.scss';
import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef, HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

export enum ButtonColorVariation {
	cyan,
	black
}

const Button = forwardRef<
	HTMLButtonElement,
	{
		children: ReactNode,
		colorVariation?: ButtonColorVariation,
		className?: string
	}
	& Omit<
	DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
	& HTMLAttributes<HTMLAnchorElement>,
	'className' | 'ref'>
>(({
	children,
	colorVariation = 0,
	className,
	...props
}, ref) => {
	const variation = (() => {
		switch (colorVariation) {
		case ButtonColorVariation.cyan: return s.cyan;
		case ButtonColorVariation.black: return s.black;
		default: return ButtonColorVariation.cyan;
		}
	})();

	return <button ref={ref} className={clsx({
		[s.button]: true,
		[variation]: true,
		[className!]: !!className
	})} {...props}>{children}</button>;
});
Button.displayName = 'Button';

export default Button;
