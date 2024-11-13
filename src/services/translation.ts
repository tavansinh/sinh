import axios from 'axios';

interface GeoResponse {
	country_code: string;
}

const countryToLanguage: Record<string, string> = {
	US: 'en',
	GB: 'en',
	AU: 'en',
	CA: 'en',
	NZ: 'en',
	IE: 'en',
	ES: 'es',
	FR: 'fr',
	DE: 'de',
	IT: 'it',
	PT: 'pt',
	NL: 'nl',
	BE: 'nl',
	PL: 'pl',
	RO: 'ro',
	GR: 'el',
	HU: 'hu',
	SE: 'sv',
	DK: 'da',
	NO: 'no',
	FI: 'fi',
	CZ: 'cs',
	SK: 'sk',
	CN: 'zh',
	TW: 'zh',
	HK: 'zh',
	JP: 'ja',
	KR: 'ko',
	TH: 'th',
	VN: 'vi',
	ID: 'id',
	MY: 'ms',
	IN: 'hi',
	SA: 'ar',
	AE: 'ar',
	IL: 'he',
	TR: 'tr',
	MX: 'es',
	AR: 'es',
	CL: 'es',
	CO: 'es',
	PE: 'es',
	VE: 'es',
	BR: 'pt',
	RU: 'ru',
	BY: 'ru',
	KZ: 'ru',
	ZA: 'en',
	EG: 'ar',
	MA: 'ar',
	UA: 'uk',
	PH: 'tl',
};

const getCountryCode = async (): Promise<string> => {
	try {
		const response = await axios.get<GeoResponse>(
			'https://get.geojs.io/v1/ip/geo.json',
		);
		return response.data.country_code;
	} catch (error) {
		console.error('Error fetching geo location:', error);
		return 'US';
	}
};

const getTargetLanguage = async (): Promise<string> => {
	const countryCode = await getCountryCode();
	return countryToLanguage[countryCode] ?? 'en';
};

const translateText = async (text: string): Promise<string> => {
	try {
		const finalTargetLang = await getTargetLanguage();
		const response = await axios.get(
			`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${finalTargetLang}&dt=t&q=${encodeURIComponent(
				text,
			)}`,
		);
		return response.data[0][0][0];
	} catch (error) {
		console.error('Translation error:', error);
		return text;
	}
};

export default translateText;
