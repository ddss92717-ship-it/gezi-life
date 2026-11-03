/** 把玩家所有数据渲染到页面DOM */
function renderPlayerUI(player) {
  // 获取当前境界配置
  const realmCfg = getRealmCfgByName(player.basic.realm);
  const bodyCfg = getBodyCfgByName(player.basic.bodyRealm);

  // 顶部账号、境界、肉身
  document.getElementById("ui-username").innerText = player.basic.userName;
  document.getElementById("ui-avatar-realm").innerText = player.basic.realm;
  document.getElementById("realm-display").innerText = player.basic.realm;
  document.getElementById("body-display").innerText = player.basic.bodyRealm;

  // 资源：灵石、声望、游戏年
  document.getElementById("ui-lingshi").innerText = player.basic.lingShi.toLocaleString();
  document.getElementById("ui-shengwang").innerText = player.basic.shengWang.toLocaleString();
  document.getElementById("ui-year").innerText = player.basic.year.toLocaleString() + "年";

  const expHtml = `当前境界修为：${player.basic.curExp.toLocaleString()} / ${realmCfg.needExp.toLocaleString()}`;
  const rate = calcTotalRate(player);

  // 修炼效率文本更新
  const rateTextDom = document.querySelector("#tab-xiulian .text-xs.text-center.font-bold");
  if(rateTextDom){
    rateTextDom.innerText = `当前修炼效率：${rate} /5秒`;
  }

  // 更新修为显示块
  const totalXiuweiDom = document.getElementById("total-xiuwei");
  if(totalXiuweiDom){
    totalXiuweiDom.parentElement.innerHTML = `
      <div class="text-xs text-stone-900 font-bold">
        ${expHtml}<br>
        总修为: <span id="total-xiuwei" class="text-amber-900 text-sm font-mono">${player.basic.curExp.toLocaleString()}</span>
      </div>
    `;
  }
}

/**
 * 登录按钮【修复！使用页面真实ID screen‑login / screen‑game】
 */
function handleLogin(){
  const loginScreen = document.getElementById("screen-login");
  const gameScreen = document.getElementById("screen-game");
  if(loginScreen){
    loginScreen.classList.add("hidden");
  }
  if(gameScreen){
    gameScreen.classList.remove("hidden");
  }
  console.log("✅登录成功，进入游戏");
}

/**
 * 【突破境界按钮点击事件】
 */
function onClickBreakThrough(){
  const player = loadSave();
  const isSuccess = tryRealmUp(player);
  if(isSuccess){
    saveSave(player);
    renderPlayerUI(player);
    alert("🎉恭喜道友，境界突破成功！");
  }else{
    const cfg = getRealmCfgByName(player.basic.realm);
    alert(`❌修为不足！需要 ${cfg.needExp.toLocaleString()} 修为才可突破，当前：${player.basic.curExp.toLocaleString()}`);
  }
}

/** 游戏主循环：每5秒增加修为 */
function startGameLoop() {
  setInterval(async () => {
    const player = loadSave();
    const rate = calcTotalRate(player);
    player.basic.curExp += rate;
    tryRealmUp(player);
    player.basic.year += 1;
    saveSave(player);
    renderPlayerUI(player);
  }, 5000);
}

// ===================== 下面是空占位壳，对应HTML页面onclick调用，暂时alert占位，以后再来实现，【千万不要删掉！】=====================
function switchTab(tabId){
  alert(`切换标签：${tabId}（尚未实现）`);
}
function openLingzhuModal(){
  alert("灵兽弹窗（尚未实现）");
}
function openSocialModal(){
  alert("道友弹窗（尚未实现）");
}
function openShangqingModal(){
  alert("上清宫弹窗（尚未实现）");
}
function openYouliModal(){
  alert("游历统计弹窗（尚未实现）");
}
function closeYouliModal(){}
function closeSocialModal(){}
function closeLingzhuModal(){}
function closeShangqingModal(){}
function feedLingzhu(){
  alert("喂养灵兽（尚未实现）");
}
function exploreMap(mapName){
  alert(`探索地图：${mapName}（尚未实现）`);
}
function renderXuanmenList(){
  alert("玄门全鉴渲染（尚未实现）");
}
function challengeEmperor(){
  alert("挑战大帝（尚未实现）");
}
