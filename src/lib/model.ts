export type Status='WAITING_DOCUMENTS'|'REVIEW_REQUIRED'|'READY_FOR_FINANCE'|'SENT_TO_FINANCE';
export type Supplier={id:string;name:string;legalName:string;cnpj:string;email:string;contact:string;phone:string;senders:string;portal:string;method:string;dueDay:number;sendDay:number;clients:string;companies:string;owner:string;active:boolean};
export type Doc={id:string;name:string;kind:'BOLETO'|'NF'|'OTHER';amount:number|null;dueDate:string|null;companyCnpj:string|null};
export type Event={id:string;at:string;label:string;actor:string};
export type Obligation={id:string;supplierId:string;client:string;company:string;companyCnpj:string;competence:string;dueDate:string;sendDate:string;amount:number;status:Status;documents:Doc[];timeline:Event[]};
export type Dispatch={id:string;obligationId:string;at:string;actor:string;to:string[];cc:string[];supplierSnapshot:Supplier;client:string;company:string;competence:string;dueDate:string;amount:number;documents:Doc[];status:'SIMULATED'|'ACCEPTED'|'DELIVERED'|'FAILED';messageId:string|null};
export type Settings={to:string;cc:string};
export type Store={suppliers:Supplier[];obligations:Obligation[];dispatches:Dispatch[];settings:Settings};
export const labels:Record<Status,string>={WAITING_DOCUMENTS:'Aguardando documentos',REVIEW_REQUIRED:'Revisão necessária',READY_FOR_FINANCE:'Pronto para Financeiro',SENT_TO_FINANCE:'Enviado ao Financeiro'};
export const money=(n:number)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(n);
export const date=(s:string)=>s?s.slice(0,10).split('-').reverse().join('/'):'—';
export const time=(s:string)=>new Date(s).toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo',dateStyle:'short',timeStyle:'short'});
export const uid=()=>crypto.randomUUID();
export const list=(s:string)=>s.split(/[;,\n]/).map(x=>x.trim()).filter(Boolean);
export function validateStore(x:unknown):asserts x is Store{const d=x as Store;if(!d||!Array.isArray(d.suppliers)||!Array.isArray(d.obligations)||!Array.isArray(d.dispatches)||!d.settings||typeof d.settings.to!=='string'||typeof d.settings.cc!=='string')throw Error('Resposta da API fora do contrato. Consulte docs/API.md.');for(const s of d.suppliers){if(typeof s.id!=='string'||typeof s.name!=='string')throw Error('Fornecedor inválido na API.')}for(const o of d.obligations){if(!o.id||!labels[o.status]||!Array.isArray(o.documents)||!Array.isArray(o.timeline)||!Number.isFinite(o.amount))throw Error('Obrigação inválida na API.')}}
export function checks(o:Obligation){const b=o.documents.find(d=>d.kind==='BOLETO'),n=o.documents.find(d=>d.kind==='NF');return {documents:!!b&&!!n,amount:!!b&&!!n&&b.amount!==null&&n.amount!==null&&Math.abs(b.amount-n.amount)<0.005&&Math.abs(b.amount-o.amount)<0.005,due:!!b&&b.dueDate===o.dueDate,cnpj:!!n&&!!o.companyCnpj&&n.companyCnpj===o.companyCnpj};}
export function eligible(o:Obligation){return o.status==='READY_FOR_FINANCE'&&Object.values(checks(o)).every(Boolean)}
