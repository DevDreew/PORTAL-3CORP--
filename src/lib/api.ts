import {validateStore} from './model';
export async function request<T>(path:string,method='GET',body?:unknown,key?:string):Promise<T>{
 const headers:Record<string,string>={'Accept':'application/json'};if(body!==undefined)headers['Content-Type']='application/json';if(key)headers['Idempotency-Key']=key;
 let res:Response;try{res=await fetch('/api/bridge/'+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body),cache:'no-store',signal:AbortSignal.timeout(25000)})}catch{throw Error('Falha de conexão com a API. Nenhuma confirmacao de envio foi recebida; atualize antes de tentar novamente.')}
 const text=await res.text();let data;try{data=text?JSON.parse(text):null}catch{throw Error('Resposta inválida da API.')}
 if(!res.ok)throw Error(typeof data?.detail==='string'?data.detail:'Erro da API ('+res.status+').');return data as T;
}
export async function bootstrap(){const data=await request<unknown>('portal/bootstrap');validateStore(data);return data;}
