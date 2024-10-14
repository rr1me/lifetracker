import { Injectable } from '@nestjs/common';
import {
	base64url,
	EncryptJWT,
	exportJWK,
	exportSPKI,
	exportPKCS8,
	generateKeyPair,
	generateSecret,
	jwtDecrypt,
	SignJWT,
	jwtVerify,
	decodeJwt,
	flattenedVerify,
	compactVerify,
	KeyLike
} from 'jose';

import * as crypto from 'node:crypto';
import * as util from 'node:util';
import { KeyObject } from 'node:crypto';
import { promisify } from 'node:util';

const oneShotVerify = promisify(crypto.verify);

@Injectable()
export class JwtService {
	async createConfirmationLink(email: string): Promise<{
		publicKey: KeyLike;
		link: string;
	}> {
		// const { publicKey, privateKey } = await generateKeyPair('ECDH-ES+A256KW', {
		// 	crv: 'X25519'
		// });

		const signKey = await generateKeyPair('ES256');
		const signKeyT = await generateKeyPair('ES256');

		const jwt = await new SignJWT({ email })
			.setProtectedHeader({ alg: 'ES256' })
			.setIssuedAt()
			.setIssuer('lifetracker.rr1me.space')
			.setExpirationTime('4h')
			.sign(signKey.privateKey);

		// console.log(await decodeJwt(jwt), await compactVerify(jwt, signKey.publicKey), typeof signKey.publicKey === 'function', util.types.isCryptoKey(signKey.publicKey), signKey.publicKey instanceof KeyObject);
		// console.log(crypto.KeyObject.from(signKey.publicKey as CryptoKey));

		const { 0: protectedHeader, 1: payload, 2: signature, length } = jwt.split('.');

		// console.log(
		// 	await compactVerify(jwt, signKey.publicKey),
		// 	signKey.publicKey instanceof KeyObject
		// );

		const data = concat(
			encoder.encode(protectedHeader ?? ''),
			encoder.encode('.'),
			typeof payload === 'string' ? encoder.encode(payload) : payload
		);

		// @ts-ignore
		// console.log(crypto.verify('sha256', data, { dsaEncoding: 'ieee-p1363', key: signKeyT.publicKey }, new Uint8Array(Buffer.from(signature, 'base64'))));

		// @ts-ignore
		// crypto.verify('ES256', await decodeJwt(jwt), { dsaEncoding: 'ieee-p1363', key: signKey.publicKey }, new TextDecoder().decode(jwt))

		return jwt;
	}
}

export function concat(...buffers) {
	const size = buffers.reduce((acc, { length }) => acc + length, 0);
	const buf = new Uint8Array(size);
	let i = 0;
	for (const buffer of buffers) {
		buf.set(buffer, i);
		i += buffer.length;
	}
	return buf;
}

export const encoder = new TextEncoder();
export const decoder = new TextDecoder();
