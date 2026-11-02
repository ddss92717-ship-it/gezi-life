// 负责视图切换与 DOM 动态刷新
function updateUI() {
    const xiuweiEl = document.getElementById('total-xiuwei');
    if (xiuweiEl) {
        xiuweiEl.innerText = player.xiuwei.toLocaleString();
    }
}

function switchTab(tabName) {
    ['xiuxian', 'dongfu'].forEach(t => {
        const el = document.getElementById(`tab-${t}`);
        const nav = document.getElementById(`nav-${t}`);
        if (el) el.classList.add('hidden');
        if (nav) nav.classList.remove('active');
    });
    const target = document.getElementById(`tab-${tabName}`);
    const targetNav = document.getElementById(`nav-${tabName}`);
    if (target) target.classList.remove('hidden');
    if (targetNav) targetNav.classList.add('active');
}

function tryBreakthrough(type) {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    alert(type === 'realm' ? "【渡劫成功】金光贯体，修为大进！" : "【肉身升级】气血爆棚，肉身突破！");
}
