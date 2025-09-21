// 全局变量
let currentUser = null;
let selectedPreferences = ['culture'];
let selectedDays = 3;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化应用
function initializeApp() {
    // 初始化导航栏
    initializeNavigation();
    
    // 初始化偏好选择
    initializePreferences();
    
    // 初始化天数选择
    initializeDaysSelector();
    
    // 初始化模态框
    initializeModals();
    
    // 检查用户登录状态
    checkUserStatus();

    // 初始化收藏功能
    initializeFavorites();

    // 初始化分享互动
    initializeShareInteractions();
}

// 初始化导航栏
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// 初始化偏好选择
function initializePreferences() {
    const preferenceItems = document.querySelectorAll('.preference-item');
    preferenceItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除其他项的active状态
            preferenceItems.forEach(p => p.classList.remove('active'));
            // 添加当前项的active状态
            this.classList.add('active');

            // 更新选中的偏好
            selectedPreferences = [this.getAttribute('data-type')];

            // 添加点击反馈动画
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// 初始化天数选择
function initializeDaysSelector() {
    const dayOptions = document.querySelectorAll('.day-option');
    dayOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 移除其他选项的active状态
            dayOptions.forEach(d => d.classList.remove('active'));
            // 添加当前选项的active状态
            this.classList.add('active');

            // 更新选中的天数
            selectedDays = parseInt(this.getAttribute('data-days'));

            // 添加点击反馈动画
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// 初始化模态框
function initializeModals() {
    // 点击模态框背景关闭
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
    
    // 表单提交处理
    const loginForm = document.querySelector('#loginModal form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

// 初始化收藏功能
function initializeFavorites() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();

            const icon = this.querySelector('i');
            if (this.classList.contains('favorited')) {
                // 取消收藏
                this.classList.remove('favorited');
                this.style.background = 'rgba(255, 255, 255, 0.9)';
                this.style.color = '#666';
                showNotification('已取消收藏', 'info');
            } else {
                // 添加收藏
                this.classList.add('favorited');
                this.style.background = '#ff5722';
                this.style.color = 'white';
                showNotification('已添加到收藏', 'success');

                // 收藏动画
                this.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            }
        });
    });
}

// 初始化分享互动
function initializeShareInteractions() {
    // 关注按钮
    const followButtons = document.querySelectorAll('.follow-btn');
    followButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent.trim() === '关注') {
                this.textContent = '已关注';
                this.style.background = '#4caf50';
                showNotification('关注成功', 'success');
            } else {
                this.textContent = '关注';
                this.style.background = '#42a5f5';
                showNotification('已取消关注', 'info');
            }
        });
    });

    // 互动按钮
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();

            const icon = this.querySelector('i');
            const span = this.querySelector('span');

            if (icon.classList.contains('fa-heart')) {
                // 点赞功能
                if (this.classList.contains('liked')) {
                    this.classList.remove('liked');
                    icon.style.color = '#666';
                    let count = parseInt(span.textContent.replace(/[^\d]/g, ''));
                    span.textContent = formatNumber(count - 1);
                } else {
                    this.classList.add('liked');
                    icon.style.color = '#ff5722';
                    let count = parseInt(span.textContent.replace(/[^\d]/g, ''));
                    span.textContent = formatNumber(count + 1);

                    // 点赞动画
                    this.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 200);
                }
            } else if (icon.classList.contains('fa-share')) {
                // 分享功能
                showNotification('分享链接已复制到剪贴板', 'success');
            }
        });
    });
}

// 格式化数字显示
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

// AI规划功能
function startAIPlanning() {
    const destination = document.getElementById('destination').value.trim();

    if (!destination) {
        showNotification('请输入目的地', 'warning');
        return;
    }

    if (selectedPreferences.length === 0) {
        showNotification('请选择旅行偏好', 'warning');
        return;
    }

    // 显示加载状态
    const button = document.querySelector('.ai-plan-btn');
    const originalContent = button.innerHTML;

    button.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        AI正在规划中...
    `;
    button.disabled = true;

    // 模拟AI规划过程
    setTimeout(() => {
        // 构建跳转URL参数
        const params = new URLSearchParams({
            destination: destination,
            days: selectedDays,
            preferences: selectedPreferences.join(',')
        });

        // 跳转到行程页面
        window.location.href = `itinerary.html?${params.toString()}`;
    }, 2000);
}

// 显示登录模态框
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 关闭模态框
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 处理登录
function handleLogin(e) {
    e.preventDefault();
    
    const phone = e.target.querySelector('input[type="text"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    if (!phone || !password) {
        showNotification('请填写完整的登录信息', 'warning');
        return;
    }
    
    // 模拟登录过程
    showNotification('登录中...', 'info');

    setTimeout(() => {
        currentUser = {
            id: 1,
            username: phone,
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
        };
        
        updateUserStatus();
        closeModal('loginModal');
        showNotification('登录成功！', 'success');
    }, 1500);
}

// 检查用户登录状态
function checkUserStatus() {
    // 从localStorage检查用户状态
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserStatus();
    }
}

// 更新用户状态显示
function updateUserStatus() {
    const navActions = document.querySelector('.nav-actions');

    if (currentUser) {
        navActions.innerHTML = `
            <div class="user-profile">
                <img src="${currentUser.avatar}" alt="用户头像" class="user-avatar-nav">
                <span>${currentUser.username}</span>
                <button class="btn-logout" onclick="logout()">退出</button>
            </div>
        `;

        // 保存到localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
        navActions.innerHTML = `
            <span class="user-info">用户囤p650</span>
            <button class="btn-register">签到</button>
        `;
    }
}

// 退出登录
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserStatus();
    showNotification('已退出登录', 'info');
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // 添加样式
    Object.assign(notification.style, {
        position: 'fixed',
        top: '80px',
        right: '20px',
        background: getNotificationColor(type),
        color: 'white',
        padding: '16px 20px',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        fontSize: '14px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    });

    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // 自动隐藏
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 获取通知图标
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle',
        error: 'times-circle'
    };
    return icons[type] || 'info-circle';
}

// 获取通知颜色
function getNotificationColor(type) {
    const colors = {
        success: 'rgba(76, 175, 80, 0.9)',
        warning: 'rgba(255, 193, 7, 0.9)',
        info: 'rgba(33, 150, 243, 0.9)',
        error: 'rgba(244, 67, 54, 0.9)'
    };
    return colors[type] || 'rgba(33, 150, 243, 0.9)';
}

// 添加用户头像样式
const additionalStyles = `
    .user-profile {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #666;
        font-size: 14px;
    }
    
    .user-avatar-nav {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        object-fit: cover;
    }
    
    .btn-logout {
        background: #ff5722;
        color: white;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .btn-logout:hover {
        background: #f4511e;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
`;

// 将样式添加到页面
const styleElement = document.createElement('style');
styleElement.textContent = additionalStyles;
document.head.appendChild(styleElement);
