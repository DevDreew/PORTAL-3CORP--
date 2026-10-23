import Portal from '@/components/Portal';
export const dynamic='force-dynamic';
export default function Page(){return <Portal realApi={Boolean(process.env.API_BASE_URL)}/>;}
