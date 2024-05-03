import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import './layout.scss'
import Sidebar from './Sidebar'
import TopNav from './TopNav'
import Routes from '../Routers'
import useStore from '../useStore'
import Loading from './Loading'
import Login from '../pages/Login'

const Layout = () => {
	const { user, mode, color, loading } = useStore()
	return user===null ? (
		<Login/>
	) : (
		<BrowserRouter>
			<Route render={(props) => (
				<div className={`layout ${mode} ${color}`}>
					<Sidebar {...props}/>
					<div className="content">
						<TopNav/>
						<div className="main">
							<Routes/>
						</div>
					</div>
				</div>
			)}/>
			<Loading type="bars" width={100} height={100} color={"#eee"} opacity={0.4} show={!!loading}/>
		</BrowserRouter>
	)
}

export default Layout
