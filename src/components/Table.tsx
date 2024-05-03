import React from 'react'
import './table.scss'

import logo from '../assets/ICICB.svg'

export interface TableStatus {
    page: 	number
	count: 	number
	limit: 	number
	data: 	any[]
	pages?: any[]
}

interface TableProps {
	filter?:		string
    limit: 			number
	page?: 			number
    count?: 		number
	data?: 			any[]
	blank?: 		JSX.Element
	header?: 		JSX.Element
	render: 		Function
	style?:			{[key:string]:string|number}
	onRequest?: 	(page:number, limit:number, count:number) => Promise<TableStatus>
	onLoading?: 	(loading:boolean) => void
}

const Table = ({ filter, limit, page, count, header, blank, style, data, render, onRequest, onLoading }: TableProps) => {
	const pageLimit = 10
	const [status, setStatus] = React.useState<TableStatus>({
		page: 	page || 0,
		count: 	count || 0,
		limit,
		data: 	limit && data ? data.slice((page || 0) * limit,(page || 0) * limit + limit) : [],
		pages: 	[]
	})

	const selectPage = (i:number) => {
		if (onRequest) {
			requestData(i)
		} else if (data) {
			const start = status.limit * i
			const end = start + status.limit
			setStatus({ ...status, page:i, data:data.slice(start, end) })
		}
	}

	const requestData = (i:number, init?:boolean) => {
		if (onRequest) {
			if (onLoading) onLoading(true)
			onRequest(i, status.limit, init ? 0 : status.count ).then(response => {
				let total = Math.floor(response.count / limit)
				if (response.count % limit !== 0) total++
				let pages = [] as number[]
				for(let i=0; i < total; i++) pages.push(i)
				setStatus({
					...status,
					page: 	i,
					count: 	response.count,
					data: 	response.data,
					pages
				})
				if (onLoading) onLoading(false)
			})
		}
	}

	React.useEffect(() => {
		requestData(status.page, true)
		if (data && data.length && limit) {
			let total = Math.floor(data.length / limit)
			if ( data.length % limit !== 0 ) total++
			let iPage = page || status.page
			if (status.page>=total - 1) iPage = total - 1
			let pages = [] as number[]
			for(let i=0; i<total; i++) pages.push(i)

			setStatus({
				...status,
				page:	iPage,
				count: 	data.length,
				data:	data.slice(iPage * limit, iPage * limit + limit),
				pages
			})
		}
	}, [filter, data, page, count, limit])
	const isBlank = status.data.length===0
	return (
		<div style={{ display:'flex', flexDirection:'column', ...style }}>
			<div className={ "table-wrapper" + ( isBlank ? ' d-center' : '' )}>
				{ isBlank && blank ? (
					blank
				) : (
					<table>
						{ header ? <thead>{ header }</thead> : null }
						{ status.data && render ? ( <tbody>{ status.data.map((i, k) => render(i, k, status.page)) }</tbody> ) : null }
					</table>
				)}
			</div>
			{ status.pages && status.pages.length>1 ? (
				<div className="pagination">
					{ status.page > 0 ? (
						<div className={`item`} onClick={() => selectPage(status.page - 1)}>
							Prev
						</div>
					) : null}
					{ status.pages.slice(status.page - status.page % pageLimit, status.page - status.page % pageLimit + pageLimit) .map(k => (
						<div key={k} className={`item ${status.page === k ? 'active' : ''}`} onClick={() => selectPage(k)}>
							{k + 1}
						</div>
					)) }
					{ status.page < Math.floor(status.count / status.limit) - 1 ? (
						<div className={`item`} onClick={() => selectPage(status.page + 1)}>
							Next
						</div>
					) : null}
				</div>
			) : null}
		</div>
	)
}

export default Table
