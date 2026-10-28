import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const option=(key,fallback)=>{const i=process.argv.indexOf(key);return i<0?fallback:process.argv[i+1];};
const cdp=option('--cdp','http://127.0.0.1:9225'),url=option('--url','http://127.0.0.1:8766/'),output=option('--output','/tmp/portfolio-demo-review');
const target=await(await fetch(cdp+'/json/new?'+encodeURIComponent('about:blank'),{method:'PUT'})).json();
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});
let id=0;const pending=new Map(),errors=[],network=[],checks=[];
ws.onmessage=({data})=>{const m=JSON.parse(data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.j(m.error):p.r(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);if(m.method==='Network.requestWillBeSent')network.push(m.params.request.url);};
const send=(method,params={})=>new Promise((r,j)=>{pending.set(++id,{r,j});ws.send(JSON.stringify({id,method,params}));});
const ev=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
const check=(name,ok)=>{assert(ok,name);checks.push(name);};
const click=s=>ev(`document.querySelector(${JSON.stringify(s)}).click()`);
const ready=()=>ev(`new Promise(r=>document.readyState==='complete'?r():addEventListener('load',r,{once:true}))`);
const key=async(name,code)=>{await send('Input.dispatchKeyEvent',{type:'keyDown',key:name,code:name,windowsVirtualKeyCode:code,...(name==='Enter'?{text:'\r'}:{})});await send('Input.dispatchKeyEvent',{type:'keyUp',key:name,code:name,windowsVirtualKeyCode:code});};
await send('Page.enable');await send('Runtime.enable');await send('Network.enable');await send('Page.navigate',{url});await ready();await mkdir(output,{recursive:true});
check('Title and prominent demo status',await ev(`document.title.includes('Portfolio demo')&&document.querySelector('header').innerText.includes('Not for treatment decisions')`));
check('Clean first load',await ev(`!phase&&selected.size===0&&read.size===0&&!document.querySelector('#confetti').children.length`));
check('Fictional data immutable',await ev(`Object.isFrozen(demo.phases)&&Object.isFrozen(demo.medications.follistim.steps)`));
for(const width of [320,390,768,1280]){
 await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<600});await ev(`goHome();window.scrollTo(0,0)`);
 check('Home fits '+width,await ev(`document.documentElement.scrollWidth<=innerWidth`));
 if(width===390||width===1280){const m=await send('Page.getLayoutMetrics'),s=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width,height:m.cssContentSize.height,scale:1}});await writeFile(output+'/home-'+width+'.png',Buffer.from(s.data,'base64'));}
 for(const phaseId of ['example-a','example-b']){
  await click('[data-phase="'+phaseId+'"]');
  check(phaseId+' supply grid '+width,await ev(`document.querySelectorAll('.supply').length===(phase.medications.length===3?9:8)`));
  await click('[data-item="pen"]');check('Namespaced optional selection '+phaseId+width,await ev(`selected.size===1&&[...selected][0].startsWith('fertility-portfolio-demo-v1:')`));
  await click('#next');const count=await ev(`phase.medications.length`);
  for(let med=1;med<=count;med++){
   const length=await ev(`steps().length`);
   for(let i=0;i<length;i++){
    check(`${phaseId}/${med}/${i}/${width} readable`,await ev(`!transition&&section===${med}&&positions[section]===${i}&&document.documentElement.scrollWidth<=innerWidth&&document.querySelector('.plan').innerText.includes('[Prescribed dose]')&&document.querySelector('.med-position-list [aria-current=step]').textContent.includes('(current)')`));
    check('No automatic reading check '+phaseId+med+i+width,await ev(`!document.querySelector('#read-check').checked`));
    if(i===0){await click('#read-check');await click('#next');await click('#back');check('Back keeps check without celebration '+phaseId+med+width,await ev(`document.querySelector('#read-check').checked&&!document.querySelector('#confetti').children.length`));await click('#read-check');}
    if(i<length-1)await click('#next');
   }
   if(med<count){
    await click('#next');check('Boundary '+phaseId+med+width,await ev(`transition&&document.querySelector('#next').textContent.startsWith('Start ')&&panel.innerText.includes('does not record an injection')&&document.querySelector('#read-label').hidden&&document.documentElement.scrollWidth<=innerWidth`));
    if(phaseId==='example-b'&&med===1&&(width===390||width===1280)){await new Promise(r=>setTimeout(r,1400));await ev(`window.scrollTo(0,0)`);const m=await send('Page.getLayoutMetrics'),s=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width,height:m.cssContentSize.height,scale:1}});await writeFile(output+'/transition-'+width+'.png',Buffer.from(s.data,'base64'));}
    const n=await ev('cheerIndex');await click('#next');check('Start does not double celebration '+phaseId+med+width,await ev(`!transition&&cheerIndex===${n}&&!document.querySelector('#confetti').children.length`));await click('#back');check('Back restores boundary '+phaseId+med+width,await ev('transition'));await click('#next');
   }else{check('End is reading-only '+phaseId+width,await ev(`panel.innerText.includes('does not confirm an injection')`));await click('#next');check('End returns to clean home '+phaseId+width,await ev(`!phase&&!transition&&read.size===0&&selected.size===0`));}
  }
 }
}
await click('[data-phase="example-b"]');await ev(`document.querySelector('#next').focus()`);await key('Enter',13);check('Keyboard Enter starts guide',await ev('section===1'));
await ev(`document.querySelector('#tab-1').focus()`);await key('ArrowRight',39);check('Arrow key moves tab and focus',await ev(`section===2&&document.activeElement.id==='tab-2'`));
await click('#help-open');check('About modal focus',await ev(`document.querySelector('#help').open&&document.activeElement.id==='help-close'`));for(let i=0;i<8;i++)await key('Tab',9);check('Modal focus contained',await ev(`document.querySelector('#help').contains(document.activeElement)`));await key('Escape',27);await new Promise(r=>setTimeout(r,100));check('Escape restores focus',await ev(`!document.querySelector('#help').open&&document.activeElement.id==='help-open'`));
await click('#reset');await click('#next');check('Confetti has 24 particles and no pointer blocking',await ev(`document.querySelector('#confetti').children.length===24&&getComputedStyle(document.querySelector('#confetti')).pointerEvents==='none'`));
await click('#next');check('Rapid progression replaces confetti',await ev(`document.querySelector('#confetti').children.length===24`));await new Promise(r=>setTimeout(r,1450));check('Confetti cleans up',await ev(`!document.querySelector('#confetti').children.length`));
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await click('#next');check('Reduced motion retains text only',await ev(`!document.querySelector('#confetti').children.length&&!!document.querySelector('#encouragement').textContent`));
await ev(`localStorage.setItem('unrelated-progress-fixture','do-not-read');sessionStorage.setItem('unrelated-session-fixture','do-not-read')`);await send('Page.reload',{ignoreCache:true});await ready();check('Reload ignores unrelated saved state',await ev(`!phase&&read.size===0&&selected.size===0&&localStorage.length===1&&sessionStorage.length===1`));await ev(`localStorage.removeItem('unrelated-progress-fixture');sessionStorage.removeItem('unrelated-session-fixture')`);
await click('[data-phase="example-a"]');await click('[data-item="pen"]');await click('#all-phases');await click('[data-phase="example-b"]');check('Phase switching clears selections',await ev(`selected.size===0&&read.size===0`));
for(const width of [390,1280]){await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<600});await click('#tab-1');await ev(`positions[1]=0;render();window.scrollTo(0,0)`);const m=await send('Page.getLayoutMetrics'),s=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width,height:m.cssContentSize.height,scale:1}});await writeFile(output+'/card-'+width+'.png',Buffer.from(s.data,'base64'));}
for(const path of ['example-plan.json','.git/config','README.md','assets/illustrations.json','tests/privacy.py'])check('No source exposure '+path,(await fetch(url+path)).status===404);
check('No runtime errors',errors.length===0);check('No external requests',network.every(u=>u.startsWith(url)||u.startsWith('data:')));await ev(`goHome();window.scrollTo(0,0)`);
await writeFile(output+'/results.json',JSON.stringify({passed:checks.length,checks,errors,externalRequests:network.filter(u=>!u.startsWith(url)&&!u.startsWith('data:'))},null,2));console.log(JSON.stringify({passed:checks.length,errors,output}));ws.close();
