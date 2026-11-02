// 玩家核心数据对象
let player = {
    name: "楚明轩",
    spirit: 37395,
    reputation: 5664219,
    xiuwei: 630156239206,
    rate: 20040,
    realmIndex: 8, // 地仙
    bodyIndex: 1,  // 肉身
    bag: []        // 储物袋背包
};

// 1. 保存存档到浏览器 LocalStorage
function saveGame() {
    try {
        const saveData = JSON.stringify(player);
        localStorage.setItem('xiuxian_save_data', saveData);
        console.log("【系统】游戏存档已成功保存！");
        showToast("💾 游戏已成功保存");
    } catch (e) {
        console.error("存档失败：", e);
    }
}

// 2. 从浏览器 LocalStorage 读取存档
function loadGame() {
    try {
        const savedData = localStorage.getItem('xiuxian_save_data');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            // 将读取到的数据合并到 player 对象中
            player = { ...player, ...parsedData };
            console.log("【系统】成功读取历史存档！");
            showToast("📂 成功加载历史存档");
        } else {
            console.log("【系统】未发现本地存档，将使用初始数据。");
        }
    } catch (e) {
        console.error("读取存档失败：", e);
    }
}

// 3. 重置/清空存档
function resetGame() {
    if (confirm("道友，重置存档将清空所有修为与资源，是否确定轮回重修？")) {
        localStorage.removeItem('xiuxian_save_data');
        location.reload(); // 刷新页面
    }
}

// 辅助小提示弹窗（Toast）
function showToast(message) {
    let toast = document.getElementById('game-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'game-toast';
        toast.className = 'fixed top-12 left-1/2 transform -translate-x-1/2 bg-[#2a1f15] text-amber-300 border border-[#b89753] px-4 py-1.5 rounded-full text-xs font-mono shadow-lg z-50 transition-opacity duration-300';
        document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.style.opacity = '1';
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 2000);
}

// 游戏初始化时自动加载存档
window.addEventListener('DOMContentLoaded', () => {
    loadGame();
    if (typeof updateUI === 'function') {
        updateUI();
    }
});

// 自动修炼计时器（每5秒增加修为，并自动触发一次存档，防止玩家突然关闭网页丢失进度）
setInterval(() => {
    player.xiuwei += player.rate;
    if (typeof updateUI === 'function') {
        updateUI();
    }
}, 5000);

// 每隔 30 秒自动后台保存一次
setInterval(() => {
    saveGame();
}, 30000);
