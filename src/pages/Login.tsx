import React from 'react'; 
import Loading from '../components/Loading';
import '../assets/css/index.scss'
import './login.scss' ;
import logo from '../assets/logo.svg'; 
import useStore, {request, hmac256, validateUsername, validateEmail} from '../useStore';

interface LoginStatus {
	username:  string
	password:  string
	errmsg:  string
}

const Login = () => {
	const {loading, mode, color, getError, update} = useStore();
	const [status, setStatus] = React.useState<LoginStatus>({
		username:  '',
		password:  '',
		errmsg:  ''
	})
	const refUsername = React.useRef<HTMLInputElement>(null)
	const refPassword = React.useRef<HTMLInputElement>(null)
	const updateStatus = (params: {[key: string]: string|number|boolean}) => setStatus({...status, ...params}) 

	const submit = async () => {
		updateStatus({errmsg: ''})
		if (status.username==='') return refUsername?.current?.focus()
		if (validateEmail(status.username) === false && validateUsername(status.username) === false) {
			updateStatus({errmsg: getError(1001)})
			refUsername?.current?.select();
			refUsername?.current?.focus();
			return;
		}
		if (status.password==='') return refPassword?.current?.focus()
		if (status.password.length<6 || status.password.length>32) {
			updateStatus({errmsg: getError(1009)})
			refPassword?.current?.select();
			refPassword?.current?.focus();
			return;
		}
		update({loading:true})
		const password = await hmac256(status.password)
		const result = await request("/login", {username: status.username, password})
		if (result !== null) {
			if(result.error !== undefined) {
				updateStatus({errmsg: getError(result.error, status.username)})
				if(result.error===1004) { refUsername.current?.focus(); refUsername.current?.select(); }
				else {refPassword.current?.focus(); refPassword.current?.select();}
			} else {
				return update({user: result.result as LoginResponseType, loading:false})
			}
		} else {
			updateStatus({errmsg: getError(0)})
		}
		update({loading:false})
	}

	return (
		<div className={`auto ${mode} ${color}`}>
			<div className="card">
				<div style = {{textAlign: "center"}}> 
					<img src = {logo} style = {{maxWidth: 100}} alt="bg" />
				</div>
				<h1 style  = {{textAlign: "center", margin: 20}}>Sign in your account</h1>
				<input ref = {refUsername} type="text" 		value = {status.username} onChange = {e=>setStatus({...status, username: e.target.value})} placeholder="please input your login username" onKeyPress={(event)=>{if(event.key==="Enter"){refPassword.current?.focus(); refPassword.current?.select();}}} autoFocus />
				<input ref = {refPassword} type="password" 	value = {status.password} onChange = {e=>setStatus({...status, password: e.target.value})} placeholder="please input your login password" onKeyPress={(event)=>{if(event.key==="Enter"){submit()}}} />
				<h3 className='error'>{status.errmsg}</h3>
				<div>
					<button onClick = {submit}>
						LOGIN
					</button> 
				</div>
			</div>
			<Loading type="bars" width={100} height={100} color={"#c2ab81"} opacity={0.4} show={!!loading}/>
		</div>
	)
};

export default Login;