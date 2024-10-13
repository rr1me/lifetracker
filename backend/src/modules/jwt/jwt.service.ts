import { Injectable } from '@nestjs/common';
import { generateKeyPair, jwtDecrypt, EncryptJWT, generateSecret } from 'jose';

@Injectable()
export class JwtService {
	async createConfirmationLink(email: string) {
		const secret = await generateSecret('RS256');

		const jwt = await new EncryptJWT({
			email
		}).encrypt(secret);

		return jwt;
	}
}
