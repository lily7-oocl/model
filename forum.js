// 论坛页面专用JavaScript

let currentFilter = 'all';
let currentSort = 'latest';
let postsData = [];

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeForumPage();
});

// 初始化论坛页面
function initializeForumPage() {
    // 初始化事件监听器
    initializeEventListeners();
    
    // 加载帖子数据
    loadPostsData();
    
    // 初始化筛选和排序
    initializeFilters();
}

// 初始化事件监听器
function initializeEventListeners() {
    // 筛选标签点击事件
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.dataset.filter;
            setActiveFilter(filter);
            filterPosts(filter);
        });
    });
    
    // 排序选择事件
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            sortPosts(currentSort);
        });
    }
    
    // 关注按钮点击事件
    document.querySelectorAll('.btn-follow, .btn-follow-small').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleFollow(this);
        });
    });
    
    // 图片点击事件
    document.querySelectorAll('.post-images img').forEach(img => {
        img.addEventListener('click', function() {
            showImageModal(this.src);
        });
    });
    
    // 标签点击事件
    document.querySelectorAll('.tag, .tag-suggestion').forEach(tag => {
        tag.addEventListener('click', function() {
            const tagText = this.textContent.replace('#', '');
            searchByTag(tagText);
        });
    });
}

// 初始化筛选器
function initializeFilters() {
    // 设置默认筛选
    setActiveFilter('all');
}

// 设置活动筛选器
function setActiveFilter(filter) {
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    currentFilter = filter;
}

// 筛选帖子
function filterPosts(filter) {
    const posts = document.querySelectorAll('.post-card');
    
    posts.forEach(post => {
        let shouldShow = true;
        
        switch(filter) {
            case 'hot':
                // 显示热门帖子（点赞数大于1000）
                const likes = post.querySelector('.stat-item:last-child');
                if (likes) {
                    const likeCount = parseInt(likes.textContent.replace(/[^\d]/g, ''));
                    shouldShow = likeCount > 1000;
                }
                break;
            case 'latest':
                // 显示最新帖子（时间小于24小时）
                const time = post.querySelector('.post-time');
                if (time) {
                    const timeText = time.textContent;
                    shouldShow = timeText.includes('小时前') || timeText.includes('分钟前');
                }
                break;
            case 'followed':
                // 显示关注的用户帖子
                const user = post.querySelector('.user-details h4');
                if (user) {
                    shouldShow = user.textContent.includes('旅行达人') || user.textContent.includes('美食探索者');
                }
                break;
            default:
                shouldShow = true;
        }
        
        post.style.display = shouldShow ? 'block' : 'none';
    });
}

// 排序帖子
function sortPosts(sortBy) {
    const postsList = document.querySelector('.posts-list');
    const posts = Array.from(document.querySelectorAll('.post-card'));
    
    posts.sort((a, b) => {
        switch(sortBy) {
            case 'popular':
                const likesA = parseInt(a.querySelector('.stat-item:last-child')?.textContent.replace(/[^\d]/g, '') || 0);
                const likesB = parseInt(b.querySelector('.stat-item:last-child')?.textContent.replace(/[^\d]/g, '') || 0);
                return likesB - likesA;
            case 'comments':
                const commentsA = parseInt(a.querySelector('.stat-item:nth-child(2)')?.textContent.replace(/[^\d]/g, '') || 0);
                const commentsB = parseInt(b.querySelector('.stat-item:nth-child(2)')?.textContent.replace(/[^\d]/g, '') || 0);
                return commentsB - commentsA;
            case 'latest':
            default:
                return 0; // 保持原有顺序
        }
    });
    
    // 重新排列帖子
    posts.forEach(post => {
        postsList.appendChild(post);
    });
}

// 切换关注状态
function toggleFollow(button) {
    const isFollowing = button.textContent === '已关注';
    
    if (isFollowing) {
        button.textContent = '关注';
        button.style.background = '#3DB2FF';
        showNotification('已取消关注', 'info');
    } else {
        button.textContent = '已关注';
        button.style.background = '#4CAF50';
        showNotification('关注成功', 'success');
    }
}

// 切换点赞状态
function toggleLike(button) {
    const isLiked = button.classList.contains('liked');
    
    if (isLiked) {
        button.classList.remove('liked');
        button.innerHTML = '<i class="fas fa-heart"></i> 点赞';
        showNotification('已取消点赞', 'info');
    } else {
        button.classList.add('liked');
        button.innerHTML = '<i class="fas fa-heart"></i> 已点赞';
        showNotification('点赞成功', 'success');
    }
}

// 显示评论模态框
function showCommentModal() {
    const modal = document.getElementById('commentModal');
    modal.classList.add('show');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// 分享帖子
function sharePost() {
    if (navigator.share) {
        navigator.share({
            title: '私途旅游论坛',
            text: '查看这个有趣的旅游分享',
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('帖子链接已复制到剪贴板', 'success');
        });
    }
}

// 显示发布帖子模态框
function showCreatePostModal() {
    const modal = document.getElementById('createPostModal');
    modal.classList.add('show');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// 显示图片模态框
function showImageModal(imageSrc) {
    // 创建图片查看器
    const imageViewer = document.createElement('div');
    imageViewer.className = 'image-viewer';
    imageViewer.innerHTML = `
        <div class="image-viewer-content">
            <img src="${imageSrc}" alt="查看图片">
            <button class="close-image-viewer" onclick="closeImageViewer()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // 添加样式
    imageViewer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(imageViewer);
    document.body.style.overflow = 'hidden';
}

// 关闭图片查看器
function closeImageViewer() {
    const imageViewer = document.querySelector('.image-viewer');
    if (imageViewer) {
        imageViewer.remove();
        document.body.style.overflow = 'auto';
    }
}

// 按标签搜索
function searchByTag(tag) {
    showNotification(`正在搜索标签: ${tag}`, 'info');
    
    // 这里可以实现实际的搜索逻辑
    setTimeout(() => {
        showNotification(`找到 ${Math.floor(Math.random() * 50) + 10} 个相关帖子`, 'success');
    }, 1000);
}

// 加载更多帖子
function loadMorePosts() {
    const button = document.querySelector('.btn-load-more');
    const originalText = button.innerHTML;
    
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载中...';
    button.disabled = true;
    
    // 模拟加载
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
        showNotification('已加载更多帖子', 'success');
    }, 2000);
}

// 加载帖子数据
function loadPostsData() {
    // 这里可以从API加载真实的帖子数据
    postsData = [
        {
            id: 1,
            title: '北京三日游完美攻略，避开人山人海！',
            content: '分享一个避开人流的北京三日游路线，包含故宫、天坛、颐和园等经典景点，还有隐藏的美食推荐...',
            author: '旅行达人小王',
            time: '2小时前',
            likes: 1200,
            comments: 89,
            views: 1200,
            tags: ['北京旅游', '故宫', '美食推荐'],
            images: [
                'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=300&h=200&fit=crop',
                'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=300&h=200&fit=crop',
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop'
            ]
        }
    ];
}

// 添加图片查看器样式
const imageViewerStyle = document.createElement('style');
imageViewerStyle.textContent = `
    .image-viewer-content {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
    }
    
    .image-viewer-content img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 8px;
    }
    
    .close-image-viewer {
        position: absolute;
        top: -40px;
        right: 0;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 18px;
        color: #333;
        transition: all 0.3s ease;
    }
    
    .close-image-viewer:hover {
        background: white;
        transform: scale(1.1);
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(imageViewerStyle);

// 添加点击外部关闭图片查看器
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('image-viewer')) {
        closeImageViewer();
    }
});

// 添加键盘事件
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeImageViewer();
    }
});

// 添加图片懒加载
function initializeLazyLoading() {
    const images = document.querySelectorAll('.post-images img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                
                img.onload = () => {
                    img.style.opacity = '1';
                };
                
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// 初始化懒加载
document.addEventListener('DOMContentLoaded', function() {
    initializeLazyLoading();
});

// 添加无限滚动
function initializeInfiniteScroll() {
    const postsList = document.querySelector('.posts-list');
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadMorePosts();
            }
        });
    });
    
    const loadMoreButton = document.querySelector('.load-more');
    if (loadMoreButton) {
        scrollObserver.observe(loadMoreButton);
    }
}

// 初始化无限滚动
document.addEventListener('DOMContentLoaded', function() {
    initializeInfiniteScroll();
});

// 添加帖子搜索功能
function initializeSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '搜索帖子...';
    searchInput.className = 'search-input';
    
    const filterBar = document.querySelector('.filter-bar');
    if (filterBar) {
        filterBar.appendChild(searchInput);
    }
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const posts = document.querySelectorAll('.post-card');
        
        posts.forEach(post => {
            const title = post.querySelector('h3').textContent.toLowerCase();
            const content = post.querySelector('p').textContent.toLowerCase();
            const tags = Array.from(post.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            
            const matches = title.includes(query) || 
                          content.includes(query) || 
                          tags.some(tag => tag.includes(query));
            
            post.style.display = matches ? 'block' : 'none';
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
    .search-input {
        background: white;
        border: 1px solid #e1e5e9;
        color: #666;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 14px;
        width: 200px;
        transition: all 0.3s ease;
    }
    
    .search-input:focus {
        outline: none;
        border-color: #3DB2FF;
        box-shadow: 0 0 0 3px rgba(61, 178, 255, 0.1);
    }
    
    @media (max-width: 768px) {
        .search-input {
            width: 100%;
            margin-top: 12px;
        }
    }
`;
document.head.appendChild(searchStyle);
