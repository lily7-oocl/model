// AI规划页面专用JavaScript

let currentStep = 1;
let planningData = {
    destination: '',
    startDate: '',
    days: 3,
    people: 2,
    preferences: [],
    budget: ''
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializePlanPage();
});

// 初始化规划页面
function initializePlanPage() {
    // 设置最小日期为今天
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate').min = today;
    
    // 初始化事件监听器
    initializeEventListeners();
    
    // 从URL参数获取数据
    loadFromURLParams();
}

// 初始化事件监听器
function initializeEventListeners() {
    // 天数选择
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            planningData.days = parseInt(this.dataset.days);
        });
    });
    
    // 偏好选择
    document.querySelectorAll('.preference-tag input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updatePreferences();
        });
    });
    
    // 预算选择
    document.querySelectorAll('.budget-option input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            planningData.budget = this.value;
        });
    });
    
    // 表单输入监听
    document.getElementById('destination').addEventListener('input', function() {
        planningData.destination = this.value;
    });
    
    document.getElementById('startDate').addEventListener('change', function() {
        planningData.startDate = this.value;
    });
}

// 从URL参数加载数据
function loadFromURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('destination')) {
        planningData.destination = urlParams.get('destination');
        document.getElementById('destination').value = planningData.destination;
    }
    
    if (urlParams.get('preferences')) {
        const preferences = urlParams.get('preferences').split(',');
        preferences.forEach(pref => {
            const checkbox = document.querySelector(`input[value="${pref}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
        updatePreferences();
    }
    
    if (urlParams.get('days')) {
        const days = parseInt(urlParams.get('days'));
        planningData.days = days;
        const dayBtn = document.querySelector(`.day-btn[data-days="${days}"]`);
        if (dayBtn) {
            document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
            dayBtn.classList.add('active');
        }
    }
}

// 更新偏好选择
function updatePreferences() {
    const selectedPreferences = [];
    document.querySelectorAll('.preference-tag input[type="checkbox"]:checked').forEach(checkbox => {
        selectedPreferences.push(checkbox.value);
    });
    planningData.preferences = selectedPreferences;
}

// 下一步
function nextStep() {
    if (currentStep === 1) {
        if (!validateStep1()) return;
    } else if (currentStep === 2) {
        if (!validateStep2()) return;
    }
    
    // 隐藏当前步骤
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
    
    // 显示下一步
    currentStep++;
    document.getElementById(`step${currentStep}`).classList.add('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
    
    // 如果是AI生成步骤，开始生成过程
    if (currentStep === 3) {
        startAIGeneration();
    } else if (currentStep === 4) {
        updateItinerarySummary();
    }
}

// 上一步
function prevStep() {
    // 隐藏当前步骤
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
    
    // 显示上一步
    currentStep--;
    document.getElementById(`step${currentStep}`).classList.add('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
}

// 验证步骤1
function validateStep1() {
    const destination = document.getElementById('destination').value.trim();
    const startDate = document.getElementById('startDate').value;
    
    if (!destination) {
        showNotification('请输入目的地', 'error');
        return false;
    }
    
    if (!startDate) {
        showNotification('请选择出发日期', 'error');
        return false;
    }
    
    planningData.destination = destination;
    planningData.startDate = startDate;
    
    return true;
}

// 验证步骤2
function validateStep2() {
    updatePreferences();
    
    if (planningData.preferences.length === 0) {
        showNotification('请至少选择一个偏好', 'error');
        return false;
    }
    
    const selectedBudget = document.querySelector('input[name="budget"]:checked');
    if (!selectedBudget) {
        showNotification('请选择预算范围', 'error');
        return false;
    }
    
    planningData.budget = selectedBudget.value;
    
    return true;
}

// 开始AI生成
function startAIGeneration() {
    const aiStatus = document.querySelector('.ai-status');
    const progressFill = document.querySelector('.progress-fill');
    
    // 模拟AI生成过程
    const steps = [
        '正在分析您的偏好和目的地信息...',
        '正在匹配最佳景点和路线...',
        '正在优化时间安排...',
        '正在生成个性化行程...',
        '行程生成完成！'
    ];
    
    let currentStepIndex = 0;
    let progress = 0;
    
    const updateStatus = () => {
        if (currentStepIndex < steps.length) {
            aiStatus.textContent = steps[currentStepIndex];
            currentStepIndex++;
            
            // 更新进度条
            progress += 20;
            progressFill.style.width = `${progress}%`;
            
            if (currentStepIndex < steps.length) {
                setTimeout(updateStatus, 1000);
            } else {
                // 生成完成，自动进入下一步
                setTimeout(() => {
                    nextStep();
                }, 1000);
            }
        }
    };
    
    updateStatus();
}

// 更新行程摘要
function updateItinerarySummary() {
    document.getElementById('summaryDestination').textContent = planningData.destination;
    document.getElementById('summaryDays').textContent = `${planningData.days}天`;
    document.getElementById('summaryPeople').textContent = `${planningData.people}人`;
    document.getElementById('summaryBudget').textContent = planningData.budget;
    
    // 更新日期显示
    const startDate = new Date(planningData.startDate);
    const dayElements = document.querySelectorAll('.day-date');
    
    for (let i = 0; i < dayElements.length; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        dayElements[i].textContent = currentDate.toLocaleDateString('zh-CN');
    }
}

// 重新生成行程
function regenerateItinerary() {
    showNotification('正在重新生成行程...', 'info');
    
    // 回到AI生成步骤
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
    
    currentStep = 3;
    document.getElementById(`step${currentStep}`).classList.add('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
    
    // 重置进度条
    document.querySelector('.progress-fill').style.width = '0%';
    
    // 重新开始AI生成
    setTimeout(() => {
        startAIGeneration();
    }, 500);
}

// 查看完整行程
function viewFullItinerary() {
    // 保存规划数据到localStorage
    localStorage.setItem('currentItinerary', JSON.stringify(planningData));
    
    // 跳转到行程页面
    window.location.href = 'itinerary.html';
}

// 获取当前位置
function getCurrentLocation() {
    if (navigator.geolocation) {
        showNotification('正在获取您的位置...', 'info');
        
        navigator.geolocation.getCurrentPosition(
            function(position) {
                // 这里可以调用地理编码API将坐标转换为地址
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                // 模拟获取地址
                setTimeout(() => {
                    const mockAddress = '当前位置';
                    document.getElementById('destination').value = mockAddress;
                    planningData.destination = mockAddress;
                    showNotification('已获取当前位置', 'success');
                }, 1000);
            },
            function(error) {
                showNotification('无法获取位置信息', 'error');
            }
        );
    } else {
        showNotification('您的浏览器不支持定位功能', 'error');
    }
}

// 改变人数
function changePeople(delta) {
    const peopleCount = document.querySelector('.people-count');
    let currentCount = parseInt(peopleCount.textContent);
    let newCount = currentCount + delta;
    
    if (newCount >= 1 && newCount <= 10) {
        peopleCount.textContent = newCount;
        planningData.people = newCount;
    }
}

// 添加一些示例行程数据
const sampleItineraries = {
    '北京': {
        3: [
            { day: 1, attractions: ['天安门广场', '故宫博物院', '景山公园'] },
            { day: 2, attractions: ['天坛公园', '前门大街', '王府井'] },
            { day: 3, attractions: ['颐和园', '圆明园'] }
        ],
        5: [
            { day: 1, attractions: ['天安门广场', '故宫博物院', '景山公园'] },
            { day: 2, attractions: ['天坛公园', '前门大街', '王府井'] },
            { day: 3, attractions: ['颐和园', '圆明园'] },
            { day: 4, attractions: ['长城', '明十三陵'] },
            { day: 5, attractions: ['798艺术区', '三里屯'] }
        ]
    },
    '上海': {
        3: [
            { day: 1, attractions: ['外滩', '南京路步行街', '豫园'] },
            { day: 2, attractions: ['东方明珠', '上海博物馆', '田子坊'] },
            { day: 3, attractions: ['迪士尼乐园'] }
        ]
    },
    '杭州': {
        3: [
            { day: 1, attractions: ['西湖', '断桥残雪', '雷峰塔'] },
            { day: 2, attractions: ['灵隐寺', '飞来峰', '龙井村'] },
            { day: 3, attractions: ['千岛湖', '西溪湿地'] }
        ]
    }
};

// 生成示例行程
function generateSampleItinerary() {
    const destination = planningData.destination;
    const days = planningData.days;
    
    if (sampleItineraries[destination] && sampleItineraries[destination][days]) {
        return sampleItineraries[destination][days];
    }
    
    // 默认行程
    const defaultItinerary = [];
    for (let i = 1; i <= days; i++) {
        defaultItinerary.push({
            day: i,
            attractions: [`第${i}天景点1`, `第${i}天景点2`, `第${i}天景点3`]
        });
    }
    
    return defaultItinerary;
}

// 更新每日安排显示
function updateDailySchedule() {
    const itinerary = generateSampleItinerary();
    const dailySchedule = document.querySelector('.daily-schedule');
    
    if (dailySchedule) {
        dailySchedule.innerHTML = '';
        
        itinerary.forEach(day => {
            const dayItem = document.createElement('div');
            dayItem.className = 'day-item';
            
            const startDate = new Date(planningData.startDate);
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + day.day - 1);
            
            dayItem.innerHTML = `
                <div class="day-header">
                    <span class="day-number">第${day.day}天</span>
                    <span class="day-date">${currentDate.toLocaleDateString('zh-CN')}</span>
                </div>
                <div class="day-attractions">
                    ${day.attractions.map(attraction => 
                        `<span class="attraction">${attraction}</span>`
                    ).join('')}
                </div>
            `;
            
            dailySchedule.appendChild(dayItem);
        });
    }
}

// 在步骤4中更新每日安排
document.addEventListener('DOMContentLoaded', function() {
    // 监听步骤变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.classList.contains('active') && target.id === 'step4') {
                    updateDailySchedule();
                }
            }
        });
    });
    
    const step4 = document.getElementById('step4');
    if (step4) {
        observer.observe(step4, { attributes: true });
    }
});
