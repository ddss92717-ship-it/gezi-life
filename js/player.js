// 玩家核心数据与状态变动方法
let player = {
    name: "楚明轩",
    spirit: 37395,
    reputation: 5664219,
    xiuwei: 630156239206,
    rate: 20040,
    realmIndex: 8, // 地仙
    bodyIndex: 1
};

// 自动修炼计时器
setInterval(() => {
    player.xiuwei += player.rate;
    updateUI(); // 触发界面刷新
}, 5000);
