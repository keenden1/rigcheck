import { NextResponse } from 'next/server';

type Result = { title?: string; price?: string; extracted_price?: number; product_link?: string; link?: string; thumbnail?: string; serpapi_thumbnail?: string; second_hand_condition?: string };
const minimum:Record<string,number>={Motherboard:1000,CPU:1000,RAM:300,Storage:300,Casing:300,Monitor:1000};
const accessory=/\b(for|compatible|cover|case|shield|sticker|heatsink|adapter|cable|bracket|manual|backplate|io shield)\b/i;
const json = (body: object, status = 200) => NextResponse.json(body, { status });

export async function GET() {
 const key=process.env.SERPAPI_API_KEY;
 if(!key)return json({error:'SerpApi key is not configured.'},503);
 try {
  const url=new URL('https://serpapi.com/account.json');url.searchParams.set('api_key',key);
  const response=await fetch(url,{cache:'no-store'});
  if(!response.ok)return json({error:'Could not check SerpApi balance.'},502);
  const account=await response.json();
  return json({remaining:account.plan_searches_left,monthly:account.searches_per_month,renewal:account.plan_renewal_date,free:account.plan_monthly_price===0});
 }catch{return json({error:'Could not reach SerpApi.'},502);}
}

export async function POST(request: Request) {
 const key = process.env.SERPAPI_API_KEY;
 if (!key) return json({ error: 'Add SERPAPI_API_KEY to .env.local and restart the server.' }, 503);
 let name: string, category: string;
 try { const input = await request.json(); name = input.name; category = input.category; } catch { return json({ error: 'Invalid request.' }, 400); }
 if (typeof name !== 'string' || name.trim().length < 8 || name.length > 120) return json({ error: 'Enter a specific model name before refreshing.' }, 400);
 if(!(category in minimum))return json({error:'Invalid item category.'},400);
 try {
  const accountUrl = new URL('https://serpapi.com/account.json'); accountUrl.searchParams.set('api_key', key);
  const accountResponse = await fetch(accountUrl, { cache: 'no-store' });
  if (!accountResponse.ok) return json({ error: 'Could not check SerpApi plan balance. No search was made.' }, 502);
  const account = await accountResponse.json();
  // Spend only searches included in the plan; never consume extra credits.
  if (account.plan_monthly_price !== 0) return json({ error: 'Price refresh is limited to a free SerpApi plan. No search was made.' }, 403);
  if (!Number.isFinite(account.plan_searches_left) || account.plan_searches_left < 2) return json({ error: 'Monthly plan searches are nearly exhausted. No search was made.' }, 429);
  const url = new URL('https://serpapi.com/search.json');
  url.searchParams.set('engine', 'google_shopping'); url.searchParams.set('q', name.trim()); url.searchParams.set('gl', 'ph'); url.searchParams.set('hl', 'en'); url.searchParams.set('api_key', key);
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) return json({ error: 'Shopping search failed.' }, 502);
  const data = await response.json();
  if (data.error) return json({ error: 'Shopping search failed.' }, 502);
  const terms = name.toLowerCase().match(/[a-z0-9]+/g)?.filter((s:string)=>s.length>=3) ?? [];
  const matches = ((data.shopping_results ?? []) as Result[]).filter(r=>{
   const title=(r.title??'').toLowerCase();
   return terms.every((term:string)=>title.includes(term)) && (category==='Casing'||!accessory.test(title)) && Number.isFinite(r.extracted_price) && r.extracted_price! >= minimum[category] && /₱|PHP/i.test(r.price??'') && !!(r.product_link||r.link);
  });
  const map = (r:Result|undefined) => r ? { price:r.extracted_price, source:r.product_link??r.link, checked:new Date().toISOString().slice(0,10), title:r.title, image:r.thumbnail?.startsWith('https://')?r.thumbnail:r.serpapi_thumbnail?.startsWith('https://')?r.serpapi_thumbnail:undefined } : null;
  const used=matches.filter(r=>!!r.second_hand_condition || /\b(used|second hand|pre-owned|refurbished)\b/i.test(r.title??'')).sort((a,b)=>a.extracted_price!-b.extracted_price!)[0];
  const retail=matches.filter(r=>!r.second_hand_condition && !/\b(used|second hand|pre-owned|refurbished)\b/i.test(r.title??'')).sort((a,b)=>a.extracted_price!-b.extracted_price!)[0];
  return json({ retail:map(retail), used:map(used), searchesLeft:account.plan_searches_left-1 });
 } catch { return json({ error: 'Could not reach SerpApi. No further searches were made.' }, 502); }
}
