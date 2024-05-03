import React from 'react'
import './table.scss'

export interface TableHeaderType {
    label?:			string
	css?:			string
	sortKey?:		string
}
export interface TableSortType {
    [key:string]:boolean
}

interface TableProps {
    limit: 			number
    count: 			number
	page?: 			number
	headers?:		TableHeaderType[]
	data:			any[]
	blank?: 		JSX.Element
	header?: 		JSX.Element
	render: 		Function
	style?:			{ [key:string]:string|number }
	onRequest?: 	( page:number, query?:string, sort?:TableSortType ) => Promise<void>
}

interface TableStatus {
    page: 	number
	sorts: 	TableSortType
}

const SortUp = (
	<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
		<path d="M11 9h9v2h-9zm0 4h7v2h-7zm0-8h11v2H11zm0 12h5v2h-5zm-6 3h2V8h3L6 4 2 8h3z" />
	</svg>
)

const SortDown = (
	<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
		<path d="m6 20 4-4H7V4H5v12H2zm5-12h9v2h-9zm0 4h7v2h-7zm0-8h11v2H11zm0 12h5v2h-5z" />
	</svg>
)

const Table2 = ({ limit, page, count, headers, header, blank, style, data, render, onRequest }: TableProps) => {
	const pageLimit = 10
	const [status, setStatus] = React.useState<TableStatus>({
		page: 	page || 0,
		sorts: {}
	})

	const onSort = ( key:string ) => async () => {
		const sorts = {} as {[key:string]:boolean}
		if (status.sorts[key]===undefined) {
			sorts[key] = false
		} else if (status.sorts[key]===false) {
			sorts[key] = true
		}
		onRequest && onRequest(0, undefined, sorts)
		setStatus({ ...status, sorts })
	}

	const onPage = ( i:number ) => {
		if (onRequest) {
			onRequest && onRequest(i, undefined, status.sorts)
			setStatus({ ...status, page:i })
		} else if (data) {
			/* const start = limit * i
			const end = start + limit
			setStatus({ ...status, page:i, data:data.slice(start, end) }) */
		}
	}

	let total = Math.floor(count / limit)
	if (count % limit !== 0) total++
	let pages = [] as number[], currentPage = status.page
	if (currentPage>total-1) currentPage = total - 1
	for(let i=0; i < total; i++) pages.push(i)
	const rows = onRequest===undefined ? data.slice(currentPage * limit, (currentPage + 1) * limit) : data
	const isBlank = rows.length===0

	return (
		<div style={{ display:'flex', flexDirection:'column', ...style }}>
			<div className={ "table-wrapper" + ( isBlank ? ' d-center' : '' )}>
				{ isBlank && blank ? (
					blank
				) : (
					<table className='table'>
						<thead>
							{ headers ? (
								headers.map( (i,k) => <th key={k} className={ i.css + (i.sortKey ? ' sort' : '') }><div>{i.label} { i.sortKey && <button className={ status.sorts[i.sortKey]===undefined ? '' : 'active' } onClick={ onSort(i.sortKey) }>{ !!status.sorts[i.sortKey] ? SortUp : SortDown }</button> }</div></th> )
							) : (
								header ? header : null
							) }
						</thead>
						{ rows && render ? ( <tbody>{ rows.map((i, k) => render(i, k, currentPage)) }</tbody> ) : null }
					</table>
				)}
			</div>
			{ pages && total > 1 ? (
				<div className="pagination">
					<div className={`item` + (currentPage > 0 ? '' : ' disabled')} onClick={() => currentPage > 0 && onPage(currentPage - 1)}>
						Prev
					</div>
					{ pages.slice(currentPage - currentPage % pageLimit, currentPage - currentPage % pageLimit + pageLimit) .map(k => (
						<div key={k} className={`item ${currentPage === k ? 'active' : ''}`} onClick={() => onPage(k)}>
							{k + 1}
						</div>
					)) }
					<div className={`item` + ((currentPage < total - 1) ? '' : ' disabled')} onClick={ () => (currentPage < total - 1) && onPage(currentPage + 1) }>
						Next
					</div>
				</div>
			) : null }
		</div>
	)
}

export default Table2
