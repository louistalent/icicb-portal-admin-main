import React from 'react'
import Table, { TableStatus } from '../components/Table'
import './search.scss'
import './customers.scss'
import useStore, {D, NF, now, request, TF} from '../useStore'
import Logo from '../assets/ICICB.svg'
import Table2, { TableSortType } from '../components/Table2'
import Modal from '../components/Modal'

interface BalancesType {
	icicb:		number
	btc:		number
	ltc:		number
	eth:		number
	bnb:		number
	usdt:		number
}

const EditorDialog = ({ index, data, onUpdate, onClose }: { index?:number, data:AdminCustomerType, onUpdate:(index:number, balances:Partial<BalancesType>)=>void, onClose:Function }) => {
	const { user, getError, update } = useStore()
	const [ status, setStatus ] = React.useState({
		icicb:		'',
		btc:		'',
		ltc:		'',
		eth:		'',
		bnb:		'',
		usdt:		'',
		error:		''
	})
	const submit = async () => {
		if (index===undefined) return
		const balances = {} as Partial<BalancesType>
		
		if (status.icicb!=='') {
			balances.icicb	= Number(status.icicb)
			if (isNaN(balances.icicb)) {
				setStatus({...status, error: 'ICICB balance: invalid'})
				return
			}
		}
		if (status.btc!=='') {
			balances.btc	= Number(status.btc)
			if (isNaN(balances.btc)) {
				setStatus({...status, error: 'BTC balance: invalid'})
				return
			}
		}
		if (status.ltc!=='') {
			balances.ltc	= Number(status.ltc)
			if (isNaN(balances.ltc)) {
				setStatus({...status, error: 'LTC balance: invalid'})
				return
			}
		}
		if (status.eth!=='') {
			balances.eth	= Number(status.eth)
			if (isNaN(balances.eth)) {
				setStatus({...status, error: 'ETH balance: invalid'})
				return
			}
		}
		if (status.bnb!=='') {
			balances.bnb	= Number(status.bnb)
			if (isNaN(balances.bnb)) {
				setStatus({...status, error: 'BNB balance: invalid'})
				return
			}
		}
		if (status.usdt!=='') {
			balances.usdt	= Number(status.usdt)
			if (isNaN(balances.usdt)) {
				setStatus({...status, error: 'USDT balance: invalid'})
				return
			}
		}
		if (Object.keys(balances).length===0) {
			setStatus({...status, error: 'None of the balances are still changed.'})
			return
		}
		update({loading:true})

		if (user !== null) {
			const response = await request("/update-balance", { uid:data.id, balances }, { 'x-admin-token': user?.token })
			if ( response) {
				if (response.error) {
					setStatus({...status, error:getError(response.error)})
				} else if ( response.result ) {
					onUpdate(index, balances)
				}
			}
		}
		update({loading:false})
	}

	return (
		<Modal onClose={()=>onClose()}>
			<div className='form large dlg' >
				<h3 className='mb'>Update Account Balance</h3>

				<div style={{marginBottom:'2em'}}>
					{ `${data.username} (${data.email})`}
				</div>
				<div>
					<label><b>ICICB</b> balance (current: {data.icicb})
						<input type="number" value = {status.icicb} onChange = {e=>setStatus({...status, icicb: e.target.value})} />
					</label>
				</div>
				<div>
					<label><b>BTC</b> balance (current: {data.btc})
						<input type="number" value = {status.btc} onChange = {e=>setStatus({...status, btc: e.target.value})} />
					</label>
				</div>
				<div>
					<label><b>LTC</b> balance (current: {data.ltc})
						<input type="number" value = {status.ltc} onChange = {e=>setStatus({...status, ltc: e.target.value})} />
					</label>
				</div>
				<div>
					<label><b>ETH</b> balance (current: {data.eth})
						<input type="number" value = {status.eth} onChange = {e=>setStatus({...status, eth: e.target.value})} />
					</label>
				</div>
				<div>
					<label><b>BNB</b> balance (current: {data.bnb})
						<input type="number" value = {status.bnb} onChange = {e=>setStatus({...status, bnb: e.target.value})} />
					</label>
				</div>
				<div>
					<label><b>USDT</b> balance (current: {data.usdt})
						<input type="number" value = {status.usdt} onChange = {e=>setStatus({...status, usdt: e.target.value})} />
					</label>
				</div>
				<div className='error'>
					{status.error}
				</div>
				<div>
					<button className='btn btn-primary' onClick={()=>submit()}>UPDATE</button>
				</div>
			</div>
		</Modal>
	)
}

const Customers = () => {
	const { user, customers, update, getError } = useStore()
	const [ status, setStatus ] = React.useState<{
		limit:		number
		count:		number
		data: 		AdminCustomerType[]
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
			const response = await request("/get-users", { query, page, limit:status.limit, count: query ? 0 : status.count, sort }, { 'x-admin-token': user?.token })
			if ( response && response.result) {
				setStatus({ ...status, count:response.result.count, data:response.result.data })
			}
			update({loading:false})
		}
	}
	
	const onQuery = ( query:string ) => onRequest(0, query)

	const onUpdate = ( index:number, balances:Partial<BalancesType> ) => {
		setStatus({
			...status,
			edit:null,
			data: [
				...status.data.slice(0, index),
				{ ...status.data[index], ...balances },
				...status.data.slice(index + 1)
			]
		})
	}

	React.useEffect(()=>{
		onRequest(0)
	}, [])

	return (
		<div>
			<h2 className="page-header">
				Customers
			</h2>
			<div className="row">
				<input type="text" className='search-input' placeholder='search' onKeyDown={(e)=>e.key==='Enter' && onQuery(e.currentTarget.value)} />
			</div>
			<div className="row">
				<div className="col-12">
					<div className="card">
						<div className="card__body">
							<Table2
								limit={ status.limit }
								headers={[
									{ label:'Created', 	css:'left',		sortKey:'created' },
									{ label:'Username', css:'left' },
									{ label:'USD', 		css:'right',	sortKey:'usd' },
									{ label:'ICICB', 	css:'right',	sortKey:'icicb' },
									{ label:'BTC', 		css:'right',	sortKey:'btc' },
									{ label:'LTC', 		css:'right',	sortKey:'ltc' },
									{ label:'ETH', 		css:'right',	sortKey:'eth' },
									{ label:'BNB', 		css:'right',	sortKey:'bnb' },
									{ label:'USDT', 	css:'right',	sortKey:'usdt' },
									{ }
								]}
								count={status.count}
								data={status.data}
								onRequest={onRequest}
								blank={(
									<div style={{ opacity:0.2, textAlign:'center' }}>
										<div>
											<img src={Logo} width={200} height={200} />
										</div>
										<div style={{fontSize:30}}>
											No Data
										</div>
									</div>
								)}
								render={(i:AdminCustomerType, k:number) => (
									<tr key={k}>
										<td className='left'>{TF(i.created)}</td>
										<td className='left'>{`${i.username} (${i.email})`}</td>
										<td className='right'>{i.usd ? NF(i.usd, 2) : ''}</td>
										<td className='right'>{i.icicb ? NF(i.icicb, 2) : ''}</td>
										<td className='right'>{i.btc ? 	 NF(i.btc, 8)   : ''}</td>
										<td className='right'>{i.ltc ? 	 NF(i.ltc, 8)   : ''}</td>
										<td className='right'>{i.eth ? 	 NF(i.eth, 6)   : ''}</td>
										<td className='right'>{i.bnb ? 	 NF(i.bnb, 6)   : ''}</td>
										<td className='right'>{i.usdt ?  NF(i.usdt, 2)  : ''}</td>
										<td className='center'>
											<button className='btn' onClick={()=>setStatus({...status, edit:k})}>Update</button>
										</td>
									</tr>
								)}
							/>
						</div>
					</div>
				</div>
			</div>
			{ status.edit!==null && <EditorDialog index={status.edit} data={status.data[status.edit]} onUpdate={onUpdate} onClose={()=>setStatus({...status, edit:null})} />  }
		</div>
	)
}

export default Customers