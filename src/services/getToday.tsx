const getToday = () => {
	const today = new Date();
	return today.toLocaleDateString('vi-VN', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	});
};
export default getToday;
