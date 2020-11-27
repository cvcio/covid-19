import { api, APIError } from '@/api';

const internalSVC = {
	async getGeo () {
		try {
			const response = await api.get(process.env.VUE_APP_BASE_URL + 'shared/geo.geojson');
			return response.data;
		} catch (error) {
			throw new APIError(error.response ? error.response.status : 'Error', error.message);
		}
	}
};
export {
	internalSVC
};
