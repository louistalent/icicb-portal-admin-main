import React from 'react'

import Table, { TableStatus } from '../components/Table'
/* import customerList from '../assets/JsonData/transactions.json'
import Badge from '../components/Badge' */
import Icons from '../assets/Icons'
import useStore, {D, NF, now, request, TF} from '../useStore'
import Table2, { TableSortType } from '../components/Table2'

const icons = {
	icicb:	<Icons.ICICB width={20} height={20}/>,
	eth:	<Icons.ETH  width={20} height={20}/>,
	usdt:	<Icons.USDT  width={20} height={20}/>,
	btc:	<Icons.BTC  width={20} height={20}/>,
	bnb:	<Icons.BNB  width={20} height={20}/>,
	ltc:	<Icons.LTC  width={20} height={20}/>
} as {[key:string]:JSX.Element}
const orderStatus = {
	"shipping": "primary",
	"pending": "warning",
	"paid": "success",
	"refund": "danger"
}

const Transactions = () => {
	const {user, transactions, update, updated, getError, total} = useStore()
	const [ status, setStatus ] = React.useState<{
		limit:		number
		count:		number
		data: 		AdminTxType[]
		edit: 		number|null
	}>({
		limit:		10,
		count:		0,
		data: 		[],
		edit:		null
	})
	
	const onRequest = async ( page:number, query?:string, sort?:TableSortType ) => {
		if (user !== null) {
			update({loading:true})
			const response = await request("/get-txs", { query, page, limit:status.limit, count: query ? 0 : status.count, sort }, { 'x-admin-token': user?.token })
			if ( response && response.result) {
				setStatus({ ...status, count:response.result.count, data:response.result.data })
			}
			update({loading:false})
		}
	}

	React.useEffect(()=>{
		onRequest(0)
	}, [])

	/* const onQuery = ( query:string ) => onRequest(0, query)


	const onRequest = async (page:number, limit:number, count:number):Promise<TableStatus> => {
		const data = []
		if (user !== null) {
			const response = await request("/get-txs", { page, limit, count }, { 'x-admin-token': user?.token })
			if ( response && response.result ) {
				update({ transactions:response.result })
				return {page, limit, count:response.result.count, data:response.result.data}
			}
		}
		return {page, limit, count, data}
	} */
	return (
		<div>
			<h2 className="page-header">
				Transactions
			</h2>
			<div className="row">
				<div className="col-12">
					<div className="card">
						<div className="card__body">
							<Table2
								limit={ status.limit }
								headers={[
									{ label:'Created', 	css:'left'},
									{ label:'Username', css:'left'},
									{ label:'Address', 	css:'left'},
									{ label:'Amount', 	css:'right'},
								]}
								count={status.count}
								data={status.data}
								onRequest={onRequest}
								render={(i:AdminTxType, k) => (
									<tr key={k}>
										<td className='left'>{TF(i.created)}</td>
										<td className='left'>{i.username}</td>
										<td className='left'>{i.address}</td>
										<td className='right'>{i.amount} <code>{i.coin.toUpperCase()}</code></td>
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

export default Transactions
