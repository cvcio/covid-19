import { normalizeNFD } from '@/utils';

export default {
	install (Vue) {
		Vue.filter('normalizeNFD', normalizeNFD);
	}
};
