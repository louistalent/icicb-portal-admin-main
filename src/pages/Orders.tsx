import React from 'react'
import Table, { TableStatus } from '../components/Table'
import useStore, {D, NF, now, request, TF} from '../useStore'
import Logo from '../assets/ICICB.svg'

const Orders = () => {
	const {user, orders, update, updated, getError, total} = useStore()
	const limit = 10
	const onRequest = async (page:number, limit:number, count:number):Promise<TableStatus> => {
		const data = []
		if (user !== null) {
			const response = await request("/get-orders", { page, limit, count }, { 'x-admin-token': user?.token })
			if ( response && response.result ) {
				update({ customers:response.result })
				return {page, limit, count:response.result.count, data:response.result.data}
			}
		}
		return {page, limit, count, data}
	}
	
	return (
		<div>
			<h2 className="page-header">
			Orders
			</h2>
			<div className="row">
				<div className="col-12">
					<div className="card">
						<div className="card__body">
							<Table
								limit={limit}
								header={<tr>{[
									{ label:'Created', 			css: 'left'},
									{ label:'Username', 		css: 'left'},
									{ label:'Request (ICICB)', 	css: 'right'},
									{ label:'With', 			css: 'right'},
									{ label:'Status', 			css: 'right'},
								].map((i,k)=><th key={k} className={i.css}>{i.label}</th>)}</tr>}
								data={orders.data}
								onRequest={onRequest}
								onLoading={loading=>update({loading})}
								blank={(
									<div style={{opacity:0.2, textAlign:'center'}}>
										<div>
											<img src={Logo} width={200} height={200} />
										</div>
										<div style={{fontSize:30}}>
											No Data
										</div>
									</div>
								)}
								render={(i:AdminOrderType, k) => (
									<tr key={k}>
										<td className='left'>{TF(i.created)}</td>
										<td className='left'>{i.username}</td>
										<td className='right'>{i.amount}</td>
										<td className='right'>{i.coin ? i.quantity + i.coin.toUpperCase() : 'Voucher'}</td>
										<td className='right'>{i.txid ? 'Paid' : 'Pending'}</td>
									</tr>
								)}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Orders
