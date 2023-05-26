/* eslint-disable import/prefer-default-export */
/* eslint-disable max-len */
import URL from 'url';

import Axios from 'axios';
// import { saveAs } from 'file-saver';
// import io from 'socket.io-client';

// process.env.REACT_APP_ENV = process.env.REACT_APP_ENV || 'LOCAL';
// const envFound = dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
// const ENV = process.env.REACT_APP_ENV;

const endpoint = 'https://app.chatpang.co';
// console.log(process.env.REACT_APP_ENV, endpoint);

// let socket = null;
// socket = io(endpoint.replace('/api', ''), { timeout: 1000, reconnectionDelay: 1000, reconnectionDelayMax: 2000 });
// socket?.on('connect', () => {
// 	console.log('log connect');
// 	socket?.emit('log_frontend', { topic: 'xx', msg: 'yy' });
// });

export const fetch = async ({
	method, url, data, query,
}) => {
	const headers = {
		'Content-Type': 'application/json; charset=utf-8',
	};
	if (window.localStorage.getItem('authen-token')) {
		headers.Authorization = `Bearer ${window.localStorage.getItem(
			'authen-token',
		)}`;
	}
	// if (window.localStorage.getItem(`user-token-${ENV}`)) {
	// 	headers.Authorization = `Bearer ${window.localStorage.getItem(
	// 		`user-token-${ENV}`,
	// 	)}`;
	// }
	try {
		const axiosArgs = {
			method,
			url: `${endpoint}${url}${URL.format({ query })}`,
			data,
			headers,
		};
		// if (socket) socket?.emit('log_frontend', { topic: 'fetch', msg: axiosArgs });
		const response = await Axios(axiosArgs);
		// if (socket) socket?.emit('log_frontend', { topic: 'response', msg: response });

		return { status: response.status, data: response.data };
	} catch (error) {
		// const err = error;

		// if (socket) socket?.emit('log_frontend', { topic: 'error', msg: err });

		if (error.response) {
			console.log('error.response', error.response, typeof error.response);
			if (error.response.status === 401) {
				window.localStorage.removeItem(
					`authen-token-${process.env.REACT_APP_ENV}`,
				);
				// window.location.href = '/';
			}
			return { status: error.response.status, data: error.response.data };
		}
		if (error.request) {
			console.log(error.request);
			return { status: '500', data: 'Server is out of reach' };
		}
		console.log('Error', error.message);
		return { status: '500', data: 'Fetch error' };
	}
};

// export const fetchDownload = async ({
// 	method = 'post',
// 	url, fileName, query,
// }) => {
// 	const headers = { 'Content-Type': 'application/json' };
// 	// if (window.localStorage.getItem(`authen-token-${ENV}`)) {
// 	// 	headers.Authorization = `Bearer ${window.localStorage.getItem(
// 	// 		`authen-token-${ENV}`,
// 	// 	)}`;
// 	// }
// 	if (window.localStorage.getItem(`user-token-${ENV}`)) {
// 		headers.Authorization = `Bearer ${window.localStorage.getItem(
// 			`user-token-${ENV}`,
// 		)}`;
// 	}
// 	try {
// 		const response = await Axios({
// 			method,
// 			url: `${endpoint}${url}${URL.format({ query })}`,
// 			headers,
// 			responseType: 'blob',
// 		});
// 		await saveAs(response.data, fileName);
// 		return { success: true };
// 	} catch (error) {
// 		if (error.response) {
// 			if (error.response.status === 440) {
// 				window.location.reload();
// 			}
// 			return { status: error.response.status, data: error.response.data };
// 		} if (error.request) {
// 			// The request was made but no response was received
// 			// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
// 			// http.ClientRequest in node.js
// 			console.log(error.request);

// 			return { status: '500', data: 'Server is out of reach' };
// 		}
// 		// Something happened in setting up the request that triggered an Error
// 		console.log('Error', error.message);
// 		return { status: '500', data: 'Fetch error' };
// 	}
// };
