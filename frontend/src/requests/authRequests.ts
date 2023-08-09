import axios from 'axios';
import * as process from 'process';

type userCreds = {
	username: string,
	password: string
};

const singup = (userCreds: userCreds) => axios.post(process.env.API+'/register', userCreds);

export default {singup};
