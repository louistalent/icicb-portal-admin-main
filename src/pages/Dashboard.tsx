import React from 'react'
import ReactApexChart  from 'react-apexcharts'
import StatusCard from '../components/StatusCard'
import Table from '../components/Table'
import Badge from '../components/Badge'
import Icons from '../assets/Icons'
import useStore, {D, NF, now, request, TF, TimeToString} from '../useStore'
import './dashboard.scss'
import Modal from '../components/Modal'

const icons = {
	icicb:	<Icons.ICICB width={20} height={20}/>,
	eth:	<Icons.ETH   width={20} height={20}/>,
	usdt:	<Icons.USDT  width={20} height={20}/>,
	btc:	<Icons.BTC   width={20} height={20}/>,
	bnb:	<Icons.BNB   width={20} height={20}/>,
	ltc:	<Icons.LTC   width={20} height={20}/>
} as {[key:string]:JSX.Element}



const DialogPrice = ({ icicbPrice, onUpdate, onClose }:{icicbPrice:number,onUpdate:(price:number)=>void, onClose:Function}) => {
	const { user, getError, update } = useStore()
	const [ status, setStatus ] = React.useState({
		price:		'',
		error:		''
	})
	const submit = async () => {
		const price = Number(status.price)
		if (status.price==='' || isNaN(price)) {
			setStatus({...status, error: 'ICICB price: invalid'})
			return
		}
		update({loading:true})

		if (user !== null) {
			const response = await request("/set-icicb", { price }, { 'x-admin-token': user?.token })
			if ( response) {
				if (response.error) {
					setStatus({...status, error:getError(response.error)})
				} else if ( response.result ) {
					onClose()
				}
			}
		}
		update({loading:false})
	}

	return (
		<Modal onClose={()=>onClose()}>
			<div className='form large dlg' >
				<h3 className='mb'>Update ICICB price</h3>
				<div>
					<label>Current Price is <b>{icicbPrice}</b>US$
						<input type="number" value = {status.price} min={icicbPrice} step={0.1} onChange = {e=>setStatus({...status, price: e.target.value})} />
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

const Dashboard = () => {
	const {user, mode, update, updated, total, customerTotal, prices, wallet, deposits, daily, referral, presale, voucher} = useStore()
	const [status, setStatus] = React.useState({
		chartPrice : 'date',
		chart : 'usd',
		showPrice: false
	})
	const updateStatus = (params: {[key: string]: string|number|boolean}) => setStatus({...status, ...params}) 

	const chartData = (total.chart[status.chartPrice] || []) as Array<LogsType>
		
	const getTotal = async () => {
		const response = await request("/get-total", {}, { 'x-admin-token': user?.token })
		if (response !== null && response.result) {
			const { customer, wallet, deposits, daily, prices, presale, referral, voucher, ...total } = response.result
			update({ total, customerTotal:customer, prices, wallet, daily, referral, deposits, presale, voucher, updated:now() })
		}
	}
	React.useEffect(() => {
		if (user !== null) {
			getTotal()
		}
	}, [])
	
	React.useEffect(() => {
		if (user !== null) {
			if (updated===0) {
				getTotal()
			} else {
				let timer = setTimeout(getTotal, 3000)
				return () => (timer && clearTimeout(timer))
			}
		}
	})
	const onUpdatePrice = (icicb:number) => {
		update({prices:{...prices, icicb}})
	}
	return (
		<div>
			<h2 className="page-header">Dashboard</h2>
			<div className="row">
				<div className="col-6 col-md-12">
					<div className="row">
						<div className="col-6 col-sm-12">
							<StatusCard
								icon="bx bx-user-pin"
								element={<>
									<p className='cart-title'>Total customers</p>
									<p className="cart-label">Active: {customerTotal.used}</p>
									<p className="cart-label">Total: {customerTotal.total}</p>
								</>}
							/>
						</div>
						<div className="col-6 col-sm-12">
							<StatusCard
								icon="bx bx-user-voice"
								element={<>
									<p className='cart-title'>Refrral code</p>
									<p className="cart-label">Used: {referral.used}</p>
									<p className="cart-label">Total: {referral.total}</p>
								</>}
							/>
						</div>	
						<div className="col-6 col-sm-12">
							<StatusCard
								icon="bx bx-store-alt"
								element={<>
									<p className='cart-title'>Presale code</p>
									<p className="cart-label">Used: {presale.used}</p>
									<p className="cart-label">Total: {presale.total}</p>
								</>}
							/>
						</div>	
						<div className="col-6 col-sm-12">
							<StatusCard
								icon="bx bx-gift"
								element={<>
									<p className='cart-title'>Voucher code</p>
									<p className="cart-label">Used: {voucher.used}</p>
									<p className="cart-label">Total: {voucher.total}</p>
								</>}
							/>
						</div>
						
						<div className="col-6 col-sm-12">
							<StatusCard
								icon="bx bx-bitcoin"
								element={<>
									<div style={{textAlign:'left'}}>
										<p className='cart-title'>Wallet</p>
										{ Array.isArray(wallet) && wallet.map(i=>(
											<div key={i.chain} style={{display:'flex', justifyContent:'space-between'}}>
												<p>{i.chain.toUpperCase()}</p>
												<p>{i.used} / {i.total}</p>
											</div>
										)) }
									</div>
								</>}
							/>
						</div>
						<div className="col-6 col-sm-12">
							<StatusCard
								icon="bx bx-dollar-circle"
								element={<>
									<div style={{textAlign:'left'}}>
										<p className='cart-title'>Deposit</p>
										{ Array.isArray(deposits) && deposits.map((i, k)=>(
											<div key={k} style={{display:'flex', justifyContent:'space-between', marginTop:(i.coin==='USD' ? 10 : 0)}}>
												<p>{icons[i.coin] || null} {i.coin == 'USD' ? 'Total: ' : i.coin.toUpperCase()}</p>
												<p>{i.balance.toFixed(2)}</p>
											</div>
										)) }
									</div>
								</>}
							/>
						</div>
					</div>
				</div>
				<div className="col-6 col-md-12">
					<div className="card">
						<ReactApexChart
							options={{ 
								chart: { background: 'transparent', },
								dataLabels: { enabled: false },
								stroke: { curve: 'smooth' },
								title: {
									text: 'Recent ICICB prices',
									align: 'left',
									style: { color: 'var(--txt-color)' }
								},  
								xaxis: { labels: { show: false, } },
								yaxis: { labels: { style: { colors: 'var(--txt-color)' } } },
								grid: { show: false }, 
								theme: { mode: mode === 'theme-mode-dark' ? 'dark' : 'light' } 
							}}
							series={[{ data: [...chartData.filter(i=>i.coin==='icicb').map(i=>i.usd), prices.icicb] }]}
							type='area'
							height='100%'
						/>
						<div style={{display:'flex'}}>
							<div style={{ flex:1 }}>
								<button className={`chart-btn ${status.chartPrice==='day'?'active':''}`}   onClick={()=>{updateStatus({chartPrice : 'date'})}}>Day</button>
								<button className={`chart-btn ${status.chartPrice==='week'?'active':''}`}  onClick={()=>{updateStatus({chartPrice : 'week'})}}>Week</button>
								<button className={`chart-btn ${status.chartPrice==='month'?'active':''}`} onClick={()=>{updateStatus({chartPrice : 'month'})}}>Month</button>
							</div>
							<div>
								<button className={`chart-btn`}   onClick={()=>updateStatus({showPrice:true})}>ICICB Price {prices.icicb}US$ - Update</button>
							</div>

						</div>
					</div>
					<div className="card">
						<ReactApexChart
							options={{ 
								chart: { background: 'transparent', },
								dataLabels: { enabled: false },
								stroke: { curve: 'smooth' },
								title: {
									text: 'Daily deposit statistics',
									align: 'left',
									style: { color: 'var(--txt-color)' }
								},  
								xaxis: { labels: { show: true, style: { colors: 'var(--txt-color)' } }, categories:daily[status.chart] ? daily[status.chart].map(i=>TimeToString(i.date)) : [] },
								yaxis: { labels: { style: { colors: 'var(--txt-color)' } } },
								grid: { show: false }, 
								theme: { mode: mode === 'theme-mode-dark' ? 'dark' : 'light' } 
							}}
							series={[{ name: status.chart ? 'Total ' + status.chart.toUpperCase() : '', data: daily[status.chart] ? daily[status.chart].map(i=>Math.round(i.value * 1e2)/1e2) : [] }]}
							type='area'
							height='100%'
						/>
						<div className='row col-12' style={{justifyContent:'center', marginTop:0}}>
							<button className={`chart-btn ${status.chart==='usd'?'active':''}`} onClick={()=>updateStatus({chart : 'usd'})}>USD</button>
							{ Object.keys(icons).map(k=>k!=='icicb' && <button key={k} className={`chart-btn ${status.chart===k?'active':''}`} onClick={()=>updateStatus({chart : k})}>{k.toUpperCase()}</button>) }
						</div>
					</div>
				</div>
				<div className="col-6 col-md-12">
					<div className="card">
						<div className="header">
							<h3>Recent Transactions</h3>
						</div>
						<div className="body">
							<Table
								limit={5}
								header={<tr>{[
									{ label:'Time',	css:'left' },
									{ label:'Username',	css:'left' },
									{ label:'Coin',		css:'left' },
									{ label:'Amount',	css:'left' },
									{ label:'Status',	css:'left' },
								].map((i, k) => <th key={k} className={i.css}>{i.label}</th>)}</tr>}
								data={total.txs}
								render={(i:AdminTxType, k) => (
									<tr key={k}>
										<td>{TF(i.created)}</td>
										<td>{i.username}</td>
										<td style={{display:'flex', alignItems:'center'}}>{icons[i.coin]}<label style={{marginLeft:5}}>{i.coin.toUpperCase()}</label></td>
										<td>{i.amount}</td>
										<td><Badge type={i.confirmed ? 'success' : 'warning'} content={i.confirmed ? 'Paid' : 'Pending'}/></td>
									</tr>
								)}
							/>
						</div>
						<div className="footer">
							<a href='/transactions'>View All</a>
						</div>
					</div>
				</div>
				<div className="col-6 col-md-12">
					<div className="card">
						<div className="header">
							<h3>latest orders</h3>
						</div>
						<div className="body">
							<Table
								limit={5}
								header={<tr>{[
									{ label:"Time", 			css:'left' },
									{ label:"Username", 		css:'left' },
									{ label:"Amount (ICICB)", 	css:'right' },
									{ label:"Status", 			css:'right' },
								].map((i, k) => (
									<th key={k} className={i.css}>{i.label}</th>
								))}</tr>}
								data={total.orders}
								render={(i:AdminOrderType, k:string) => (
									<tr key={k}>
										<td className='left'>{TF(i.created)}</td>
										<td className='left'>{i.username}</td>
										<td className='right'>{i.amount}</td>
										<td className='right'><Badge type={i.txid ? 'success' : 'warning'} content={i.txid ? 'Paid' : 'Pending'}/></td>
									</tr>
								)}
							/>
						</div>
						<div className="footer">
							<a href="/orders">View All</a>
						</div>
					</div>
				</div>
			</div>
			{ status.showPrice && <DialogPrice icicbPrice={prices.icicb} onUpdate={onUpdatePrice} onClose={()=>setStatus({ ...status, showPrice:false })} /> }
		</div>
	)
}

export default Dashboard
