addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
async function handleRequest(request) {
const url=new URL(request.url)
const asRoute=!url.host.endsWith('workers.dev')
  const ip=request.headers.get("cf-connecting-ip")
  console.log({host:url.host,asRoute});
 const isAllowed=await isIpAllowed(ip);
 if(!isAllowed){
   return new Response(`Ip: ${ip} is not allowed to reach to our server`)
 }
 
   return fetch(request)
 
 return new Response(`${ip} Address is allowed`)
  // return new Response(`request method is ${request.method} and ip is ${ip}`, {
  //   headers: { 'content-type': 'text/plain' },
  // })
}
async function isIpAllowed(ip){
  const REDIS_URL=`https://eu1-deep-newt-35340.upstash.io/sismember/allowed-set/${ip}`
const token=`AYoMASQgNjk1MWJhNTktNWE0NS00NWNhLWExYWEtZjcyZTI2ZGNjMzRlYmQ0MDVlODA3YTQ5NGRkNDhlMTlmNzAxM2M1MWI0Yzk=`
  const response=await fetch(REDIS_URL,{headers:{Authorization:`Bearer ${token}`}})
 const {result}=await response.json()
  return result===1??false;
}