const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const wrap = document.querySelector(".canvas-wrap");
const hint = document.querySelector("#hint");
const swatches = ["#3d3550","#ff6fae","#8e7dff","#57b8a8","#f6b84b","#ee6d62","#6d9eea"];
let color = swatches[0], size = 6, tool = "pen", drawing = false, current = [];
let strokes = [], localHistory = [], stickers = [];
let user = { id: crypto.randomUUID(), name:"Puff", emoji:"🐻" };
let ws;

function resize() {
  const dpr = devicePixelRatio || 1;
  const r = wrap.getBoundingClientRect();
  canvas.width = r.width*dpr; canvas.height = r.height*dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  redraw();
}
addEventListener("resize", resize);

swatches.forEach((c,i)=>{
  const b=document.createElement("button"); b.className="swatch"+(i===0?" active":""); b.style.background=c;
  b.onclick=()=>{color=c;document.querySelectorAll(".swatch").forEach(x=>x.classList.remove("active"));b.classList.add("active");tool="pen";document.querySelectorAll(".tool").forEach(x=>x.classList.remove("active"));document.querySelector('[data-tool="pen"]').classList.add("active")};
  swatchesEl=document.querySelector("#swatches"); swatchesEl.appendChild(b);
});

function point(e){const r=canvas.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top}}
function begin(e){drawing=true;current=[point(e)];canvas.setPointerCapture(e.pointerId);hint.classList.add("hide")}
function move(e){
  const p=point(e);
  if(ws?.readyState===1) ws.send(JSON.stringify({type:"cursor",x:p.x,y:p.y}));
  if(!drawing)return;
  current.push(p); drawLine(current.at(-2),p,color,size,tool==="eraser");
}
function end(){
  if(!drawing)return; drawing=false;
  if(current.length>1){
    const stroke={id:crypto.randomUUID(),userId:user.id,points:current,color,size};
    if(tool==="eraser") stroke.color="#fff";
    strokes.push(stroke); localHistory.push(stroke);
    if(ws?.readyState===1) ws.send(JSON.stringify({type:"stroke",...stroke}));
  }
  current=[];
}
function drawLine(a,b,c,s,erase=false){
  ctx.save();ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle=c;ctx.lineWidth=s;
  if(erase)ctx.globalCompositeOperation="destination-out";
  ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.restore();
}
function redraw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  strokes.forEach(s=>{
    for(let i=1;i<s.points.length;i++)drawLine(s.points[i-1],s.points[i],s.color,s.size,s.color==="#fff");
  });
  stickers.forEach(s=>{ctx.font=`${s.size}px serif`;ctx.fillText(s.emoji,s.x,s.y)});
}
canvas.addEventListener("pointerdown",begin);canvas.addEventListener("pointermove",move);canvas.addEventListener("pointerup",end);canvas.addEventListener("pointercancel",end);

document.querySelectorAll(".tool").forEach(b=>b.onclick=()=>{
  tool=b.dataset.tool;document.querySelectorAll(".tool").forEach(x=>x.classList.remove("active"));b.classList.add("active");
});
document.querySelector("#size").oninput=e=>{size=+e.target.value;document.querySelector("#sizeValue").textContent=size};
document.querySelector("#clear").onclick=()=>{
  strokes=[];stickers=[];localHistory=[];redraw();if(ws?.readyState===1)ws.send(JSON.stringify({type:"clear"}));
};
document.querySelector("#undo").onclick=()=>{
  const last=localHistory.pop();if(!last)return;strokes=strokes.filter(s=>s.id!==last.id);redraw();
};
document.querySelectorAll("[data-sticker]").forEach(b=>b.onclick=()=>{
  const r=canvas.getBoundingClientRect();
  stickers.push({emoji:b.dataset.sticker,x:r.width/2+Math.random()*80-40,y:r.height/2+Math.random()*80-40,size:32});
  redraw();
});
document.querySelector("#export").onclick=()=>{
  const a=document.createElement("a");a.download="cuddle-masterpiece.png";a.href=canvas.toDataURL("image/png");a.click();
};
document.querySelector("#copyRoom").onclick=async()=>{await navigator.clipboard.writeText(location.href);document.querySelector("#copyRoom").textContent="copied!";setTimeout(()=>document.querySelector("#copyRoom").textContent="copy",1200)};

let selectedEmoji="🐻";
document.querySelectorAll("#emojiRow button").forEach((b,i)=>{if(!i)b.classList.add("active");b.onclick=()=>{selectedEmoji=b.textContent;document.querySelectorAll("#emojiRow button").forEach(x=>x.classList.remove("active"));b.classList.add("active")}});
document.querySelector("#enter").onclick=()=>{
  user.name=document.querySelector("#name").value.trim()||"Puff";user.emoji=selectedEmoji;
  document.querySelector("#modal").classList.add("hidden");connect();
};

function connect(){
  const room=new URLSearchParams(location.search).get("room")||"cuddle-room";
  document.querySelector("#roomLabel").textContent=room;
  const proto=location.protocol==="https:"?"wss":"ws";
  ws=new WebSocket(`${proto}://${location.host}`);
  ws.onopen=()=>ws.send(JSON.stringify({type:"join",room,userId:user.id,name:user.name,emoji:user.emoji}));
  ws.onmessage=e=>{
    const m=JSON.parse(e.data);
    if(m.type==="snapshot"){strokes=m.strokes||[];updatePeople(m.cursors||{});redraw()}
    if(m.type==="stroke"){if(!strokes.some(s=>s.id===m.stroke.id))strokes.push(m.stroke);redraw()}
    if(m.type==="clear"){strokes=[];redraw()}
    if(m.type==="presence")updatePeople(m.cursors||{});
  };
}
function updatePeople(cursors){
  const el=document.querySelector("#people");el.innerHTML="";
  Object.values(cursors).forEach(p=>{const d=document.createElement("div");d.className="person";d.textContent=`${p.emoji} ${p.name}`;el.appendChild(d)});
}
resize();
