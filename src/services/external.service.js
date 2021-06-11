import { api, APIError } from '@/api';

const externalSVC = {
	async getMapData (playload) {
		try {
			let url = process.env.VUE_APP_BASE_API + `/agg/${playload.level}/all/cases,deaths,active,new_cases,new_deaths,new_active`;
			url += playload.from ? `/${playload.from}` : '';
			const response = await api.get(url, { crossdomain: true });
			return response.data;
		} catch (error) {
			throw new APIError(error.response ? error.response.status : 'Error', error.message);
		}
	},

	async getGreeceTotal (playload) {
		try {
			let url = process.env.VUE_APP_BASE_API + '/total/greece/all';
			url += playload.from ? `/${playload.from}` : '';
			url += playload.to ? `/${playload.to}` : '';
			const response = await api.get(url, { crossdomain: true });
			return response.data;
		} catch (error) {
			throw new APIError(error.response ? error.response.status : 'Error', error.message);
		}
	},

	async getGlobalTotal (playload) {
		try {
			let url = process.env.VUE_APP_BASE_API + '/total/global/all';
			url += playload.from ? `/${playload.from}` : '';
			const response = await api.get(url, { crossdomain: true });
			return response.data;
		} catch (error) {
			throw new APIError(error.response ? error.response.status : 'Error', error.message);
		}
	},

	async getGlobal (playload) {
		try {
			const url = process.env.VUE_APP_BASE_API + `/total/global/${playload}`;
			const response = await api.get(url, { crossdomain: true });
			return response.data;
		} catch (error) {
			throw new APIError(error.response ? error.response.status : 'Error', error.message);
		}
	},

	async getGreeceAGG (playload) {
		try {
			const url = process.env.VUE_APP_BASE_API + `/agg/greece/${playload}`;
			const response = await api.get(url, { crossdomain: true });
			return response.data;
		} catch (error) {
			throw new APIError(error.response ? error.response.status : 'Error', error.message);
		}
	},

	async getGlobalAGG (playload) {
		try {
			const url = process.env.VUE_APP_BASE_API + `/agg/global/${playload}`;
			const response = await api.get(url, { crossdomain: true });
			return response.data;
		} catch (error) {
			throw new APIError(error.response ? error.response.status : 'Error', error.message);
		}
	},

	async getGRVaccines (playload) {
		try {
			const url = process.env.VUE_APP_BASE_API + `/vaccines/greece/${playload}`;
			const response = await api.get(url, { crossdomain: true });
			return response.data;
		} catch (error) {
			throw new APIError(error.response ? error.response.status : 'Error', error.message);
		}
	},
	async getGRVaccinesAGG (playload) {
		try {
			let url = process.env.VUE_APP_BASE_API + '/agg/vaccines/greece/all/all';
			url += playload.from ? `/${playload.from}` : '';
			const response = await api.get(url, { crossdomain: true });
			return response.data;
		} catch (error) {
			throw new APIError(error.response ? error.response.status : 'Error', error.message);
		}
	},
	async getGRVaccinesTotal (playload) {
		try {
			let url = process.env.VUE_APP_BASE_API + '/total/vaccines/greece/all';
			url += playload.from ? `/${playload.from}` : '';
			const response = await api.get(url, { crossdomain: true });
			return response.data;
		} catch (error) {
			throw new APIError(error.response ? error.response.status : 'Error', error.message);
		}
	}
};
export {
	externalSVC
};
