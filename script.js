// 初始化奖品数据
const initialPrizes = {
    "盐巴": { count: 20, weight: 5 },
    "面条": { count: 10, weight: 3 },
    "鸡蛋": { count: 5, weight: 1 }
};

// 从 localStorage 获取数据，如果没有则使用初始数据
let remainingPrizes = JSON.parse(localStorage.getItem('remainingPrizes')) || JSON.parse(JSON.stringify(initialPrizes));
let drawCount = parseInt(localStorage.getItem('drawCount')) || 0;

// 保存数据到 localStorage
function saveData() {
    localStorage.setItem('remainingPrizes', JSON.stringify(remainingPrizes));
    localStorage.setItem('drawCount', drawCount.toString());
}

// 抽奖按钮点击事件
document.getElementById('drawButton').addEventListener('click', draw);

// 抽奖函数
function draw() {
    drawCount++;
    
    // 计算中奖概率，随着抽奖次数增加，概率逐渐降低
    const winProbability = Math.max(0.5 - (drawCount / 300), 0.1);
    
    if (Math.random() > winProbability) {
        document.getElementById('result').textContent = "很遗憾，您没有中奖。";
        updateDrawCount();
        saveData();
        return;
    }

    const availablePrizes = Object.keys(remainingPrizes).filter(prize => remainingPrizes[prize].count > 0);
    
    if (availablePrizes.length === 0) {
        document.getElementById('result').textContent = "抱歉，所有奖品已被抽完。";
        document.getElementById('drawButton').disabled = true;
        saveData();
        return;
    }

    const prize = weightedRandomChoice(availablePrizes);
    remainingPrizes[prize].count--;

    document.getElementById('result').innerHTML = `恭喜您获得了 <span class="prize-name">${prize}</span>！`;
    updatePrizeStatus();
    updateDrawCount();
    saveData();
}

// 根据权重随机选择奖品
function weightedRandomChoice(availablePrizes) {
    const totalWeight = availablePrizes.reduce((sum, prize) => sum + remainingPrizes[prize].weight, 0);
    let randomWeight = Math.random() * totalWeight;
    
    for (const prize of availablePrizes) {
        randomWeight -= remainingPrizes[prize].weight;
        if (randomWeight <= 0) {
            return prize;
        }
    }
    
    return availablePrizes[availablePrizes.length - 1];
}

// 更新奖品状态显示
function updatePrizeStatus() {
    const statusElement = document.getElementById('prizeStatus');
    statusElement.innerHTML = "<h3>剩余奖品：</h3>";
    for (const [prize, info] of Object.entries(remainingPrizes)) {
        statusElement.innerHTML += `<p>${prize}: ${info.count}</p>`;
    }
}

// 更新抽奖次数显示
function updateDrawCount() {
    document.getElementById('drawCount').innerHTML = `<div>总抽奖次数：<br>${drawCount}</div>`;
}

// 重置数据函数（可选）
function resetData() {
    remainingPrizes = JSON.parse(JSON.stringify(initialPrizes));
    drawCount = 0;
    saveData();
    updatePrizeStatus();
    updateDrawCount();
    document.getElementById('result').textContent = "";
    document.getElementById('drawButton').disabled = false;
    alert('抽奖已重置！');
}

// 页面加载时更新显示
updatePrizeStatus();
updateDrawCount();

// 重置按钮点击事件
document.getElementById('resetButton').addEventListener('click', function() {
    if (confirm('确定要重置抽奖吗？所有数据将被清空。')) {
        resetData();
    }
});

// 可以添加一个重置按钮到 HTML 中：
// <button onclick="resetData()">重置抽奖</button>