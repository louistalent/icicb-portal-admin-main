import React from 'react'; 
import { useFileDrop } from "use-file-drop";
import useStore, {NF, now, request, TF, wait} from '../useStore'
import './uploaddialog.scss';

interface UploadDialogProps {
	type:string
	cbData:Function
}

interface FileStatus {	
	filename:string
	errmsg:string
	success:boolean
	data:string
}

const UploadDialog = ({type, cbData}:UploadDialogProps) => {
	const { getError } = useStore()
	const [status, setStatus] = React.useState<FileStatus>({
		filename:'',
		errmsg:'',
		success:false,
		data:'',
	})
	const updateStatus = (params:{[key:string]:string|number|boolean}) => setStatus({...status, ...params});
	
	const refFile = React.useRef<HTMLInputElement>(null);
	/* const refModal = React.useRef<HTMLInputElement>(null); */
	const refForm = React.useRef<HTMLFormElement>(null);

	const onDrop = (files) => {
		handleFiles(files);
	}
	const [canDrop, dropRef] = useFileDrop({
		drop:onDrop
	});
	const handleFiles = async (files) => {
		updateStatus({success:false, errmsg:''});
		try {
			if (files && files.length) {
				const file= files[0];
				const buf = await new Promise(resolve=>{
					var reader = new FileReader();
					reader.onload = async (e)=>{    
						resolve(e.target?.result?.toString());
					}
					reader.onerror = ()=>{
						resolve(null)
					}
					reader.readAsText(file);
				})
				if (buf===null) {
					updateStatus({success:false, errmsg:getError(10005)});
				} else {
					updateStatus({success:false, filename:file.name, data:String(buf), errmsg:''});
				}
			}
		} catch (error) {
			updateStatus({success:false, errmsg:'error'});
		}
	}

	const submit = async () => {
		updateStatus({success:false, errmsg:''})
		if(status.errmsg){
			return;
		} else {
			if(status.data) {
				const result = await cbData(status.data)
				if (typeof result==="string") {
					updateStatus({success:false, errmsg:result})
				} else if (result===true) {
					updateStatus({success:true})
				} else {
					updateStatus({success:false, errmsg:result})
				}
			} else {
				updateStatus({success:false, errmsg:getError(10006)})
			}
		}
		refForm.current?.reset();
	}

	
	const onDownload = (type:string) => {
		const template = {
			wallet:[
				{chain:"evm", address:"0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"},
				{chain:"evm", address:"0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"},
				{chain:"evm", address:"0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"},
				{chain:"evm", address:"0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"},
				{chain:"ltc", address:"Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"},
				{chain:"ltc", address:"Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"},
	
				{chain:"btc", address:"3xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"},
				{chain:"btc", address:"3xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"},
				{chain:"btc", address:"3xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"},
				{chain:"btc", address:"3xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"},
				{chain:"btc", address:"3xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"},
				{chain:"btc", address:"3xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}
			].map(i=>i.chain + ',' + i.address).join('\r\n'),
			presale:[
				{code:"icvip-xxxxxxxxxxxxxxxxxxxxxxxxxx"},
				{code:"icvip-xxxxxxxxxxxxxxxxxxxxxxxxxx"},
				{code:"icvip-xxxxxxxxxxxxxxxxxxxxxxxxxx"},
				{code:"icvip-xxxxxxxxxxxxxxxxxxxxxxxxxx"},
				{code:"icvip-xxxxxxxxxxxxxxxxxxxxxxxxxx"},
				{code:"icvip-xxxxxxxxxxxxxxxxxxxxxxxxxx"},
				{code:"icvip-xxxxxxxxxxxxxxxxxxxxxxxxxx"},
				{code:"icvip-xxxxxxxxxxxxxxxxxxxxxxxxxx"}
			].map(i=>i.code).join('\r\n'),
			voucher:[
				{code:"icicb-xxxxxxxxxxxxxxxxxxxxxxxxxx", amount:"1000000"},
				{code:"icicb-xxxxxxxxxxxxxxxxxxxxxxxxxx", amount:"1000000"},
				{code:"icicb-xxxxxxxxxxxxxxxxxxxxxxxxxx", amount:"500000"},
				{code:"icicb-xxxxxxxxxxxxxxxxxxxxxxxxxx", amount:"500000"},
				{code:"icicb-xxxxxxxxxxxxxxxxxxxxxxxxxx", amount:"100000"},
				{code:"icicb-xxxxxxxxxxxxxxxxxxxxxxxxxx", amount:"500000"},
				{code:"icicb-xxxxxxxxxxxxxxxxxxxxxxxxxx", amount:"10000"},
				{code:"icicb-xxxxxxxxxxxxxxxxxxxxxxxxxx", amount:"10000"}
			].map(i=>i.code + ',' + i.amount).join('\r\n')
		}

		const link = document.createElement('a')
		link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(template[type]));
  		link.setAttribute('download', `wallet-${type}.csv`);
		link.style.display = 'none';
  		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	/* React.useEffect(()=>{
		updateStatus({errmsg:emsg});
	}, [emsg]) */

	return (
		<div className="card full-height">
			<h2>Import</h2>
			<a className='download-link'  onClick={()=>onDownload(type)}>Click here to download {type==='wallet'?'wallet address':type+'code'} template file</a>
			<div ref={dropRef}  className="drop-file-panel" onClick={()=>{refFile.current?.click()}}>
				<form ref={refForm}>
					<input ref={refFile} type="file" accept=".csv" onChange={(e) => {handleFiles(e.target.files)}} hidden/>
				</form>
				<p className="text-center" style={{color:'rgb(102 102 102)'}}>Click or drag file here</p>  
				<p className="text-center" style={{fontSize:'1.2em', color:'#eee'}}><b>{status.filename}</b></p>
			</div>
			{ status.errmsg ? (
				<p style={{color:'var(--main-color-red)', padding:20, border:'1px solid var(--main-color-orange)'}}>{status.errmsg}</p>
			):null }
			{ status.success ? (
				<p style={{color:'var(--main-color-green)', padding:20, border:'1px solid var(--second-color-green)'}}>The file has been successfully uploaded.</p>
			):null }
			
			<div style={{textAlign:'center'}}>
				<button className='btn upload' onClick={()=>submit()}><i className='bx bx-upload'></i> Submit</button>
			</div>
		</div>
	)
}

export default UploadDialog;