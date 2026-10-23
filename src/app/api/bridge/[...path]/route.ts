import {NextRequest,NextResponse} from 'next/server';
export const dynamic='force-dynamic';
const allowed=[/^portal\/bootstrap$/, /^suppliers$/, /^suppliers\/[a-zA-Z0-9_-]+$/, /^obligations$/, /^obligations\/[a-zA-Z0-9_-]+\/send-to-finance$/, /^documents\/[a-zA-Z0-9_-]+\/url$/, /^settings$/, /^health$/];
async function forward(req:NextRequest,ctx:{params:Promise<{path:string[]}>}){
 const {path}=await ctx.params;const route=path.join('/');
 if(req.method!=='GET'){const origin=req.headers.get('origin');if(origin&&origin!==req.nextUrl.origin)return NextResponse.json({detail:'Origem nao autorizada.'},{status:403});if(!req.headers.get('content-type')?.startsWith('application/json'))return NextResponse.json({detail:'Envie application/json.'},{status:415});}
 if(!allowed.some(x=>x.test(route)))return NextResponse.json({detail:'Endpoint nao permitido.'},{status:404});
 const base=process.env.API_BASE_URL;if(!base)return NextResponse.json({detail:'API nao configurada.'},{status:503});
 try{const root=new URL(base);if(root.protocol!=='https:')return NextResponse.json({detail:'API_BASE_URL deve usar HTTPS.'},{status:503});
 const url=new URL(root.toString().replace(/\/$/,'')+'/'+route);url.search=req.nextUrl.search;
 const headers:Record<string,string>={'Accept':'application/json'};if(process.env.API_TOKEN)headers.Authorization='Bearer '+process.env.API_TOKEN;
 const key=req.headers.get('idempotency-key');if(key)headers['Idempotency-Key']=key;
 let body:string|undefined;if(!['GET','HEAD'].includes(req.method)){body=await req.text();if(Buffer.byteLength(body)>1048576)return NextResponse.json({detail:'Corpo muito grande.'},{status:413});headers['Content-Type']='application/json'}
 const res=await fetch(url,{method:req.method,headers,body,cache:'no-store',redirect:'error',signal:AbortSignal.timeout(20000)});
 if(res.status===204)return new NextResponse(null,{status:204});
 const text=await res.text();let data;try{data=JSON.parse(text)}catch{return NextResponse.json({detail:'A API nao retornou JSON valido.'},{status:502})}
 return NextResponse.json(data,{status:res.status,headers:{'Cache-Control':'no-store'}});
 }catch{return NextResponse.json({detail:'Nao foi possivel acessar a API. Verifique a URL, o token e a disponibilidade do backend.'},{status:502})}
}
export const GET=forward;export const POST=forward;export const PATCH=forward;export const PUT=forward;
