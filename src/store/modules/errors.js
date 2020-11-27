export default {
	namespaced: true,
	state: {
		error: false,
		errorMessage: '',
		errorStatus: 0
	},
	getters: {
		error: state => state.error,
		errorMessage: state => state.errorMessage,
		errorStatus: state => state.errorStatus
	},
	mutations: {
		REQUEST_ERROR (state, err) {
			state.error = true;
			state.errorMessage = err.message;
			state.errorStatus = err.status || 500;
		},
		CLOSE_ERROR (state) {
			state.error = false;
			state.errorMessage = '';
			state.errorStatus = 0;
		}
	}
};
