const EffectCanvas=document.getElementById("effectCanvas");
const ctx=EffectCanvas.getContext("2d");
let particleList=[];
let animId=null;

function resizeCanvas(){
    EffectCanvas.width=window.innerWidth;
    EffectCanvas.height=window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize",resizeCanvas);

//流星雨
export function showMeteorShower(){
    EffectCanvas.classList.remove("hidden");
    particleList=[];
    for(let i=0;i<12;i++){
        particleList.push({
            x:Math.random()*EffectCanvas.width,
            y:Math.random()*EffectCanvas.height*0.4,
            len:Utils.randInt(60,150),
            speed:Utils.randInt(6,12),
            angle:Math.PI*0.35,
            life:1
        })
    }
    loopDraw();
}

//烟花高光
export function showFireworks(){
    EffectCanvas.classList.remove("hidden");
    particleList=[];
    for(let i=0;i<80;i++){
        particleList.push({
            x:EffectCanvas.width/2,
            y:EffectCanvas.height/2,
            vx:(Math.random()-0.5)*12,
            vy:(Math.random()-0.5)*12,
            r:Utils.randInt(2,5),
            color:["#ffdd00","#ff6644","#44ddff","#88ff44"][Utils.randInt(0,3)],
            life:1
        })
    }
    loopDraw();
}

function loopDraw(){
    ctx.fillStyle="rgba(0,0,15,0.12)";
    ctx.fillRect(0,0,EffectCanvas.width,EffectCanvas.height);
    for(let p of particleList){
        p.life -=0.016;
        if(p.life<=0) continue;
        if(p.len){
            //流星
            const ex=p.x+Math.cos(p.angle)*p.len;
            const ey=p.y+Math.sin(p.angle)*p.len;
            ctx.beginPath();
            ctx.moveTo(p.x,p.y);
            ctx.lineTo(ex,ey);
            ctx.strokeStyle=`rgba(255,255,255,${p.life})`;
            ctx.lineWidth=2;
            ctx.stroke();
            p.x+=Math.cos(p.angle)*p.speed;
            p.y+=Math.sin(p.angle)*p.speed;
        }else{
            //烟花粒子
            ctx.beginPath();
            ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
            ctx.fillStyle=p.color;
            ctx.globalAlpha=p.life;
            ctx.fill();
            ctx.globalAlpha=1;
            p.x+=p.vx;
            p.y+=p.vy;
            p.vy+=0.25;
        }
    }
    particleList=particleList.filter(p=>p.life>0);
    if(particleList.length>0){
        animId=requestAnimationFrame(loopDraw);
    }
}

//关闭特效画布
export function closeEffect(){
    cancelAnimationFrame(animId);
    EffectCanvas.classList.add("hidden");
}
EffectCanvas.onclick=closeEffect;
