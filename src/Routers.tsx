import React from 'react'

import { Route, Switch } from 'react-router-dom'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import Wallets from './pages/Wallets'
import Transactions from './pages/Transactions'
import Referral from './pages/Referral'
import Presales from './pages/Presales'
import Vouchers from './pages/Vouchers'
import Orders from './pages/Orders'
import ReferralAccount from './pages/ReferralAccount'
import UsedWallets from './pages/UsedWallets'
/* import * as routers from './route.json' */

export const data = [
	{
		route: "/login",
		exact: true,
		component: Login
	},
	{
		title: "Dashboard",
		route: "/",
		exact: true,
		icon: "bx bx-category-alt",
		component: Dashboard
	},
	{
		title: "Customers",
		route: "/customers",
		icon: "bx bx-user-pin",
		component: Customers
	},
	{
		title: "transactions",
		route: "/transactions",
		icon: "bx bx-list-ol",
		component: Transactions 
	},
	{
		title: "Orders",
		route: "/orders",
		icon: "bx bx-cart",
		component: Orders
	},
	{
		title: "Wallets",
		route: "/wallets",
		icon: "bx bx-bitcoin",
		component: Wallets
	},
	{
		title: "Used Wallets",
		route: "/used-wallets",
		icon: "bx bxl-bitcoin",
		component: UsedWallets
	},
	{
		title: "Referral Code",
		route: "/referral",
		icon: "bx bx-user-voice",
		component: Referral
	},
	{
		title: "Referred Accounts",
		route: "/referred-accounts",
		icon: "bx bxs-user-voice",
		component: ReferralAccount
	},
	{
		title: "Presale Code",
		route: "/presale",
		icon: "bx bx-store-alt",
		component: Presales
	},
	{
		title: "Voucher",
		route: "/voucher",
		icon: "bx bx-gift",
		component: Vouchers
	}
]

const Routes = () => {
	return (
		<Switch>
			{ data.map((i,k)=>i.component && <Route key={k} path={i.route} exact={!!i.exact} component={i.component}/>) }
		</Switch>
	)
}

export default Routes
