const defaultLocale = 'el';
const SUPPORTED_LOCALES = [
	{
		code: 'el',
		base: '',
		name: 'Ελληνικά',
		short: 'ΕΛ',
		translation: '/locale/el.json'
	},
	{
		code: 'en',
		base: '/en',
		name: 'English',
		short: 'EN',
		translation: '/locale/en.json'
	}
];

const getLocaleRegex = () => {
	let reg = '';
	SUPPORTED_LOCALES.forEach((locale, index) => {
		reg = `${reg}${locale.code}${index !== SUPPORTED_LOCALES.length - 1 ? '|' : ''}`;
	});
	return `(${reg})`;
};

const getLocale = (locale) => {
	return SUPPORTED_LOCALES.find(loc => loc.code === locale);
};

export {
	defaultLocale,
	getLocale,
	getLocaleRegex,
	SUPPORTED_LOCALES
};
