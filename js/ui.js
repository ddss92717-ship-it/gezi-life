/**
 * 【重要】index.html完全不修改！全部复用页面已有的DOM，不新增任何标签ID
 */
function renderPlayerUI(player) {
  const realmCfg = getRealmCfgByName(player.basic.realm);
  const bodyCfg = getBodyCfgByName(player.basic.bodyRealm);

  // =========顶部信息渲染 =========
  const daoNameDom = document.getElementById("ui-username");
  if (daoNameDom) daoNameDom.innerText = player.basic.userName;

  document.getElementById("ui-avatar-realm").innerText = player.basic.realm;
  document.getElementById("realm-display").innerText = player.basic.realm;
  document.getElementById("body-display").innerText = player.basic.bodyRealm;
  document.getElementById("ui-lingshi").innerText = player.basic.lingShi.toLocaleString();
  document.getElementById("ui-shengwang").innerText = player.basic.shengWang.toLocaleString();
  document.getElementById("ui-year").innerText = player.basic.year.toLocaleString() + "年";

  const rate = calcTotalRate(player);

  // ========= 1、修改修炼效率文本（匹配现有DOM，无class/id，靠文本内容定位） =========
  const allDiv = document.querySelectorAll("#tab-xiulian div");
  for(let d of allDiv){
    if(d.innerText.indexOf("当前修炼效率：") !== -1){
      d.innerText = `当前修炼效率：${rate} /5秒`;
      break;
    }
  }

  // =========2、总修为（已有id total‑xiuwei） =========
  const totalExpDom = document.getElementById("total-xiuwei");
  if(totalExpDom){
    totalExpDom.innerText = player.basic.curExp.toLocaleString();
    // 往它的父节点追加文字，不破坏原有页面其他元素
    let parent = totalExpDom.parentElement;
    // 先把旧的【当前境界修为】删掉，防止重复叠加
    let oldTip = parent.querySelector(".exp-tip-node");
    if(oldTip) oldTip.remove();
    // 创建一个新的span，附加到父容器，不破坏原始HTML
    let tipSpan = document.createElement("div");
    tipSpan.className = "exp-tip-node";
    tipSpan.style.fontSize="11px";
    tipSpan.style.color="#92400e";
    tipSpan.innerText = `当前境界修为：${player.basic.curExp.toLocaleString()} / ${realmCfg.needExp.toLocaleString()}`;
    parent.insertBefore(tipSpan, totalExpDom);
  }

  // =========3、进度条，使用页面真实id ui‑progress‑bar =========
  const progressBar = document.getElementById("ui-progress-bar");
  if(progressBar){
    let percent = (player.basic.curExp / realmCfg.needExp) * 100;
    if(percent > 100) percent = 100;
    progressBar.style.width = `${percent}%`;
  }
}

/** 登录按钮，使用页面真实ID，index按钮onclick保持不变 */
function handleLogin(){
  const loginScreen = document.getElementById("screen-login");
  const gameScreen = document.getElementById("screen-game");
  if(loginScreen) loginScreen.classList.add("hidden");
  if(gameScreen) gameScreen.classList.remove("hidden");
  console.log("✅登录成功，进入游戏");
}

/** 突破境界按钮 */
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

/** 修炼循环 */
function startGameLoop() {
  setInterval(() => {
    const player = loadSave();
    const rate = calcTotalRate(player);
    player.basic.curExp += rate;
    tryRealmUp(player);
    player.basic.year += 1;
    saveSave(player);
    renderPlayerUI(player);
  }, 5000);
}

// ========== 全部占位空函数（页面onclick会调用，不能缺失！！index.html完全不动 ==========
function switchTab(tabId){
  alert(`切换标签：${tabId}（尚未实现）`);
}
function openLingzhuModal(){ alert("灵兽弹窗（尚未实现）"); }
function openSocialModal(){ alert("道友弹窗（尚未实现）"); }
function openShangqingModal(){ alert("上清宫弹窗（尚未实现）"); }
function openYouliModal(){ alert("游历统计弹窗（尚未实现）"); }
function closeYouliModal(){}
function closeSocialModal(){}
function closeLingzhuModal(){}
function closeShangqingModal(){}
function feedLingzhu(){ alert("喂养灵兽（尚未实现）"); }
function exploreMap(mapName){ alert(`探索地图：${mapName}（尚未实现）`); }
function renderXuanmenList(){ alert("玄门全鉴渲染（尚未实现）"); }
function challengeEmperor(){ alert("挑战大帝（尚未实现）"); }
