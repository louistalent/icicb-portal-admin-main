import React from 'react'
import Table, { TableStatus } from '../components/Table'
import './search.scss'
import useStore, { D, NF, request } from '../useStore'
import Logo from '../assets/ICICB.svg'
import Table2 from '../components/Table2'

const UsedWallets = () => {
	const { user, getError, update } = useStore()
	const [ status, setStatus ] = React.useState<{
		limit:		number
		count:		number
		data: 		AdminWalletDetailType[]
		edit?: number
	}>({
		limit:		10,
		count:		0,
		data: 		[]
	})
	const onQuery = (query:string) => onRequest(0, query)
	const onRequest = async ( page:number, query?:string ) => {
		if (user !== null) {
			const response = await request("/get-wallets", { query, page, limit:status.limit, count: query ? 0 : status.count }, { 'x-admin-token': user?.token })
			if ( response) {
				if (response.error) {
					/* showToast(getError(response.error)) */
				} else if ( response.result ) {
					setStatus({ ...status, count:response.result.count, data:response.result.data })
				}
			}
		}
	}

	React.useEffect(()=>{
		onRequest(0)
	}, [])

	return (
		<div>
			<h2 className="page-header">
				Referred Accounts
			</h2>
			<div className="row">
				<input type="text" className='search-input' placeholder='search' onKeyDown={(e)=>e.key==='Enter' && onQuery(e.currentTarget.value)}></input>
			</div>
			<div className="row">
				<div className="col-12">
					<div className="card">
						<div className="card__body">
							<Table2
								limit={status.limit}
								header={<tr>{[
									{ label:'username', 	css:'left' 	},
									{ label:'email', 		css:'left' 	},
									{ label:'balances', 	css:'left' 	},
									{ label:'wallets', 		css:'left' 	}
								].map((i, k) => (
									<th key={k} className={i.css}>{i.label}</th>
								))}</tr>}
								count={status.count}
								data={status.data}
								onRequest={onRequest}
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
								render={(i:AdminWalletDetailType, k) => {
									return (
										<tr key={k}>
											<td className='left'>{ i.username }</td>
											<td className='left'>{ i.email }</td>
											<td className='left'>{ i.balances.length!==0 && i.balances.map(m=><p key={m.k}>{ m.k.toUpperCase() + ' : ' + (m.v.balance + m.v.balance) }</p>) }</td>
											<td className='left'>{ i.wallets.length!==0 && i.wallets.map(m=><p key={m.k}>{ m.k.toUpperCase() + ' : ' + (m.v) }</p>) }</td>
										</tr>
									)
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default UsedWallets