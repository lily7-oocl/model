// 用户个人页面专用JavaScript

let currentTab = 'posts';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeProfilePage();
});

// 初始化个人页面
function initializeProfilePage() {
    // 初始化事件监听器
    initializeEventListeners();
    
    // 加载用户数据
    loadUserData();
    
    // 初始化标签切换
    initializeTabs();
}

// 初始化事件监听器
function initializeEventListeners() {
    // 标签切换
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            switchTab(tab);
        });
    });
    
    // 收藏按钮点击事件
    document.querySelectorAll('.btn-favorite').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleFavorite(this);
        });
    });
    
    // 删除按钮点击事件
    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            removeItem(this);
        });
    });
}

// 初始化标签切换
function initializeTabs() {
    // 默认显示第一个标签
    switchTab('posts');
}

// 切换标签
function switchTab(tabName) {
    // 隐藏所有标签内容
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 移除所有标签按钮的active状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 显示选中的标签内容
    document.getElementById(tabName).classList.add('active');
    
    // 激活选中的标签按钮
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    currentTab = tabName;
    
    // 根据标签加载相应数据
    loadTabData(tabName);
}

// 加载标签数据
function loadTabData(tabName) {
    switch(tabName) {
        case 'posts':
            loadPostsData();
            break;
        case 'itineraries':
            loadItinerariesData();
            break;
        case 'favorites':
            loadFavoritesData();
            break;
        case 'achievements':
            loadAchievementsData();
            break;
    }
}

// 加载用户数据
function loadUserData() {
    // 这里可以从API加载真实的用户数据
    const userData = {
        name: '旅行达人小王',
        bio: '热爱旅行，喜欢分享美好的旅程。走过30+个城市，记录每一个精彩瞬间。',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=120&h=120&fit=crop&crop=face',
        stats: {
            following: 156,
            followers: 2300,
            posts: 89,
            likes: 1200
        },
        badges: ['verified', 'level5']
    };
    
    updateUserInfo(userData);
}

// 更新用户信息
function updateUserInfo(data) {
    document.querySelector('.username').textContent = data.name;
    document.querySelector('.user-bio').textContent = data.bio;
    document.querySelector('.user-avatar').src = data.avatar;
    
    // 更新统计数据
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length >= 4) {
        stats[0].textContent = data.stats.following;
        stats[1].textContent = formatNumber(data.stats.followers);
        stats[2].textContent = data.stats.posts;
        stats[3].textContent = formatNumber(data.stats.likes);
    }
}

// 格式化数字
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

// 加载帖子数据
function loadPostsData() {
    // 这里可以从API加载真实的帖子数据
    console.log('加载帖子数据');
}

// 加载行程数据
function loadItinerariesData() {
    // 这里可以从API加载真实的行程数据
    console.log('加载行程数据');
}

// 加载收藏数据
function loadFavoritesData() {
    // 这里可以从API加载真实的收藏数据
    console.log('加载收藏数据');
}

// 加载成就数据
function loadAchievementsData() {
    // 这里可以从API加载真实的成就数据
    console.log('加载成就数据');
}

// 编辑头像
function editAvatar() {
    // 创建文件输入元素
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.querySelector('.user-avatar').src = e.target.result;
                showNotification('头像更新成功', 'success');
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

// 编辑资料
function editProfile() {
    showNotification('跳转到编辑资料页面...', 'info');
    // 这里可以跳转到编辑资料页面
}

// 分享主页
function shareProfile() {
    if (navigator.share) {
        navigator.share({
            title: '我的私途主页',
            text: '查看我的旅行分享',
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('主页链接已复制到剪贴板', 'success');
        });
    }
}

// 切换收藏状态
function toggleFavorite(button) {
    const isFavorited = button.classList.contains('favorited');
    
    if (isFavorited) {
        button.classList.remove('favorited');
        button.style.color = '#666';
        showNotification('已取消收藏', 'info');
    } else {
        button.classList.add('favorited');
        button.style.color = '#ff6b6b';
        showNotification('已添加到收藏', 'success');
    }
}

// 删除项目
function removeItem(button) {
    const item = button.closest('.favorite-item, .post-card, .itinerary-card');
    
    if (confirm('确定要删除这个项目吗？')) {
        item.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            item.remove();
            showNotification('已删除', 'success');
        }, 300);
    }
}

// 编辑帖子
function editPost() {
    showNotification('跳转到编辑帖子页面...', 'info');
}

// 删除帖子
function deletePost() {
    if (confirm('确定要删除这个帖子吗？')) {
        showNotification('帖子已删除', 'success');
    }
}

// 查看行程
function viewItinerary() {
    showNotification('跳转到行程详情页面...', 'info');
    // 这里可以跳转到行程详情页面
    setTimeout(() => {
        window.location.href = 'itinerary.html';
    }, 1000);
}

// 编辑行程
function editItinerary() {
    showNotification('跳转到编辑行程页面...', 'info');
    // 这里可以跳转到编辑行程页面
    setTimeout(() => {
        window.location.href = 'plan.html';
    }, 1000);
}

// 移除收藏
function removeFavorite() {
    if (confirm('确定要取消收藏吗？')) {
        showNotification('已取消收藏', 'success');
    }
}

// 打开设置
function openSettings(type) {
    const settingsMap = {
        'account': '账户设置',
        'privacy': '隐私设置',
        'notification': '通知设置'
    };
    
    showNotification(`跳转到${settingsMap[type]}页面...`, 'info');
}

// 退出登录
function logout() {
    if (confirm('确定要退出登录吗？')) {
        showNotification('已退出登录', 'success');
        // 这里可以清除用户数据并跳转到登录页面
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// 添加淡出动画
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
`;
document.head.appendChild(fadeOutStyle);

// 添加成就进度动画
function animateAchievementProgress() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

// 在切换到成就标签时触发动画
document.addEventListener('DOMContentLoaded', function() {
    const achievementsTab = document.querySelector('[data-tab="achievements"]');
    if (achievementsTab) {
        achievementsTab.addEventListener('click', function() {
            setTimeout(animateAchievementProgress, 300);
        });
    }
});

// 添加数据统计图表
function initializeCharts() {
    // 这里可以集成图表库，如Chart.js或ECharts
    console.log('初始化图表');
}

// 添加足迹地图
function initializeFootprintMap() {
    // 这里可以集成地图库，显示用户的旅行足迹
    console.log('初始化足迹地图');
}

// 添加无限滚动
function initializeInfiniteScroll() {
    const tabContent = document.querySelector('.tab-content.active');
    
    if (tabContent) {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadMoreContent();
                }
            });
        });
        
        const loadMoreTrigger = document.createElement('div');
        loadMoreTrigger.className = 'load-more-trigger';
        loadMoreTrigger.style.height = '20px';
        tabContent.appendChild(loadMoreTrigger);
        
        scrollObserver.observe(loadMoreTrigger);
    }
}

// 加载更多内容
function loadMoreContent() {
    showNotification('加载更多内容...', 'info');
    
    // 模拟加载
    setTimeout(() => {
        showNotification('已加载更多内容', 'success');
    }, 1000);
}

// 初始化无限滚动
document.addEventListener('DOMContentLoaded', function() {
    initializeInfiniteScroll();
});

// 添加搜索功能
function initializeSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '搜索我的内容...';
    searchInput.className = 'profile-search';
    
    const tabContent = document.querySelector('.tab-content.active');
    if (tabContent) {
        tabContent.insertBefore(searchInput, tabContent.firstChild);
    }
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const items = document.querySelectorAll('.post-card, .itinerary-card, .favorite-item, .achievement-card');
        
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            const matches = text.includes(query);
            item.style.display = matches ? 'block' : 'none';
        });
    });
}

// 初始化搜索
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
});

// 添加搜索框样式
const searchStyle = document.createElement('style');
searchStyle.textContent = `
    .profile-search {
        width: 100%;
        padding: 12px 16px;
        border: 1px solid #e1e5e9;
        border-radius: 8px;
        font-size: 14px;
        margin-bottom: 20px;
        transition: all 0.3s ease;
    }
    
    .profile-search:focus {
        outline: none;
        border-color: #3DB2FF;
        box-shadow: 0 0 0 3px rgba(61, 178, 255, 0.1);
    }
`;
document.head.appendChild(searchStyle);
