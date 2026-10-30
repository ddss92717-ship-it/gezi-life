import {showMeteorShower,showFireworks,closeEffect} from "./canvas-effects.js";
import {getCandidateEvents,checkOptionCondition} from "./event-engine.js";

//游戏全局状态
let gameState={
    age:0,
    birthYear:2010,
    dayLeft:365,
    dayClickedCount:0,
    cash:0,
    hp:100,
    san:100,
    pts:100,
    fam:100,
    int:50,
    //开局出身信息
    birthInfo:null,
    //人生统计
    crisisCount:0,
    meteorCount:0
}

//DOM元素
const modalMask=document.getElementById("modalMask");
const modalBox=document.getElementById("modalBox");
const calendarGrid=document.getElementById("calendarGrid");

//开局投胎配置权重
const BIRTH_WEIGHT={
    area:[
        {name:"一线城市",weight:8,cashBonus:120000,ptsBonus:15},
        {name:"新一线/二线城市",weight:22,cashBonus:40000,ptsBonus:8},
        {name:"三四线小县城",weight:45,cashBonus:12000,ptsBonus:0},
        {name:"乡镇农村",weight:25,cashBonus:0,ptsBonus:-8}
    ],
    family:[
        {name:"富裕家庭",weight:5,cash:500000},
        {name:"小康家庭",weight:35,cash:120000},
        {name:"普通工薪家庭",weight:45,cash:20000},
        {name:"困难家庭",weight:15,cash:-15000}
    ]
}

//渲染属性面板UI
function renderStatUI(){
    document.getElementById("curAge").innerText=gameState.age+" 岁";
    document.getElementById("dayLeft").innerText=gameState.dayLeft;
    document.getElementById("cash").innerText="¥"+Math.round(gameState.cash).toLocaleString();
    document.getElementById("hpText").innerText=`${Math.round(gameState.hp)}/100`;
    document.getElementById("hpBar").style.width=gameState.hp+"%";
    document.getElementById("sanText").innerText=Math.round(gameState.san)+"%";
    document.getElementById("sanBar").style.width=gameState.san+"%";
    document.getElementById("ptsText").innerText=Math.round(gameState.pts)+" PTS";
    document.getElementById("famText").innerText=Math.round(gameState.fam);
    document.getElementById("intText").innerText=Math.round(gameState.int);
}

//弹窗工具
function openModal(html){
    modalBox.innerHTML=html;
    modalMask.classList.remove("hidden");
}
function closeModal(){
    modalMask.classList.add("hidden");
}

//【1】投胎开局弹窗
function showReincarnateModal(){
    const areaItem=Utils.weightedRandom(BIRTH_WEIGHT.area);
    const familyItem=Utils.weightedRandom(BIRTH_WEIGHT.family);
    const birthY=2010;
    gameState.birthYear=birthY;
    gameState.cash=familyItem.cash+areaItem.cashBonus;
    gameState.pts=Utils.clamp(gameState.pts+areaItem.ptsBonus,0,200);
    gameState.birthInfo={
        birthYear:birthY,
        area:areaItem.name,
        family:familyItem.name
    }
    const html=`
    <h3>📜格子人生：中国式生存法则【初始背景设定】</h3>
    <p>即将开启0岁新生儿到80岁的模拟人生。</p>
    <div style="background:#f4f7fa;padding:10px;border-radius:4px;margin:10px 0;">
        <p>出生年份：${gameState.birthYear}</p>
        <p>出生地：${gameState.birthInfo.area}</p>
        <p>家庭阶层：${gameState.birthInfo.family}</p>
        <p>初始流动资金：¥${Math.round(gameState.cash).toLocaleString()}</p>
    </div>
    <p>机制说明：点击格子推进一天，命运骰子一次跳1‑6天；随机触发现实事件。</p>
    <p>⚠️按Esc一键切换财务审计伪装页面摸鱼。</p>
    <div class="modal-footer">
        <button id="reRollBtn">🔄重新投胎</button>
        <button id="startGameBtn">✅确认投胎，开启人生</button>
    </div>
    `;
    openModal(html);
    document.getElementById("reRollBtn").onclick=()=>showReincarnateModal();
    document.getElementById("startGameBtn").onclick=()=>{
        closeModal();
        initYearGrid();
        renderStatUI();
    }
}

//初始化当年日历网格
function initYearGrid(){
    const totalDay=Utils.getYearDayCount(gameState.birthYear+gameState.age);
    gameState.dayLeft=totalDay;
    gameState.dayClickedCount=0;
    calendarGrid.innerHTML="";
    //自适应网格行列
    const wrapW=calendarGrid.clientWidth;
    const wrapH=calendarGrid.clientHeight;
    const cellSize=32;
    const col=Math.floor(wrapW/(cellSize+4));
    const row=Math.floor(wrapH/(cellSize+4));
    calendarGrid.style.gridTemplateColumns=`repeat(${col},1fr)`;

    //标记哪些是事件格子，10%概率
    let eventIndexSet=new Set();
    const eventNum=Math.round(totalDay*0.10);
    while(eventIndexSet.size<eventNum){
        const r=Utils.randInt(1,totalDay);
        eventIndexSet.add(r);
    }

    for(let d=1;d<=totalDay;d++){
        const cell=document.createElement("div");
        cell.className="day-cell";
        cell.dataset.day=d;
        cell.dataset.isEvent=eventIndexSet.has(d)?"1":"0";
        cell.innerText="";
        cell.onclick=()=>handleCellClick(cell);
        calendarGrid.appendChild(cell);
    }
}

//点击单个格子
async function handleCellClick(cellEl){
    if(cellEl.classList.contains("clicked")) return;
    const dayNum=Number(cellEl.dataset.day);
    cellEl.classList.add("fire");
    await sleep(300);
    cellEl.classList.remove("fire");
    gameState.dayClickedCount++;
    gameState.dayLeft--;
    //格式化日期文字
    const isLeap=Utils.isLeapYear(gameState.birthYear+gameState.age);
    const md=Utils.dayOfYearToMD(gameState.dayClickedCount,isLeap);
    cellEl.innerText=`${md.month}月${md.day}日`;
    cellEl.classList.add("clicked");

    //事件格触发事件
    if(cellEl.dataset.isEvent==="1"){
        await triggerRandomEvent();
    }
    checkYearChange();
    checkGameOver();
    renderStatUI();
    saveGameLocal();
}

//骰子逻辑
document.getElementById("diceBtn").onclick=async ()=>{
    let diceVal=Utils.randInt(1,6);
    const unClickCells=Array.from(calendarGrid.querySelectorAll(".day-cell:not(.clicked)"));
    if(unClickCells.length===0) return;
    let processList=[];
    for(let i=0;i<diceVal;i++){
        if(unClickCells.length===0) break;
        const idx=Utils.randInt(0,unClickCells.length-1);
        const pick=unClickCells.splice(idx,1)[0];
        processList.push(pick);
    }
    for(let el of processList){
        await handleCellClick(el);
        await sleep(180);
    }
}

//sleep工具
function sleep(ms){
    return new Promise(res=>setTimeout(res,ms));
}

//触发随机事件
async function triggerRandomEvent(){
    const candidates=getCandidateEvents(gameState.age);
    if(candidates.length===0) return;
    const evt=candidates[Utils.randInt(0,candidates.length-1)];
    gameState.crisisCount++;
    //过滤可用选项
    let usableOpts=evt.options.filter(opt=>checkOptionCondition(opt.condition,gameState));
    if(usableOpts.length===0) return;

    return new Promise(resolve=>{
        let optHtml=usableOpts.map((opt,idx)=>`
            <button class="option-btn" data-idx="${idx}">${opt.text}</button>
        `).join("");
        openModal(`
            <h3>📌${evt.title}</h3>
            <p>${evt.desc}</p>
            <div>${optHtml}</div>
        `);
        //绑定选项点击
        const btns=modalBox.querySelectorAll(".option-btn");
        btns.forEach(btn=>{
            btn.onclick=async ()=>{
                const selIdx=Number(btn.dataset.idx);
                const selOpt=usableOpts[selIdx];
                //执行属性变化
                applyEffect(selOpt.effect);
                closeModal();
                //情绪标签
                if(selOpt.moodTag==="sad"){
                    gameState.meteorCount++;
                    openModal(`
                        <p>系统检测数据剧烈波动，你的心里很沉重。</p>
                        <p>要不要去看一场流星雨舒缓心情？</p>
                        <div class="modal-footer">
                            <button id="meteorYes">好的</button>
                        </div>
                    `);
                    document.getElementById("meteorYes").onclick=()=>{
                        closeModal();
                        showMeteorShower();
                        gameState.san=Utils.clamp(gameState.san+15,0,100);
                        setTimeout(()=>closeEffect(),3200);
                        resolve();
                    }
                }else if(selOpt.moodTag==="happy"){
                    showFireworks();
                    setTimeout(()=>closeEffect(),2200);
                    resolve();
                }else{
                    resolve();
                }
            }
        })
    })
}

//执行属性变更
function applyEffect(effectObj){
    for(let key in effectObj){
        let val=effectObj[key];
        //百分比系数 cash:0.2代表现金*1.2
        if(key==="cash"){
            if(val>0 && val<1){
                gameState.cash *= (1+val);
            }else if(val<0 && val>-1){
                gameState.cash *= (1+val);
            }else{
                gameState.cash += val;
            }
        }else{
            gameState[key]= (gameState[key]||0)+val;
        }
    }
    gameState.hp=Utils.clamp(gameState.hp,0,100);
    gameState.san=Utils.clamp(gameState.san,0,100);
    gameState.pts=Utils.clamp(gameState.pts,0,200);
    gameState.fam=Utils.clamp(gameState.fam,0,200);
    gameState.int=Utils.clamp(gameState.int,0,100);
}

//跨年判断
function checkYearChange(){
    if(gameState.dayLeft<=0){
        gameState.age+=1;
        initYearGrid();
    }
}

//游戏结束判定
function checkGameOver(){
    let endReason=null;
    if(gameState.hp<=0) endReason="英年早逝，健康归零";
    if(gameState.san<=0) endReason="精神崩溃结局";
    if(gameState.age>=80) endReason="寿终正寝，走完一生";
    if(gameState.cash<-200000) endReason="巨额负债破产结局";
    if(!endReason) return;
    //审计报告
    openModal(`
    <h2>📃终极一生资产与命运审计报告</h2>
    <p>出身信息：${gameState.birthInfo.area}｜${gameState.birthInfo.family}</p>
    <p>终局年龄：${gameState.age}岁｜结局原因：${endReason}</p>
    <hr>
    <p>累计经历重大危机：${gameState.crisisCount}次</p>
    <p>触发流星雨治愈：${gameState.meteorCount}次</p>
    <p>最终遗产资产：¥${Math.round(gameState.cash).toLocaleString()}</p>
    <p>最终健康：${Math.round(gameState.hp)}｜快乐：${Math.round(gameState.san)}%</p>
    <div class="modal-footer">
        <button id="restartBtn">🔁重新投胎开启新人生</button>
    </div>
    `);
    document.getElementById("restartBtn").onclick=()=>{
        localStorage.removeItem("gridLifeSave");
        closeModal();
        gameState={
            age:0,birthYear:2010,dayLeft:365,dayClickedCount:0,
            cash:0,hp:100,san:100,pts:100,fam:100,int:50,
            birthInfo:null,crisisCount:0,meteorCount:0
        }
        showReincarnateModal();
    }
}

//本地存档
function saveGameLocal(){
    localStorage.setItem("gridLifeSave",JSON.stringify(gameState));
}
function loadGameLocal(){
    const s=localStorage.getItem("gridLifeSave");
    if(s) return JSON.parse(s);
    return null;
}

//导出存档
document.getElementById("exportSave").onclick=()=>{
    const blob=new Blob([JSON.stringify(gameState,null,2)],{type:"application/json"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="格子人生存档.json";
    a.click();
}
document.getElementById("importSave").onclick=()=>document.getElementById("importFile").click();
document.getElementById("importFile").onchange=(ev)=>{
    const f=ev.target.files[0];
    const reader=new FileReader();
    reader.onload=(e)=>{
        const data=JSON.parse(e.target.result);
        gameState=data;
        initYearGrid();
        renderStatUI();
    }
    reader.readAsText(f);
}

//Esc按键跳转到boss伪装页面
document.addEventListener("keydown",(e)=>{
    if(e.key==="Escape"){
        window.location.href="./boss-screen.html";
    }
})

//页面启动
window.onload=()=>{
    const oldSave=loadGameLocal();
    if(oldSave){
        openModal(`<p>检测到本地存档，是否读取？</p>
        <div class="modal-footer">
        <button id="loadOld">读取存档</button>
        <button id="newGame">开启新投胎</button>
        </div>`);
        document.getElementById("loadOld").onclick=()=>{
            gameState=oldSave;
            closeModal();
            initYearGrid();
            renderStatUI();
        }
        document.getElementById("newGame").onclick=()=>{
            localStorage.removeItem("gridLifeSave");
            closeModal();
            showReincarnateModal();
        }
    }else{
        showReincarnateModal();
    }
}
