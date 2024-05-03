declare interface Window  {
	bitgo:		any
	ethers:		any
}

declare interface ServerResponse {
	result?:    any
	error?:     number
}

declare interface LoginReqeustType {
	username: string
	password: string
}

declare interface LoginResponseType {
	token: 		string
	username:	string
	email: 		string
	pinCode: 	boolean
	lastSeen:	number
	created: 	number
}

declare interface LogsType {
	coin: 			string
	usd: 			number
	updated:		number
}

declare interface TxType {
	txid: 			String
	chain: 			String
	coin: 			String
	address:		String
	confirms:		number
	confirmed: 		boolean
	input: 			Boolean
	amount: 		Number
	created:		Number
}

declare interface AdminTxType {
	username: 	string
	chain: 		string
	coin: 		string
	quantity: 	number
	target: 	string
	amount: 	number
	confirms:	number
	confirmed: 	boolean
	txid: 		string
	updated: 	number
	created: 	number
}

declare interface AdminOrderType {
	username: 	string
	coin: 		string
	quantity: 	number
	target: 	string
	amount: 	number
	txid: 		string
	updated: 	number
	created: 	number
}

declare interface ChartType {
	prev?: 			Array<LogsType>
	date?: 			Array<LogsType>
	week?: 			Array<LogsType>
	month?: 		Array<LogsType>
}

declare interface AdminTotalType {
	total: 			number
	used:			number
}

declare interface AdminDashboardType {
	chart:			ChartType
	txs:			AdminTxType[]
	orders:			AdminOrderType[]
}


interface StoreTypes {
	lang:       		string
	theme:      		string
	mode:       		string
	color:      		string
	updated:			number
	loading?:			boolean
	prices:				{[coin:string]:number}
    user: 				LoginResponseType | null
	total: 				AdminDashboardType
	customerTotal: 		AdminTotalType
	wallet: 			AdminAddressTotalType[]
	daily: 				{ [coin:string]: AdminDailyType[] }
	deposits: 			AdminDepositType[]
	referral: 			AdminTotalType
	presale: 			AdminTotalType
	voucher: 			AdminTotalType
	customers:			AdminUsersResponseType
	transactions:		AdminTxsResponseType
	orders:				AdminOrdersResponseType
}


declare interface AdminCustomerType {
	id: 			string
	username: 		string
	email: 			string
	usd: 			number
	icicb: 			number
	btc: 			number
	eth: 			number
	bnb: 			number
	ltc: 			number
	usdt: 			number
	created: 		number
}

declare interface AdminReferralType {
	code: 			string
	count: 			number
	accounts: 		string[]
}

declare interface AdminWalletDetailType {
	id: 		string
	username:	string
	email:		string
	balances:	Array<{ k:string, v:{balance:0, locked:0} }>
	wallets:	Array<{ k:string, v: string }>
}
declare interface AdminDepositType {
	coin: 			string
	balance:		number
}
declare interface AdminDailyType {
	date: 			number
	value:			number
}
declare interface AdminAddressTotalType {
	chain: 			string
	total:			number
	used:			number
}

declare interface AdminTxType {
	username:		string
	chain: 			string
	coin: 			string
	address: 		string
	confirms:		number
	confirmed: 		boolean
	input: 			boolean
	amount: 		number
	created:		number
}

declare interface AdminOrderType {
	username: 	string
	coin: 		string
	quantity: 	number
	voucher?:	string
	target: 	string
	amount: 	number
	txid: 		string
	updated: 	number
	created: 	number
}
declare interface AdminUsersResponseType {
	count: 			number
	data: 			AdminCustomerType[]
}
declare interface AdminTxsResponseType {
	count: 			number
	data: 			AdminTxType[]
}

declare interface AdminOrdersResponseType {
	count: 			number
	data: 			AdminOrderType[]
}