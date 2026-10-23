import {NextRequest,NextResponse} from 'next/server';
import {timingSafeEqual} from 'node:crypto';
function equal(a:string,b:string){const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y)}
export function proxy(req:NextRequest){
 const user=process.env.PORTAL_USER,pass=process.env.PORTAL_PASSWORD;
 if(process.env.API_BASE_URL&&(!user||!pass))return new NextResponse('Configure PORTAL_USER e PORTAL_PASSWORD no Vercel antes de conectar dados reais.',{status:503});
 if(user&&pass){let valid=false;try{const raw=req.headers.get('authorization')||'';if(raw.startsWith('Basic ')){const decoded=Buffer.from(raw.slice(6),'base64').toString();const i=decoded.indexOf(':');valid=i>=0&&equal(decoded.slice(0,i),user)&&equal(decoded.slice(i+1),pass)}}catch{}if(!valid)return new NextResponse('Acesso restrito',{status:401,headers:{'WWW-Authenticate':'Basic realm="3CORP Finance Operations", charset="UTF-8"','Cache-Control':'no-store'}})}
 return NextResponse.next();
}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico).*)']};
