const SAVE_KEY = "want_not_cultivate_save";

function getNewPlayerSave() {
  return {
    basic: {
      userName: "无名道友",
      year: 0,
      realm: "练气1阶",
      bodyRealm: "凡躯1阶",
      curExp: 0,
      lingShi: 1000,
      shengWang: 0,
      gongDe: 0
    },
    house: {
      juLing: 1,
      xiSui: 1,
      wood: 1,
      soil: 1,
      daoTongList: []
    },
    bag: {
      materials: {},
      pills: {},
      equips: [],
      furnaces: []
    },
    sect: {
      currentSect: null,
      contribute: 0,
      learnedSkill: []
    },
    map: {
      finishedMap: [],
      exploreRound: 0
    }
  };
}

function loadSave() {
  const str = localStorage.getItem(SAVE_KEY);
  if (!str) return getNewPlayerSave();
  try {
    return JSON.parse(str);
  } catch (e) {
    console.error("存档损坏，返回新存档", e);
    return getNewPlayerSave();
  }
}

function saveSave(playerObj) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(playerObj));
}

function exportSave(playerObj) {
  return btoa(JSON.stringify(playerObj));
}

function importSave(base64Str) {
  const jsonStr = atob(base64Str);
  const data = JSON.parse(jsonStr);
  saveSave(data);
  return data;
}
