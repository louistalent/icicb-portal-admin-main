import React from 'react'
import StatusCard from '../components/StatusCard'
import UploadDialog from '../components/Upload'
import Table from '../components/Table'
import useStore, {now, request, TF, wait} from '../useStore'
import Logo from '../assets/ICICB.svg'
import './generate.scss'
interface WalletStatus {
	errmsg: 	string,
	error: 		string,
	showImport: boolean
	generating: boolean
}

const loadExternal = (url) => {
	return new Promise(resolve=>{
		const script = document.createElement("script");
		script.src = url
		script.async = true;
		script.onload = resolve;
		document.body.appendChild(script);
	})
}

const Wallets = () => {
	const { user, wallet, update, updated, getError } = useStore()
    const updateStatus = (params: {[key: string]: string|number|boolean}) => setStatus({...status, ...params});
	const [status, setStatus] = React.useState<WalletStatus>({
		errmsg: '',
		error: '',
		showImport: false,
		generating: false
	})
	const [addrs, setAddrs] = React.useState<Array<[string,string,string]>>([])
	const [progress, setProgress] = React.useState(0)
	const [page, setPage] = React.useState(0)

	const getTotal = async () => {
		const response = await request("/get-wallets-total", {}, { 'x-admin-token': user?.token })
		if (response !== null && response.result) {
			update({ wallet:response.result, updated:now() })
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
	const handleFiles = async (text: string) => {
		if (typeof text==='string') {
			const rows = text.split(/\r\n|\r|\n/g)
			let dups = Array<string>();
			for (let i of rows) {
				if (i) {
					const x=i.split(",");
					if (x.length===2) {
						const [chain, address]=x;
						if (chain && address) {
							if(dups[[chain, address].join('-')]===undefined){
								dups[[chain, address].join('-')]={chain, address}
							}
						} else {
							return getError(10003)
						}
					}
				}
			}
			if (Object.keys(dups).length) {
				update({loading: true});
				const result = await request("/import-wallets",  {data:Object.values(dups)}, { 'x-admin-token': user?.token });
				update({loading: false});
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
				return getError(10007)
			}
		} else {
			return getError(10005)
		}
	}
	/* const handleFiles = async (text: string) => {
		update({loading: true});
		if (typeof text==='string') {
			const rows = text.split(/\r\n|\r|\n/g)
			const dups = {} as {[key:string]:{chain:string, address:string}}
			for (let i of rows) {
				const x=i.split(",");
				if (x.length===2) {
					const [chain, address]=x;
					if (!chain || !address) { 
						updateStatus({errmsg: 'File invalid'}); 
						return update({loading:false});
					}
					if(dups[[chain, address].join('-')]===undefined){
						dups[[chain, address].join('-')]={chain, address}
					}
				}
			}
			const data = Object.values(dups)
			if (data.length) {
				const result = await request("/import-wallets",  {data});
				if (result !== null) {
					if(result.error !== undefined) {  
						updateStatus({errmsg: getError(result.error)})
					}else{
						if(result.result === true){
							updateStatus({errmsg: ''})
						}
					}
				}else{
					updateStatus({errmsg: getError(0)});
				}
			} else {
				updateStatus({errmsg: 'Not found valid records, If it has private key field, first, remove all private keys, try again, please.'});
			}
			update({loading: false});
		} else {
			updateStatus({errmsg: 'it occurred error in reading file'});
			update({loading: false});
		}
	} */

	const generate = async(count: number) => {
		if (status.generating) return;
		updateStatus({generating:true})
		try {
			const limit = 10
			const ws = [] as Array<[string,string,string]>
			setProgress(0)
			if (!('bitgo' in window)) await loadExternal('/bitgo.min.js')
			if (!('ethers' in window)) await loadExternal('/ethers.5.5.3.umd.min.js')
			const { bitgo, ethers } = window
			for ( let i=0;i< count; i++ ) {
				const keyPair = bitgo.ECPair.makeRandom(bitgo.networks.bitcoin);
				const privkey = keyPair.toWIF();
				const pubKey = keyPair.getPublicKeyBuffer();
				const witnessScript = bitgo.script.witnessPubKeyHash.output.encode(bitgo.crypto.hash160(pubKey));
				const scriptPubKey = bitgo.script.scriptHash.output.encode(bitgo.crypto.hash160(witnessScript));
				const address = bitgo.address.fromOutputScript(scriptPubKey, bitgo.networks.bitcoin);
				ws.push(['btc', address, privkey])
				const keyLite = new bitgo.ECPair(keyPair.d, null, {network:bitgo.networks.litecoin})
				const addrLite = keyLite.getAddress();
				const privLite = keyPair.toWIF();
				ws.push(['ltc', addrLite, privLite])
				const privEther = '0x' + keyPair.d.toHex()
				const wallet = new ethers.Wallet(privEther)
				ws.push(['evm', wallet.address, privEther])
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
		link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(addrs.map(i=>i.join(',')).join('\r\n')))
  		link.setAttribute('download', `wallets-${new Date().getTime()}.csv`);
		link.style.display = 'none';
  		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
   
	return (
		<div>
			<h2 className="page-header">
				Wallet Management
			</h2>
			<div className="row">
				<div className="col-4 col-md-12">
					<div className="col-12">
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
						<UploadDialog type="wallet" cbData={handleFiles} />
					</div>
				</div>
				<div className="col-8 col-md-12">
					<div className="card">
						<div className="card__body">
							<div style={{fontSize:'1.3em'}}>
								Generate wallet address <code>(On Frontend)</code>
							</div>
							<div style={{ display:'flex', justifyContent:'flex-end', marginTop:10, marginBottom:10 }}>
								<button className='btn ml' onClick={()=>{generate(100)}}>100</button>
								<button className='btn ml' onClick={()=>{generate(1000)}}>1000</button>
								<button className='btn ml' onClick={()=>{generate(10000)}}>10000</button>
								<button onClick={download} className='btn ml' disabled={addrs.length===0}><i className='bx bx-download'></i> DOWNLOAD</button>								
							</div>
							{ status.generating ? (
								<div>
									<div style={{ background: '#29d', height: 2, width: (progress * 100) + '%', transition: `width ${10}ms linear` }}></div>
								</div>
							): null }
							
							<Table
								limit={10}
								header={
									<tr>{[
											{ label:''},
											{ label:'Address', 		css:'left' },
											{ label:'Private Key', 	css:'center' },
										].map((i, k) => <th key={k} className={i.css || ''}>{i.label}</th>)
									}</tr>
								}
								style={{minHeight:600}}
								count={addrs.length}
								page={page}
								data={addrs}
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
								render={(i:[string,string,string], k, page) => (
									<tr key={k}>
										<td className='center'><code>{ page * 10 + k + 1 }</code></td>
										<td className='left'><code>{i[0].toUpperCase()}: {i[1]}</code></td>
										<td className='center'><code>{i[2].slice(0,20) + '...' + i[2].slice(-10)}</code></td>
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

export default Wallets
