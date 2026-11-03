function calcTotalRate(player) {
  if (!GAME_CONFIG) throw new Error("配置未加载完成");
  const realmCfg = getRealmCfgByName(player.basic.realm);
  const bodyCfg = getBodyCfgByName(player.basic.bodyRealm);
  const base = realmCfg.baseRate;
  const bodyAdd = bodyCfg.rateAdd;
  return base + bodyAdd;
}

function tryRealmUp(player) {
  const cfg = getRealmCfgByName(player.basic.realm);
  if (player.basic.curExp >= cfg.needExp) {
    const idx = GAME_CONFIG.realmList.findIndex(r => r.name === player.basic.realm);
    if (idx + 1 >= GAME_CONFIG.realmList.length) {
      console.log("已达到当前版本最高境界");
      return false;
    }
    const next = GAME_CONFIG.realmList[idx + 1];
    const leftExp = player.basic.curExp - cfg.needExp;
    player.basic.realm = next.name;
    player.basic.curExp = leftExp;
    console.log(`🎉升级！到达${next.name}，剩余修为${leftExp}`);
    return true;
  }
  return false;
}
