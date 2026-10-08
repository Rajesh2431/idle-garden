export default function HintToast({text}:{text:string}){return text?<div className="hint-toast" role="status">{text}</div>:null}
