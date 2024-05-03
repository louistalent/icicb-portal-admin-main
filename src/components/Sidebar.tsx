import React from 'react'

import { Link } from 'react-router-dom'

import './sidebar.scss'

import logo from '../assets/logo.svg'

import {data} from '../Routers'
import useStore from '../useStore'

const SidebarItem = (props) => {

	const active = props.active ? 'active' : ''

	return (
		<div className="item">
			<div className={`item-inner ${active}`}>
				<i className={props.icon}></i>
				<span>
					{props.title}
				</span>
			</div>
		</div>
	)
}

const Sidebar = (props) => {
	const {T} = useStore()
	return (
		<div className='sidebar'>
			<div className="logo">
				<img src={logo} alt="company logo" />
				<h1>{T('title')}</h1>
			</div>
			{ data.map((i, k) => (
				i.icon && <Link to={i.route} key={k}>
					<SidebarItem
						title={i.title}
						icon={i.icon}
						active={i.route === props.location.pathname}
					/>
				</Link>
			)) }
		</div>
	)
}

export default Sidebar
