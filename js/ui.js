function renderPlayerUI(player) {
  document.getElementById("ui-username").innerText = player.basic.userName;
  document.getElementById("ui-avatar-realm").innerText = player.basic.realm;
  document.getElementById("realm-display").innerText = player.basic.realm;
  document.getElementById("body-display").innerText = player.basic.bodyRealm;
  document.getElementById("ui-lingshi").innerText = player.basic.lingShi.toLocaleString();
  document.getElementById("ui-shengwang").innerText = player.basic.shengWang.toLocaleString();
  document.getElementById("ui-year").innerText = player.basic.year.toLocaleString() + "年";

  const rate = calcTotalRate(player);
  const rateTextDom = document.querySelector("#tab-xiulian .text-xs.text-center.font-bold");
  if(rateTextDom){
    rateTextDom.innerText = `当前修炼效率：(${rate}~${rate})/5秒`;
  }
}

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
