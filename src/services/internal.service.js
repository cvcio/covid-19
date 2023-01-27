import { api, APIError } from '@/api';

const internalSVC = {
	async getGeoRegionalUnitsC (geo = 'geo-') {
		try {
			const response = await api.get(`${process.env.VUE_APP_BASE_URL}shared/encoded_regionalUnits-v${process.env.VUE_APP_VERSION}.geojson`, {
				headers: {
					'Content-Encoding': 'gzip'
				}
			});
			return response.data;
		} catch (error) {
			throw new APIError(error.response ? error.response.status : 'Error', error.message);
		}
	},
	async getGeoRegionalUnitsV (geo = 'geo-') {
		try {
			const response = await api.get(`${process.env.VUE_APP_BASE_URL}shared/encoded_regionalUnits-v${process.env.VUE_APP_VERSION}.geojson`, {
				headers: {
					'Content-Encoding': 'gzip'
				}
			});
			return response.data;
		} catch (error) {
			throw new APIError(error.response ? error.response.status : 'Error', error.message);
		}
	},
	async getGeoMunicipalities (geo = 'geo-') {
		try {
			const response = await api.get(`${process.env.VUE_APP_BASE_URL}shared/encoded_municipalities-v${process.env.VUE_APP_VERSION}.geojson`, {
				headers: {
					'Content-Encoding': 'gzip'
				}
			});
			return response.data;
		} catch (error) {
			throw new APIError(error.response ? error.response.status : 'Error', error.message);
		}
	},
	async getAnnotations () {
		try {
			const response = await api.get(process.env.VUE_APP_BASE_URL + 'data/annotations.json');
			return response.data;
		} catch (error) {
			throw new APIError(error.response ? error.response.status : 'Error', error.message);
		}
	},
	async getPosts () {
		try {
			const response = await api.get(process.env.VUE_APP_BASE_URL + 'data/posts.json');
			return response.data;
		} catch (error) {
			throw new APIError(error.response ? error.response.status : 'Error', error.message);
		}
	},
	async getDescription () {
		try {
			const response = await api.get(process.env.VUE_APP_BASE_URL + 'data/description.json');
			return response.data;
		} catch (error) {
			throw new APIError(error.response ? error.response.status : 'Error', error.message);
		}
	}
};
export {
	internalSVC
};
