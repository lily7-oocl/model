// 行程页面专用JavaScript

let map;
let currentAttraction = null;
let attractionMarkers = [];
let routePolyline = null;

// 景点数据
const attractionsData = {
    '天安门广场': {
        lat: 39.9042,
        lng: 116.4074,
        name: '天安门广场',
        description: '天安门广场是北京市中心的一个大型城市广场，位于天安门城楼前。广场北起天安门，南至正阳门，东起中国国家博物馆，西至人民大会堂，南北长880米，东西宽500米，面积达44万平方米，可容纳100万人举行盛大集会。',
        rating: 4.8,
        duration: '1-2小时',
        ticket: '免费',
        address: '北京市东城区东长安街',
        image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&h=200&fit=crop'
    },
    '故宫博物院': {
        lat: 39.9163,
        lng: 116.3972,
        name: '故宫博物院',
        description: '故宫博物院是中国明清两朝的皇家宫殿，旧称紫禁城，位于北京中轴线的中心。故宫以三大殿为中心，占地面积约72万平方米，建筑面积约15万平方米，有大小宫殿七十多座，房屋九千余间。',
        rating: 4.9,
        duration: '3-4小时',
        ticket: '60元',
        address: '北京市东城区景山前街4号',
        image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=200&fit=crop'
    },
    '景山公园': {
        lat: 39.9256,
        lng: 116.3972,
        name: '景山公园',
        description: '景山公园位于北京市西城区景山前街，坐落在明清北京城的中轴线上，西临北海，南与故宫神武门隔街相望，是明、清两代的御苑。公园中心的景山为堆土而成，曾是全城的制高点。',
        rating: 4.6,
        duration: '1-2小时',
        ticket: '2元',
        address: '北京市西城区景山西街44号',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop'
    },
    '天坛公园': {
        lat: 39.8823,
        lng: 116.4066,
        name: '天坛公园',
        description: '天坛公园是明清两朝皇帝祭天、祈谷的场所，位于北京市东城区永定门内大街东侧。天坛始建于明永乐十八年（1420年），清乾隆、光绪时曾重修改建。现为世界文化遗产。',
        rating: 4.7,
        duration: '2-3小时',
        ticket: '15元',
        address: '北京市东城区天坛路甲1号',
        image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&h=200&fit=crop'
    },
    '前门大街': {
        lat: 39.8998,
        lng: 116.3974,
        name: '前门大街',
        description: '前门大街是北京著名的商业街，位于京城中轴线，北起前门月亮湾，南至天桥路口，与天桥南大街相连。前门大街是北京历史上著名的商业街，也是北京最古老的商业街之一。',
        rating: 4.5,
        duration: '2-3小时',
        ticket: '免费',
        address: '北京市东城区前门大街',
        image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=200&fit=crop'
    },
    '王府井': {
        lat: 39.9097,
        lng: 116.4134,
        name: '王府井',
        description: '王府井大街是北京著名的商业街，位于北京市东城区，南起东长安街，北至中国美术馆，全长约1.8公里。王府井大街是北京最著名的商业街之一，也是北京最古老的商业街之一。',
        rating: 4.4,
        duration: '3-4小时',
        ticket: '免费',
        address: '北京市东城区王府井大街',
        image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&h=200&fit=crop'
    },
    '颐和园': {
        lat: 39.9999,
        lng: 116.2755,
        name: '颐和园',
        description: '颐和园是中国古典园林之首，世界文化遗产，全国重点文物保护单位，中国四大名园之一。颐和园位于北京市海淀区，距北京城区十五公里，占地约二百九十公顷。',
        rating: 4.8,
        duration: '3-4小时',
        ticket: '30元',
        address: '北京市海淀区新建宫门路19号',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop'
    },
    '圆明园': {
        lat: 40.0083,
        lng: 116.2975,
        name: '圆明园',
        description: '圆明园是清代大型皇家园林，由圆明园、长春园和绮春园组成，所以也叫圆明三园。圆明园不仅以园林著称，而且也是一座收藏相当丰富的皇家博物馆。',
        rating: 4.6,
        duration: '2-3小时',
        ticket: '10元',
        address: '北京市海淀区清华西路28号',
        image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&h=200&fit=crop'
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeItineraryPage();
});

// 初始化行程页面
function initializeItineraryPage() {
    // 初始化地图
    initializeMap();
    
    // 加载行程数据
    loadItineraryData();
    
    // 初始化事件监听器
    initializeEventListeners();
    
    // 默认展开第一天
    toggleDay(1);
}

// 初始化地图
function initializeMap() {
    // 创建地图实例
    map = L.map('map').setView([39.9042, 116.4074], 11);
    
    // 添加地图图层
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // 添加景点标记
    addAttractionMarkers();
    
    // 绘制路线
    drawRoute();
}

// 添加景点标记
function addAttractionMarkers() {
    const attractions = Object.values(attractionsData);
    
    attractions.forEach((attraction, index) => {
        const marker = L.marker([attraction.lat, attraction.lng], {
            icon: L.divIcon({
                className: 'attraction-marker',
                html: `<div style="background: #3DB2FF; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">${index + 1}</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            })
        }).addTo(map);
        
        // 添加点击事件
        marker.on('click', function() {
            showAttractionDetails(attraction.name);
            highlightTimelineItem(attraction.name);
        });
        
        attractionMarkers.push(marker);
    });
}

// 绘制路线
function drawRoute() {
    const attractions = Object.values(attractionsData);
    const coordinates = attractions.map(attraction => [attraction.lat, attraction.lng]);
    
    routePolyline = L.polyline(coordinates, {
        color: '#3DB2FF',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 5'
    }).addTo(map);
    
    // 调整地图视野以显示所有景点
    const group = new L.featureGroup(attractionMarkers);
    map.fitBounds(group.getBounds().pad(0.1));
}

// 显示景点详情
function showAttractionDetails(attractionName) {
    const attraction = attractionsData[attractionName];
    if (!attraction) return;
    
    currentAttraction = attraction;
    
    // 更新详情卡片内容
    document.getElementById('attractionName').textContent = attraction.name;
    document.getElementById('attractionImage').src = attraction.image;
    document.getElementById('attractionDescription').textContent = attraction.description;
    
    // 更新景点信息
    const infoItems = document.querySelectorAll('.attraction-info .info-item');
    if (infoItems.length >= 4) {
        infoItems[0].innerHTML = `<i class="fas fa-star"></i><span>评分：${attraction.rating}/5.0</span>`;
        infoItems[1].innerHTML = `<i class="fas fa-clock"></i><span>建议游览时间：${attraction.duration}</span>`;
        infoItems[2].innerHTML = `<i class="fas fa-ticket-alt"></i><span>门票：${attraction.ticket}</span>`;
        infoItems[3].innerHTML = `<i class="fas fa-map-marker-alt"></i><span>地址：${attraction.address}</span>`;
    }
    
    // 显示详情卡片
    const detailsCard = document.getElementById('attractionDetails');
    detailsCard.classList.add('show');
    
    // 高亮对应的地图标记
    highlightMapMarker(attractionName);
}

// 关闭景点详情
function closeAttractionDetails() {
    const detailsCard = document.getElementById('attractionDetails');
    detailsCard.classList.remove('show');
    currentAttraction = null;
}

// 高亮地图标记
function highlightMapMarker(attractionName) {
    // 重置所有标记
    attractionMarkers.forEach(marker => {
        marker.getElement().style.background = '#3DB2FF';
        marker.getElement().style.transform = 'scale(1)';
    });
    
    // 高亮当前标记
    const attraction = attractionsData[attractionName];
    if (attraction) {
        const targetMarker = attractionMarkers.find(marker => 
            marker.getLatLng().lat === attraction.lat && 
            marker.getLatLng().lng === attraction.lng
        );
        
        if (targetMarker) {
            targetMarker.getElement().style.background = '#FFBD39';
            targetMarker.getElement().style.transform = 'scale(1.2)';
        }
    }
}

// 高亮时间轴项目
function highlightTimelineItem(attractionName) {
    // 重置所有时间轴项目
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.style.background = 'transparent';
    });
    
    // 高亮当前项目
    const targetItem = document.querySelector(`[data-attraction="${attractionName}"]`);
    if (targetItem) {
        targetItem.style.background = 'rgba(61, 178, 255, 0.1)';
        
        // 滚动到该项目
        targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// 切换日期展开/收起
function toggleDay(dayNumber) {
    const dayElement = document.querySelector(`[data-day="${dayNumber}"]`);
    const isActive = dayElement.classList.contains('active');
    
    // 关闭所有其他日期
    document.querySelectorAll('.timeline-day').forEach(day => {
        day.classList.remove('active');
    });
    
    // 切换当前日期
    if (!isActive) {
        dayElement.classList.add('active');
    }
}

// 切换时间轴视图
function toggleTimelineView() {
    const timelineContainer = document.querySelector('.timeline-container');
    const isCompact = timelineContainer.classList.contains('compact');
    
    if (isCompact) {
        timelineContainer.classList.remove('compact');
    } else {
        timelineContainer.classList.add('compact');
    }
}

// 展开所有日期
function expandAllDays() {
    document.querySelectorAll('.timeline-day').forEach(day => {
        day.classList.add('active');
    });
}

// 切换地图视图
function toggleMapView() {
    // 这里可以切换不同的地图图层
    showNotification('地图视图已切换', 'info');
}

// 居中地图
function centerMap() {
    if (routePolyline) {
        map.fitBounds(routePolyline.getBounds().pad(0.1));
    }
}

// 查看景点详情
function viewAttractionDetails(attractionName) {
    showAttractionDetails(attractionName);
}

// 导航到景点
function navigateToAttraction(attractionName) {
    const attraction = attractionsData[attractionName];
    if (attraction) {
        // 这里可以集成真实的导航服务
        showNotification(`正在为您导航到${attractionName}...`, 'info');
        
        // 模拟导航
        setTimeout(() => {
            showNotification('导航已启动', 'success');
        }, 1000);
    }
}

// 添加到收藏
function addToFavorites() {
    if (currentAttraction) {
        showNotification(`已将${currentAttraction.name}添加到收藏`, 'success');
    }
}

// 分享行程
function shareItinerary() {
    if (navigator.share) {
        navigator.share({
            title: '我的私途行程',
            text: '查看我的北京三日游行程',
            url: window.location.href
        });
    } else {
        // 复制链接到剪贴板
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('行程链接已复制到剪贴板', 'success');
        });
    }
}

// 编辑行程
function editItinerary() {
    showNotification('跳转到编辑页面...', 'info');
    // 这里可以跳转到编辑页面
    setTimeout(() => {
        window.location.href = 'plan.html';
    }, 1000);
}

// 下载行程
function downloadItinerary() {
    showNotification('正在生成行程PDF...', 'info');
    
    // 模拟PDF生成
    setTimeout(() => {
        showNotification('行程PDF已生成并开始下载', 'success');
    }, 2000);
}

// 加载行程数据
function loadItineraryData() {
    // 从localStorage获取行程数据
    const savedItinerary = localStorage.getItem('currentItinerary');
    if (savedItinerary) {
        const itineraryData = JSON.parse(savedItinerary);
        updateItineraryInfo(itineraryData);
        generateItineraryContent(itineraryData);
    }
}

// 更新行程信息
function updateItineraryInfo(data) {
    if (data.destination) {
        document.getElementById('tripTitle').textContent = `${data.destination}${data.days}日游`;
    }
    
    if (data.startDate && data.days) {
        const startDate = new Date(data.startDate);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + data.days - 1);
        
        const startStr = startDate.toLocaleDateString('zh-CN');
        const endStr = endDate.toLocaleDateString('zh-CN');
        
        document.getElementById('tripDateRange').textContent = `${startStr} 至 ${endStr}`;
        document.getElementById('tripDuration').textContent = `${data.days}天${data.days - 1}夜`;
    }
    
    if (data.people) {
        document.getElementById('tripPeople').textContent = `${data.people}人`;
    }
}

// 生成行程内容
function generateItineraryContent(data) {
    // 根据目的地和偏好生成行程
    const itinerary = generateSampleItinerary(data.destination, data.days, data.preferences);
    
    // 更新每日安排显示
    updateDailySchedule(itinerary, data.startDate);
    
    // 更新地图标记
    updateMapMarkers(itinerary);
}

// 生成示例行程
function generateSampleItinerary(destination, days, preferences) {
    // 根据目的地生成不同的行程
    const cityItineraries = {
        '北京': [
            { name: '天安门广场', time: '09:00', duration: '1小时', lat: 39.9042, lng: 116.4074 },
            { name: '故宫博物院', time: '10:30', duration: '3小时', lat: 39.9163, lng: 116.3972 },
            { name: '景山公园', time: '14:00', duration: '1小时', lat: 39.9256, lng: 116.3972 },
            { name: '天坛公园', time: '09:00', duration: '2小时', lat: 39.8823, lng: 116.4066 },
            { name: '前门大街', time: '12:00', duration: '2小时', lat: 39.8998, lng: 116.3974 },
            { name: '王府井', time: '15:00', duration: '3小时', lat: 39.9097, lng: 116.4134 },
            { name: '颐和园', time: '09:00', duration: '3小时', lat: 39.9999, lng: 116.2755 },
            { name: '圆明园', time: '13:00', duration: '3小时', lat: 40.0083, lng: 116.2975 }
        ],
        '上海': [
            { name: '外滩', time: '09:00', duration: '2小时', lat: 31.2397, lng: 121.4999 },
            { name: '南京路步行街', time: '11:00', duration: '2小时', lat: 31.2359, lng: 121.4737 },
            { name: '豫园', time: '14:00', duration: '2小时', lat: 31.2277, lng: 121.4917 },
            { name: '东方明珠', time: '09:00', duration: '2小时', lat: 31.2397, lng: 121.4999 },
            { name: '上海博物馆', time: '11:00', duration: '2小时', lat: 31.2277, lng: 121.4917 },
            { name: '田子坊', time: '14:00', duration: '2小时', lat: 31.2277, lng: 121.4917 }
        ],
        '杭州': [
            { name: '西湖', time: '09:00', duration: '3小时', lat: 30.2741, lng: 120.1551 },
            { name: '断桥残雪', time: '12:00', duration: '1小时', lat: 30.2741, lng: 120.1551 },
            { name: '雷峰塔', time: '14:00', duration: '2小时', lat: 30.2741, lng: 120.1551 },
            { name: '灵隐寺', time: '09:00', duration: '2小时', lat: 30.2741, lng: 120.1551 },
            { name: '飞来峰', time: '11:00', duration: '1小时', lat: 30.2741, lng: 120.1551 },
            { name: '龙井村', time: '14:00', duration: '2小时', lat: 30.2741, lng: 120.1551 }
        ]
    };
    
    const attractions = cityItineraries[destination] || cityItineraries['北京'];
    const dailyAttractions = Math.ceil(attractions.length / days);
    
    const itinerary = [];
    for (let day = 1; day <= days; day++) {
        const dayAttractions = attractions.slice((day - 1) * dailyAttractions, day * dailyAttractions);
        itinerary.push({
            day: day,
            attractions: dayAttractions
        });
    }
    
    return itinerary;
}

// 更新每日安排显示
function updateDailySchedule(itinerary, startDate) {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;
    
    // 清空现有内容
    timeline.innerHTML = '';
    
    itinerary.forEach((dayData, index) => {
        const dayElement = document.createElement('div');
        dayElement.className = `timeline-day ${index === 0 ? 'active' : ''}`;
        dayElement.setAttribute('data-day', dayData.day);
        
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + index);
        
        const dayTitle = dayData.attractions.map(att => att.name).join(' → ');
        const totalDuration = dayData.attractions.reduce((total, att) => {
            return total + parseInt(att.duration);
        }, 0);
        
        dayElement.innerHTML = `
            <div class="day-header" onclick="toggleDay(${dayData.day})">
                <div class="day-info">
                    <span class="day-number">第${dayData.day}天</span>
                    <span class="day-date">${currentDate.toLocaleDateString('zh-CN')}</span>
                </div>
                <div class="day-summary">
                    <span class="day-title">${dayTitle}</span>
                    <span class="day-duration">${totalDuration}小时</span>
                </div>
                <i class="fas fa-chevron-down day-toggle"></i>
            </div>
            
            <div class="day-content">
                ${dayData.attractions.map((attraction, attIndex) => `
                    <div class="timeline-item" data-attraction="${attraction.name}">
                        <div class="item-time">${attraction.time}</div>
                        <div class="item-marker">
                            <div class="marker-dot"></div>
                            ${attIndex < dayData.attractions.length - 1 ? '<div class="marker-line"></div>' : ''}
                        </div>
                        <div class="item-content">
                            <div class="item-title">${attraction.name}</div>
                            <div class="item-description">根据您的偏好精心挑选的景点</div>
                            <div class="item-duration">预计停留：${attraction.duration}</div>
                            <div class="item-actions">
                                <button class="btn-small" onclick="viewAttractionDetails('${attraction.name}')">
                                    <i class="fas fa-info-circle"></i>
                                    详情
                                </button>
                                <button class="btn-small" onclick="navigateToAttraction('${attraction.name}')">
                                    <i class="fas fa-directions"></i>
                                    导航
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        timeline.appendChild(dayElement);
    });
}

// 更新地图标记
function updateMapMarkers(itinerary) {
    // 清除现有标记
    attractionMarkers.forEach(marker => map.removeLayer(marker));
    attractionMarkers = [];
    
    // 添加新标记
    const allAttractions = [];
    itinerary.forEach(day => {
        day.attractions.forEach(attraction => {
            allAttractions.push(attraction);
        });
    });
    
    allAttractions.forEach((attraction, index) => {
        const marker = L.marker([attraction.lat, attraction.lng], {
            icon: L.divIcon({
                className: 'attraction-marker',
                html: `<div style="background: #3DB2FF; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">${index + 1}</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            })
        }).addTo(map);
        
        marker.on('click', function() {
            showAttractionDetails(attraction.name);
            highlightTimelineItem(attraction.name);
        });
        
        attractionMarkers.push(marker);
    });
    
    // 绘制路线
    if (routePolyline) {
        map.removeLayer(routePolyline);
    }
    
    const coordinates = allAttractions.map(attraction => [attraction.lat, attraction.lng]);
    routePolyline = L.polyline(coordinates, {
        color: '#3DB2FF',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 5'
    }).addTo(map);
    
    // 调整地图视野
    if (coordinates.length > 0) {
        const group = new L.featureGroup(attractionMarkers);
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

// 初始化事件监听器
function initializeEventListeners() {
    // 时间轴项目点击事件
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.addEventListener('click', function() {
            const attractionName = this.dataset.attraction;
            if (attractionName) {
                showAttractionDetails(attractionName);
                highlightMapMarker(attractionName);
            }
        });
    });
    
    // 地图点击事件
    map.on('click', function() {
        closeAttractionDetails();
    });
}

// 添加紧凑视图样式
const compactStyle = document.createElement('style');
compactStyle.textContent = `
    .timeline-container.compact .day-content {
        display: none !important;
    }
    
    .timeline-container.compact .timeline-day.active .day-content {
        display: block !important;
    }
    
    .timeline-container.compact .timeline-day {
        border-bottom: 1px solid #e1e5e9;
    }
    
    .timeline-container.compact .day-header {
        padding: 12px 24px;
    }
`;
document.head.appendChild(compactStyle);

// 添加景点标记样式
const markerStyle = document.createElement('style');
markerStyle.textContent = `
    .attraction-marker {
        background: #3DB2FF;
        color: white;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .attraction-marker:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    
    .attraction-marker.active {
        background: #FFBD39;
        transform: scale(1.2);
    }
`;
document.head.appendChild(markerStyle);
