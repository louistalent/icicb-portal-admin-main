import React from 'react'
import StatusCard from '../components/StatusCard'
import UploadDialog from '../components/Upload'
import Table from '../components/Table'
import './generate.scss'
import useStore, {NF, now, request, TF, wait} from '../useStore'
import generateCode, { isValidCode } from '../crc32'
import Logo from '../assets/ICICB.svg'

interface VoucherStatus {
	/* errmsg: 	string,
	error: 		string, */
	generating: boolean
}

const Vouchers = () => {
	const { user, voucher, update, updated, getError } = useStore()
	const PREFIX = "icicb"
	const [status, setStatus] = React.useState<VoucherStatus>({
		/* errmsg : '', */
		/* error : '', */
		generating: false
	})
	const [addrs, setAddrs] = React.useState<Array<string>>([])
	const [progress, setProgress] = React.useState(0)
	const [page, setPage] = React.useState(0)
    const updateStatus = (params : {[key : string] : string|number|boolean}) => setStatus({...status, ...params});

	const getTotal = async () => {
		const response = await request("/get-voucher-total", {}, { 'x-admin-token': user?.token })
		if (response !== null && response.result) {
			update({ voucher:response.result, updated:now() })
		}
	}

	React.useEffect(() => {
		if (user !== null) {
			if (updated===0) {
				getTotal()
			} else {
				let timer = setTimeout(getTotal, 10000)
				return () => (timer && clearTimeout(timer))
			}
		}
	})
	
	const handleFiles = async (text : string) => {
		if (typeof text==='string') {
			const rows = text.split(/\r\n|\r|\n/g)
			let dups = {} as {[key:string]:{code:string, amount:number}}
			for (let i of rows) {
				if (i) {
					const x=i.split(",");
					if (x.length===2) {
						const [code, value]=x;
						const amount = Number(value)
						if (code && amount) {
							if (!(isValidCode(PREFIX, code) && !isNaN(amount))) {
								return getError(10003)
							} else {
								if(dups[code]===undefined) dups[code] = {code, amount}
							}
						}
					}
				}
			}

			if (Object.keys(dups).length) {
				update({loading : true});
				const result = await request("/import-voucher-code",  {data:Object.values(dups)}, { 'x-admin-token': user?.token });
				update({loading : false});
				if (result !== null) {
					if(result.error !== undefined) {
						return getError(result.error===1007 ? 10008 : result.error)
					}else{
						await getTotal()
						return result.result
					}
				}else{
					return getError(0)
				}
			} else {
				return getError(10004)
			}
		} else {
			return getError(10005)
		}
	}
	
	const generate = async(count: number) => {
		if (status.generating) return;
		updateStatus({generating:true})
		try {
			const limit = 10
			const ws = [] as Array<string>
			setProgress(0)
			for ( let i=0;i< count; i++ ) {
				const code = generateCode(PREFIX)
				ws.push(code)
				setAddrs(ws)
				setProgress(i / count)
				setPage(Math.ceil(ws.length / limit) - 1)
				await wait(1)
			}
		} catch (error) {
			console.log(error)
		}
		updateStatus({generating:false})
	}
	
	const download = () => {
		const link = document.createElement('a')
		link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(addrs.join('\r\n')))
  		link.setAttribute('download', `voucher-code-${new Date().getTime()}.csv`);
		link.style.display = 'none';
  		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
	
	return (
		<div>
			<h2 className="page-header">
				voucher
			</h2>
			<div className="row">
				<div className="col-4 col-md-12">
					<div className="col-12">
						<StatusCard
							icon="bx bx-gift"
							element={<>
								<p className='cart-title'>Voucher code</p>
								<p className="cart-label">Used: {voucher.used}</p>
								<p className="cart-label">Total: {voucher.total}</p>
							</>}
						/>
						<UploadDialog type="voucher" cbData={handleFiles} />
		
					</div>
				</div>
				<div className="col-8 col-md-12">
					<div className="card">
						<div className="card__body">
						<div style={{fontSize:'1.3em'}}>
								Generate Voucher Code
							</div>
							<div style={{ display:'flex', justifyContent:'flex-end', marginTop:10, marginBottom:10 }}>
								<button className='btn ml' onClick={()=>{generate(100)}}>100</button>
								<button className='btn ml' onClick={()=>{generate(1000)}}>1000</button>
								<button className='btn ml' onClick={()=>{generate(10000)}}>10000</button>
								<button onClick={download} className='btn ml' disabled={addrs.length===0}><i className='bx bx-download'></i> DOWNLOAD</button>								
							</div>
							<Table
								limit={10}
								count={addrs.length}
								page={page}
								data={addrs}
								style={{minHeight:600}}
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
								render={(i:string, k, page) => (
									<tr key={k}>
										<td className='center'><code>{ page * 10 + k + 1 }</code></td>
										<td><code>{ i }</code></td>
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

export default Vouchers
