// 【安全版】只渲染顶部UI，绝不触碰中间修炼区域DOM，保护打坐图、进度条、修为文本
function renderPlayerUI(player) {
  try{
    const realmCfg = getRealmCfgByName(player.basic.realm);
    // ========= 只修改顶部这一行信息，完全不碰中间修炼板块 =========
    const daoNameDom = document.getElementById("ui-username");
    if (daoNameDom) daoNameDom.innerText = player.basic.userName;

    const avatarRealmDom = document.getElementById("ui-avatar-realm");
    if(avatarRealmDom) avatarRealmDom.innerText = player.basic.realm;

    const realmShowDom = document.getElementById("realm-display");
    if(realmShowDom) realmShowDom.innerText = player.basic.realm;

    const bodyShowDom = document.getElementById("body-display");
    if(bodyShowDom) bodyShowDom.innerText = player.basic.bodyRealm;

    const lingshiDom = document.getElementById("ui-lingshi");
    if(lingshiDom) lingshiDom.innerText = player.basic.lingShi.toLocaleString();

    const shengwangDom = document.getElementById("ui-shengwang");
    if(shengwangDom) shengwangDom.innerText = player.basic.shengWang.toLocaleString();

    const yearDom = document.getElementById("ui-year");
    if(yearDom) yearDom.innerText = player.basic.year.toLocaleString() + "年";
  }catch(err){
    console.warn("顶部渲染异常，不影响修炼循环",err);
  }
}

function handleLogin(){
  try{
    document.getElementById("screen-login").classList.add("hidden");
    document.getElementById("screen-game").classList.remove("hidden");
    console.log("✅登录完成");
  }catch(e){
    console.error("登录切换异常",e);
  }
}

function onClickBreakThrough(){
  const player = loadSave();
  const ok = tryRealmUp(player);
  if(ok){
    saveSave(player);
    renderPlayerUI(player);
    alert("🎉恭喜道友，境界突破成功！");
  }else{
    const cfg = getRealmCfgByName(player.basic.realm);
    alert(`❌修为不足！需要 ${cfg.needExp.toLocaleString()} 修为才可突破，当前：${player.basic.curExp.toLocaleString()}`);
  }
}

function startGameLoop() {
  setInterval(() => {
    try{
      const player = loadSave();
      const rate = calcTotalRate(player);
      player.basic.curExp += rate;
      tryRealmUp(player);
      player.basic.year +=1;
      saveSave(player);
      renderPlayerUI(player);
    }catch(e){
      console.error("循环异常",e);
    }
  },5000);
}

// 占位函数，防止页面按钮点击报未定义
function switchTab(tabId){alert(`切换标签${tabId}，尚未实现`);}
function openLingzhuModal(){alert("灵兽弹窗尚未实现");}
function openSocialModal(){alert("道友弹窗尚未实现");}
function openShangqingModal(){alert("上清宫弹窗尚未实现");}
function openYouliModal(){alert("游历弹窗尚未实现");}
function closeYouliModal(){}
function closeSocialModal(){}
function closeLingzhuModal(){}
function closeShangqingModal(){}
function feedLingzhu(){alert("喂养灵兽尚未实现");}
function exploreMap(name){alert(`探索${name}尚未实现`);}
function renderXuanmenList(){alert("玄门全鉴尚未实现");}
function challengeEmperor(){alert("挑战大帝尚未实现");}
