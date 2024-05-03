const lang = 'en-US';

const initialState: StoreTypes = {
	lang,
	theme:'theme-mode-dark',
	mode:'',
	color:'theme-mode-dark',
	updated: 0,
	loading: false,
	user: null,
	total: {
		chart:		{},
		txs:		[],
		orders:		[]
	},
	customerTotal:	{
		total:	0,
		used:	0,
	},
	prices: 	{},
	wallet: 	[],
	deposits:	[],
	daily:		{},
	referral: 	{
		total: 	0,
		used:	0,
	},
	presale: 	{
		total: 	0,
		used:	0,
	},
	voucher: 	{
		total: 	0,
		used:	0,
	},
	customers: {
		count: 		0,
		data: 		[]
	},
	transactions: {
		count: 		0,
		data: 		[]
	},
	orders: {
		count: 		0,
		data: 		[]
	}
}

export default initialState