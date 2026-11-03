/** 把玩家所有数据渲染到页面DOM，【不破坏原有DOM结构！只改文本】 */
function renderPlayerUI(player) {
  const realmCfg = getRealmCfgByName(player.basic.realm);
  const bodyCfg = getBodyCfgByName(player.basic.bodyRealm);

  // ========== 1、顶部信息渲染（道号、灵石、声望、门派、年份、境界肉身） ==========
  // 道号
  const daoNameDom = document.getElementById("ui-username");
  if (daoNameDom) daoNameDom.innerText = player.basic.userName;
  // 灵石
  const lingshiDom = document.getElementById("ui-lingshi");
  if (lingshiDom) lingshiDom.innerText = player.basic.lingShi.toLocaleString();
  // 声望
  const shengwangDom = document.getElementById("ui-shengwang");
  if (shengwangDom) shengwangDom.innerText = player.basic.shengWang.toLocaleString();
  // 境界标签
  const realmShowDom = document.getElementById("realm-display");
  if (realmShowDom) realmShowDom.innerText = player.basic.realm;
  // 肉身标签
  const bodyShowDom = document.getElementById("body-display");
  if (bodyShowDom) bodyShowDom.innerText = player.basic.bodyRealm;
  // 修炼年数
  const yearDom = document.getElementById("ui-year");
  if (yearDom) yearDom.innerText = player.basic.year.toLocaleString() + "年";

  const rate = calcTotalRate(player);
  // ========== 2、修炼效率文字（修复区间硬编码问题） ==========
  // 兼容你当前页面的修炼效率行，更换匹配规则
  const rateTextDom = document.querySelector(".xiulian-rate-text");
  if(!rateTextDom){
    // 备选选择器，兼容你的界面
    rateTextDom = document.querySelector("div:has(span:contains('/5秒'))");
  }
  if(rateTextDom){
    rateTextDom.innerText = `当前修炼效率：${rate} /5秒`;
  }

  // ========== 3、修为文字：【当前境界修为 / 境界上限】 分开两个独立文本，不破坏进度条 ==========
  const curExpDom = document.getElementById("cur-exp-text");
  if(curExpDom) curExpDom.innerText = player.basic.curExp.toLocaleString();
  const needExpDom = document.getElementById("need-exp-text");
  if(needExpDom) needExpDom.innerText = realmCfg.needExp.toLocaleString();
  const totalExpDom = document.getElementById("total-xiuwei");
  if(totalExpDom) totalExpDom.innerText = player.basic.curExp.toLocaleString();

  // ========== 4、【重点！修为进度条动态】计算百分比 ==========
  const progressBar = document.getElementById("exp-progress-bar");
  if(progressBar){
    let percent = (player.basic.curExp / realmCfg.needExp) * 100;
    if(percent > 100) percent = 100;
    progressBar.style.width = `${percent}%`;
  }
}

/** 登录按钮，切换屏幕 */
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

/** 修炼循环，稳定涨修为 */
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

// ===================== 预留占位函数（全部保留，防止按钮报错） =====================
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
