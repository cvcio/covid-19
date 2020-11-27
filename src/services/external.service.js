import { api, APIError } from '@/api';

const externalSVC = {
	async getMapData (playload) {
		try {
			let url = `/agg/${playload.level}/all/cases,deaths,active,new_cases,new_deaths,new_active`;
			url += playload.from ? `/${playload.from}` : '';
			const response = await api.get(url);
			return response.data;
		} catch (error) {
			throw new APIError(error.response ? error.response.status : 'Error', error.message);
		}
	},

	async getGreeceTotal (playload) {
		try {
			let url = '/total/greece/all';
			url += playload.from ? `/${playload.from}` : '';
			const response = await api.get(url);
			return response.data;
		} catch (error) {
			throw new APIError(error.response ? error.response.status : 'Error', error.message);
		}
	},

	async getGlobalTotal (playload) {
		try {
			let url = '/total/global/all';
			url += playload.from ? `/${playload.from}` : '';
			const response = await api.get(url);
			return response.data;
		} catch (error) {
			throw new APIError(error.response ? error.response.status : 'Error', error.message);
		}
	},

	async getGlobal (playload) {
		try {
			const url = `/total/global/${playload}`;
			const response = await api.get(url);
			return response.data;
		} catch (error) {
			throw new APIError(error.response ? error.response.status : 'Error', error.message);
		}
	},

	async getGreeceAGG (playload) {
		try {
			const url = `/agg/greece/${playload}`;
			const response = await api.get(url);
			return response.data;
		} catch (error) {
			throw new APIError(error.response ? error.response.status : 'Error', error.message);
		}
	},

	async getGlobalAGG (playload) {
		try {
			const url = `/agg/global/${playload}`;
			const response = await api.get(url);
			return response.data;
		} catch (error) {
			throw new APIError(error.response ? error.response.status : 'Error', error.message);
		}
	}
};
export {
	externalSVC
};
