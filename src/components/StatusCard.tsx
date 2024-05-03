import React from 'react'

import './statuscard.scss'

const StatusCard = (props) => {
	return (
		<div className='status-card'>
			<div className="icon">
				<i style={{fontSize:'1.3em'}} className={props.icon}></i>
			</div>
			<div className="info">
				{props.element}
			</div>
		</div>
	)
}

export default StatusCard
