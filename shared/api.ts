const api = {
	tickers: {
		getAll: `/api/getAll`,
		getFiltered: (filter: string): string => {
			const base = "/api/getFiltered";
			if (filter == null || filter.length === 0) return base;
			return `${base}?${encodeURI(`f=${filter}`)}`;
		}
	}
}


export default api;