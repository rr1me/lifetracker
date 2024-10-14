import { Injectable } from '@nestjs/common';
import { exportSPKI, generateKeyPair, SignJWT } from 'jose';
import { concat, encoder } from './jwt.utils';
import { verify } from 'node:crypto';

@Injectable()
export class JwtService {
	async createConfirmationLink(email: string): Promise<{
		publicKey: string;
		link: string;
	}> {
		const { publicKey, privateKey } = await generateKeyPair('ES256');

		const jwt = await new SignJWT({ email })
			.setProtectedHeader({ alg: 'ES256' })
			.setIssuedAt()
			.setIssuer('lifetracker.rr1me.space')
			.setExpirationTime('4h')
			.sign(privateKey);

		return {
			publicKey: await exportSPKI(publicKey),
			link: 'lifetracker.rr1me.space/verify/' + jwt
		};
	}

	verifyJwt(jwt: string, publicKey: string): boolean {
		const { 0: protectedHeader, 1: payload, 2: signature } = jwt.split('.');

		const data = concat(
			encoder.encode(protectedHeader ?? ''),
			encoder.encode('.'),
			typeof payload === 'string' ? encoder.encode(payload) : payload
		);

		return verify(
			'sha256',
			data,
			{
				dsaEncoding: 'ieee-p1363',
				key: publicKey
			},
			new Uint8Array(Buffer.from(signature, 'base64'))
		);
	}
}
