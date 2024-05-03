import React from "react";
import './modal.scss'

interface ModalProps {
	zIndex?: number
	children:any
	onClose?:()=>void
	className?: string
	style?: React.CSSProperties
}


const Modal = ({onClose, children, className, style, zIndex}:ModalProps) => {
	return (
		<div className="modal" style={{zIndex}}>
			<div style={style} className={className}>
				{ onClose ? (
					<div className="close" onClick={()=>onClose()}>&times;</div>
				) : null }
				<div>
					{children}
				</div>
			</div>
		</div>
	)
}

export default Modal