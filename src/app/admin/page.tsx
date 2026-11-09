'use client';
import {useEffect,useState} from 'react';
import {supabase} from '@/lib/supabase';
import PartsWorkspace from '../parts-workspace';
const adminEmail='bautistajimmy.dev@gmail.com';
export default function Admin(){
 const [email,setEmail]=useState(''),[signedIn,setSignedIn]=useState(false),[loading,setLoading]=useState(true),[message,setMessage]=useState('');
 useEffect(()=>{let active=true;if(!supabase){setMessage('Supabase is not configured.');setLoading(false);return;}supabase.auth.getUser().then(({data})=>{if(!active)return;setSignedIn(data.user?.email?.toLowerCase()===adminEmail);setLoading(false);});const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{setSignedIn(session?.user.email?.toLowerCase()===adminEmail);});return()=>{active=false;subscription.unsubscribe();};},[]);
 if(loading)return <main className="admin-login"><p>Checking admin access...</p></main>;
 if(signedIn)return <><div className="admin-top"><span>Admin mode</span><button onClick={()=>void supabase?.auth.signOut()}>Sign out</button><a href="/">View public landing page</a></div><PartsWorkspace/></>;
 return <main className="admin-login"><section><a href="/" className="admin-back">← Public landing page</a><h1>Admin sign in</h1><p>Only the authorized catalog administrator can edit items and categories.</p><form onSubmit={async e=>{e.preventDefault();setMessage('');const {error}=await supabase!.auth.signInWithOtp({email:email.trim(),options:{shouldCreateUser:false,emailRedirectTo:window.location.origin+'/admin'}});setMessage(error?error.message:'Check your email for the sign-in link.');}}><label className="field">Admin email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><button className="primary" type="submit">Email me a sign-in link</button></form>{message&&<p role="status">{message}</p>}</section></main>;
}
