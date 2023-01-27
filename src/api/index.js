import axios from 'axios';

class APIError extends Error {
	constructor(status, message) {
		super(message);
		this.name = this.constructor.name;
		this.message = message;
		this.status = status;
	}
}

const api = {
	init(baseURL) {
		// axios.defaults.baseURL = baseURL;
	},

	get(resource, data) {
		return axios.get(resource, data);
	},

	getExternal(resource) {
		return axios.get(resource, {
			headers: {
				Authorization: `Token ${process.env.VUE_APP_GOV_API_KEY}`
			}
		});
	},

	post(resource, data) {
		return axios.post(resource, data);
	}
};

export { api, APIError };
