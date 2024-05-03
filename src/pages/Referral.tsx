import React from 'react'
import StatusCard from '../components/StatusCard'
import UploadDialog from '../components/Upload'
import Table from '../components/Table'
import './generate.scss'
import useStore, {NF, now, request, TF, wait} from '../useStore'
import generateCode, { isValidCode } from '../crc32'
import Logo from '../assets/ICICB.svg'
interface PresaleStatus {
	/* errmsg: 	string,
	error: 		string,
	showImport: boolean */
	generating: boolean
}


const Referral = () => {
	const { user, referral, update, updated, getError } = useStore()
	const PREFIX = 'icref'
	const [ status, setStatus ] = React.useState<PresaleStatus>({
		/* errmsg : '',
		error : '',
		showImport : false, */
		generating: false
	})

	const [addrs, setAddrs] = React.useState<Array<string>>([])
	const [progress, setProgress] = React.useState(0)
	const [page, setPage] = React.useState(0)

	const getTotal = async () => {
		const response = await request("/get-referral-total", {}, { 'x-admin-token': user?.token })
		if (response !== null && response.result) {
			update({ referral:response.result, updated:now() })
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
			let dups = {} as {[key:string]:boolean};
			for (let i of rows) {
				if (i) {
					const x=i.split(",");
					if (x.length===1) {
						const [code]=x;
						if (code) {
							if (!isValidCode(PREFIX, code)) {
								return getError(10003)
							} else {
								if(dups[code]===undefined) dups[code] = true
							}
						}
					}
				}
			}
			
			if (Object.keys(dups).length) {
				update({loading : true});
				const result = await request("/import-referral-code",  {data:Object.keys(dups)}, { 'x-admin-token': user?.token });
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

	/* const handleFiles = async (text : string) => {
		alert(text);
		update({loading : true});
		if (typeof text==='string') {
			const rows = text.split(/\r\n|\r|\n/g)
			let dups = Array<string>();
			for (let i of rows) {
				const x=i.split(",");
				if (x.length===1) {
					const [code]=x;
					if ((code &&  code.length!=32)) {
						updateStatus({errmsg : 'File invalid'});
						update({loading:false});
						//tips("File invalid");
					} else {
						if(code!==""){
							if(dups.indexOf(code)==-1){
								dups.push(code)
							}
						}
					}
				}
			}
			if (dups.length) {
				const result = await call("/import-referral-code",  {data:dups});
				if (result !== null) {
					if(result.error !== undefined) {  
						updateStatus({errmsg : getError(result.error)})
						//tips(status.errmsg);
					}else{
						if(result.result === true){
							updateStatus({errmsg : '', showImport:false})
							renderPresale()
							//tips("Presale code imported successfully.");
						}
					}
				}else{
					updateStatus({errmsg : getError(0)});
					//tips(status.errmsg);
				}
			} else {
				updateStatus({errmsg : 'not found valid records'});
				//tips("not found valid records");
			}
			update({loading : false});
		} else {
			updateStatus({errmsg : 'it occurred error in reading file'});
			update({loading : false});
			//tips("it occurred error in reading file.");
		}
	} */

    const updateStatus = (params : {[key : string] : string|number|boolean}) => setStatus({...status, ...params});
	
	const generate = async(count: number) => {
		if (status.generating) return;
		updateStatus({generating:true})
		try {
			const limit = 10
			const ws = [] as Array<string>
			setProgress(0)
			for ( let i=0;i< count; i++ ) {
				const code = generateCode("icref")
				if (isValidCode("icref", code)) console.log('valid code ' + code)
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
  		link.setAttribute('download', `referral-code-${new Date().getTime()}.csv`);
		link.style.display = 'none';
  		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
	return (
		<div>
			<h2 className="page-header">
				Referral Code
			</h2>
			<div className="row">
				<div className="col-4 col-md-12">
					<div className="col-12">
						<StatusCard
							icon="bx bx-store-alt"
							element={<>
								<p className='cart-title'>Referral code</p>
								<p className="cart-label">Used: {referral.used}</p>
								<p className="cart-label">Total: {referral.total}</p>
							</>}
						/>
						<UploadDialog type="referral" cbData={handleFiles} />
					</div>
				</div>
				<div className="col-8 col-md-12">
					<div className="card">
						<div className="card__body">
							<div style={{fontSize:'1.3em'}}>
								Generate Referral Code
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
								style={{minHeight:600}}
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

export default Referral
