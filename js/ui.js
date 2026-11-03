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

  // ==========修复修为显示【已积攒修为 / 当前境界升级需要修为】==========
  // 寻找页面上显示修为的dom节点（原模板id：total‑xiuwei是总修为，新增显示当前境界curExp / needExp）
  const expHtml = `当前境界修为：${player.basic.curExp.toLocaleString()} / ${realmCfg.needExp.toLocaleString()}`;
  // 如果你的页面有<span id="cur‑exp‑show">，优先用id；没有就替换修炼面板里面对应文字块
  const rate = calcTotalRate(player);
  // 替换修炼效率，删掉老的硬编码区间 5490~12240，显示真实计算出来的固定速率
  const rateTextDom = document.querySelector("#tab‑xiulian .text‑xs.text‑center.font‑bold");
  if(rateTextDom){
    rateTextDom.innerText = `当前修炼效率：${rate} /5秒`;
  }

  // 把修为文本写入总修为下面，如果你原页面没有专门dom，我们复用现有位置
  const totalXiuweiDom = document.getElementById("total‑xiuwei");
  if(totalXiuweiDom){
    totalXiuweiDom.parentElement.innerHTML = `
      <div class="text‑xs text‑stone‑900 font‑bold">
        ${expHtml}<br>
        总修为: <span id="total‑xiuwei" class="text‑amber‑900 text‑sm font‑mono">${player.basic.curExp.toLocaleString()}</span>
      </div>
    `;
  }
}

/**
 * 【突破境界按钮点击事件】
 * 修复：可以无限点击的bug，增加修为判断，够才升级，不够弹窗提示
 */
function onClickBreakThrough(){
  const player = loadSave();
  // 尝试升级
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
    // 每5秒增加修为
    player.basic.curExp += rate;
    // 尝试自动突破（保留原版自动修炼升级逻辑）
    tryRealmUp(player);
    // 游戏年份增长
    player.basic.year += 1;
    // 存档写入localStorage
    saveSave(player);
    // 刷新全部UI
    renderPlayerUI(player);
  }, 5000);
}
/** 登录按钮处理函数：隐藏登录弹窗，启动游戏 */
function handleLogin(){
  // 找到登录弹窗遮罩，隐藏它，根据你页面的class/id微调
  const loginModal = document.getElementById("login-modal");
  if(loginModal){
    loginModal.style.display = "none";
  }
  // 游戏已经在bootstrap启动了，这里只负责关闭登录弹窗
  console.log("✅登录成功，进入游戏");
}

