import React from 'react'

import './topnav.scss'

/* import { Link } from 'react-router-dom' */

import Dropdown from './Dropdown'

import ThemeMenu from './ThemeMenu'
import useStore from '../useStore'

/* import notifications from '../assets/JsonData/notification.json' */


/* import user_menu from '../assets/JsonData/user_menus.json' */


/* const renderNotificationItem = (item, index) => (
	<div className="notification" key={index}>
		<i className={item.icon}></i>
		<span>{item.content}</span>
	</div>
) */

interface ActionType {
	icon:	string
	label:	string
	action:	Function
}

const Topnav = () => {
	const { user, update } = useStore()

	const onLogoff = () => {
		update({user:null})
	}

	const userMenu = [
		{
			icon:       "bx bx-log-out-circle bx-rotate-180",
			label:    "Logout",
			action:     onLogoff
		}
	] as ActionType[]
	
	return (
		<div className='topnav'>
			<div className="search">
			</div>
			<div className="right">
				<div>
					<Dropdown
						customToggle={() => (
							<div className="account">
								<div className="name">
									{user?.username || ''}
								</div>
							</div>
						)}
						contentData={userMenu}
						renderItems={(i, k) => (
							<div key={k} className="notification" onClick={i.action}>
								<i className={i.icon}></i>
								<span>{i.label}</span>
							</div>
						)}
					/>
				</div>
				{/* <div>
					<ThemeMenu/>    
				</div> */}
			</div>
		</div>
	)
}

export default Topnav
