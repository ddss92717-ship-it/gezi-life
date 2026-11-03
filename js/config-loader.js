let GAME_CONFIG = null;

async function loadAllConfig() {
  const resRealm = await fetch("./config/realm.json");
  const realmList = await resRealm.json();

  const resBody = await fetch("./config/body.json");
  const bodyList = await resBody.json();

  GAME_CONFIG = {
    realmList,
    bodyList
  };
  console.log("✅全部静态配置加载完成", GAME_CONFIG);
}

function getRealmCfgByName(name) {
  return GAME_CONFIG.realmList.find(r => r.name === name);
}
function getBodyCfgByName(name) {
  return GAME_CONFIG.bodyList.find(b => b.name === name);
}
