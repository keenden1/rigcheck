import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 300;

export async function GET() {
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)return NextResponse.json({error:'Catalog is not configured.'},{status:503});
 const supabase=createClient(url,key);
 const {data,error}=await supabase.from('catalog').select('items,categories,updated_at').eq('id','main').maybeSingle();
 if(error)return NextResponse.json({error:'Could not load catalog.'},{status:502});
 return NextResponse.json(data??{items:[],categories:[],updated_at:null},{headers:{'Cache-Control':'public, s-maxage=300, stale-while-revalidate=60'}});
}
