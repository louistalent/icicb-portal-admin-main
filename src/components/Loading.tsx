import React from 'react'; 
import ReactLoading from 'react-loading';

interface LoadingProps {
    type : 'blank'|'balls'|'bars'|'bubbles'|'cubes'|'cylon'|'spin'|'spinningBubbles'|'spokes'
    width : number
    height : number
    color : string
    opacity : number
    show : boolean
}
//  style={{position:'absolute', top:'calc(50vh - '+height/2+'px)', left:'calc(50vw - '+width/2+'px)'}}
const Loading = ({type="blank", width=100, height=100, color="red", opacity=0.5, show=false}:LoadingProps) => {
	return (
        <div style={{display:show ? 'flex' : 'none', position:"fixed", left:0, top:0, right:0, bottom:0, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0, '+opacity+")", zIndex:1111}}>
            <ReactLoading type={type} color={color} height={height} width={width}/>
        </div>
	)
}

export default Loading