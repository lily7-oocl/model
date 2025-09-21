// 全局变量
let currentUser = null;
let selectedPreferences = ['文化古迹'];
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
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', function() {
            // 如果是多选模式，可以同时选择多个
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                selectedPreferences = selectedPreferences.filter(p => p !== this.textContent);
            } else {
                this.classList.add('active');
                selectedPreferences.push(this.textContent);
            }
            
            // 更新UI反馈
            updatePreferenceSelection();
        });
    });
}

// 初始化天数选择
function initializeDaysSelector() {
    const dayBtns = document.querySelectorAll('.day-btn');
    dayBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除其他按钮的active状态
            dayBtns.forEach(b => b.classList.remove('active'));
            // 添加当前按钮的active状态
            this.classList.add('active');
            // 更新选中的天数
            selectedDays = parseInt(this.textContent);
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
    const registerForm = document.querySelector('#registerModal form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

// 显示登录模态框
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.add('show');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// 显示注册模态框
function showRegisterModal() {
    const modal = document.getElementById('registerModal');
    modal.classList.add('show');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// 关闭模态框
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 开始AI规划
function startAIPlanning() {
    const destination = document.getElementById('destination').value.trim();
    
    if (!destination) {
        showNotification('请输入目的地', 'error');
        return;
    }
    
    if (selectedPreferences.length === 0) {
        showNotification('请选择至少一个旅行偏好', 'error');
        return;
    }
    
    // 显示加载状态
    showLoadingState();
    
    // 模拟AI规划过程
    setTimeout(() => {
        hideLoadingState();
        // 保存规划数据到localStorage
        const planningData = {
            destination: destination,
            preferences: selectedPreferences,
            days: selectedDays,
            startDate: new Date().toISOString().split('T')[0], // 默认今天开始
            people: 2 // 默认2人
        };
        localStorage.setItem('currentItinerary', JSON.stringify(planningData));
        
        // 直接跳转到行程页面
        window.location.href = 'itinerary.html';
    }, 2000);
}

// 显示加载状态
function showLoadingState() {
    const btn = document.querySelector('.btn-primary');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> AI正在规划中...';
    btn.disabled = true;
    
    // 保存原始状态以便恢复
    btn.dataset.originalText = originalText;
}

// 隐藏加载状态
function hideLoadingState() {
    const btn = document.querySelector('.btn-primary');
    btn.innerHTML = btn.dataset.originalText;
    btn.disabled = false;
}

// 更新偏好选择显示
function updatePreferenceSelection() {
    console.log('当前选择的偏好:', selectedPreferences);
}

// 处理登录
function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const phone = formData.get('phone') || e.target.querySelector('input[type="text"]').value;
    const password = formData.get('password') || e.target.querySelector('input[type="password"]').value;
    
    if (!phone || !password) {
        showNotification('请填写完整信息', 'error');
        return;
    }
    
    // 模拟登录请求
    showLoadingState();
    setTimeout(() => {
        hideLoadingState();
        currentUser = {
            id: 1,
            name: '用户' + Math.floor(Math.random() * 1000),
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
        };
        
        updateUserInterface();
        closeModal('loginModal');
        showNotification('登录成功！', 'success');
    }, 1500);
}

// 处理注册
function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const phone = formData.get('phone') || e.target.querySelector('input[type="tel"]').value;
    const verification = formData.get('verification') || e.target.querySelectorAll('input[type="text"]')[1].value;
    const password = formData.get('password') || e.target.querySelectorAll('input[type="password"]')[0].value;
    const confirmPassword = formData.get('confirmPassword') || e.target.querySelectorAll('input[type="password"]')[1].value;
    
    if (!phone || !verification || !password || !confirmPassword) {
        showNotification('请填写完整信息', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('两次输入的密码不一致', 'error');
        return;
    }
    
    // 模拟注册请求
    showLoadingState();
    setTimeout(() => {
        hideLoadingState();
        currentUser = {
            id: 1,
            name: '新用户' + Math.floor(Math.random() * 1000),
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
        };
        
        updateUserInterface();
        closeModal('registerModal');
        showNotification('注册成功！', 'success');
    }, 1500);
}

// 更新用户界面
function updateUserInterface() {
    const navActions = document.querySelector('.nav-actions');
    if (currentUser) {
        navActions.innerHTML = `
            <div class="user-menu">
                <img src="${currentUser.avatar}" alt="用户头像" class="user-avatar-small">
                <span>${currentUser.name}</span>
                <button class="btn-logout" onclick="logout()">退出</button>
            </div>
        `;
    }
}

// 登出
function logout() {
    currentUser = null;
    updateUserInterface();
    showNotification('已退出登录', 'info');
}

// 检查用户状态
function checkUserStatus() {
    // 这里可以从localStorage或cookie中获取用户信息
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserInterface();
    }
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
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
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
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// 获取通知颜色
function getNotificationColor(type) {
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196F3'
    };
    return colors[type] || '#2196F3';
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .user-menu {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .user-avatar-small {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
    }
    
    .btn-logout {
        background: #ff6b6b;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.3s ease;
    }
    
    .btn-logout:hover {
        background: #ff5252;
    }
`;
document.head.appendChild(style);

// 景点收藏功能
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn-favorite')) {
        const btn = e.target.closest('.btn-favorite');
        const isActive = btn.classList.contains('active');
        
        if (isActive) {
            btn.classList.remove('active');
            btn.style.color = '#666';
            showNotification('已取消收藏', 'info');
        } else {
            btn.classList.add('active');
            btn.style.color = '#ff6b6b';
            showNotification('已添加到收藏', 'success');
        }
    }
});

// 帖子互动功能
document.addEventListener('click', function(e) {
    if (e.target.closest('.action-btn')) {
        const btn = e.target.closest('.action-btn');
        const action = btn.textContent.trim();
        
        if (action.includes('关注')) {
            btn.textContent = '已关注';
            btn.style.background = '#4CAF50';
            btn.style.color = 'white';
            showNotification('关注成功', 'success');
        } else if (action.includes('分享')) {
            showNotification('分享链接已复制到剪贴板', 'success');
        }
    }
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 页面滚动时的导航栏效果
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// 保存用户状态到localStorage
function saveUserState() {
    if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
        localStorage.removeItem('currentUser');
    }
}

// 监听用户状态变化
const originalLogout = logout;
logout = function() {
    originalLogout();
    saveUserState();
};

// 页面卸载时保存状态
window.addEventListener('beforeunload', saveUserState);
