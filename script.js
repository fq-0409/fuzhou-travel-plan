// 高德地图初始化
function initMap() {
    // 检查API密钥是否已设置
    if (typeof AMap === 'undefined') {
        document.getElementById('map').innerHTML = 
            '<div style="padding: 20px; text-align: center; color: #856404; background-color: #fff3cd; border-radius: 8px;">' +
            '<h3>地图加载失败</h3>' +
            '<p>请检查高德地图API密钥是否正确配置。</p>' +
            '<p>您需要申请自己的高德地图API密钥并替换index.html中的"您的高德地图API密钥"。</p>' +
            '<p>申请地址：<a href="https://lbs.amap.com/" target="_blank">https://lbs.amap.com/</a></p>' +
            '</div>';
        return;
    }

    // 福州中心点坐标（大致在市区中心）
    const center = [119.296, 26.074];
    
    // 初始化地图
    const map = new AMap.Map('map', {
        zoom: 12,
        center: center,
        viewMode: '2D',
        resizeEnable: true,
        zoomEnable: true,
        dragEnable: true,
        mapStyle: 'amap://styles/light'
    });

    // 景点坐标数据
    const attractions = [
        {
            name: '三坊七巷',
            position: [119.297300, 26.083639],
            type: 'attraction',
            address: '鼓楼区南后街',
            description: '福州历史文化街区，明清古建筑群',
            photo: 'http://store.is.autonavi.com/showpic/cac3621ddbacd2210b468cd46393436e'
        },
        {
            name: '西湖公园',
            position: [119.289152, 26.092037],
            type: 'attraction',
            address: '湖滨路70号',
            description: '福州古典园林，湖光山色',
            photo: 'http://store.is.autonavi.com/showpic/f279f74689f7f722a87f216f068ff387'
        },
        {
            name: '鼓山',
            position: [119.375610, 26.053221],
            type: 'attraction',
            address: '福马路1000号',
            description: '福州名山，登山观景胜地',
            photo: 'http://store.is.autonavi.com/showpic/208cb77e4dfb97e4c119eaed673fb9f2'
        },
        {
            name: '福州国家森林公园',
            position: [119.286250, 26.161579],
            type: 'attraction',
            address: '新店上赤桥',
            description: '天然氧吧，植物种类丰富',
            photo: 'http://store.is.autonavi.com/showpic/208cb77e4dfb97e4c119eaed673fb9f2'
        },
        {
            name: '福建博物院',
            position: [119.287602, 26.094102],
            type: 'attraction',
            address: '湖头街96号',
            description: '福建省综合性博物馆',
            photo: 'http://store.is.autonavi.com/showpic/2a1ccc53a8893ee165e0968ad445fb5a'
        },
        {
            name: '上下杭历史文化街区',
            position: [119.304687, 26.052103],
            type: 'attraction',
            address: '星河巷星安桥路82号',
            description: '福州传统商业街区，近代建筑',
            photo: 'http://store.is.autonavi.com/showpic/4f20fdab58f5a1140bf93ac7dcbe943e'
        },
        {
            name: '推荐酒店（西湖大酒店）',
            position: [119.287, 26.092],
            type: 'hotel',
            address: '湖滨路158号',
            description: '地理位置优越，近西湖公园',
            photo: 'https://store.is.autonavi.com/showpic/4adaef9033e6398e2db44e72180064c5'
        }
    ];

    // 定义图标样式
    const iconStyles = {
        attraction: {
            image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
            size: [24, 34],
            anchor: 'bottom-center'
        },
        hotel: {
            image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
            size: [24, 34],
            anchor: 'bottom-center'
        },
        food: {
            image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_g.png',
            size: [24, 34],
            anchor: 'bottom-center'
        }
    };

    // 添加标记
    const markers = [];
    attractions.forEach(attraction => {
        const iconStyle = iconStyles[attraction.type] || iconStyles.attraction;
        
        const marker = new AMap.Marker({
            position: attraction.position,
            title: attraction.name,
            map: map,
            icon: new AMap.Icon({
                image: iconStyle.image,
                size: new AMap.Size(iconStyle.size[0], iconStyle.size[1]),
                imageOffset: new AMap.Pixel(0, 0),
                imageSize: new AMap.Size(iconStyle.size[0], iconStyle.size[1])
            }),
            anchor: iconStyle.anchor,
            offset: new AMap.Pixel(0, -10)
        });

        // 信息窗口内容
        const infoWindow = new AMap.InfoWindow({
            content: `<div class="map-info-window">
                        <h3>${attraction.name}</h3>
                        <p><strong>地址：</strong>${attraction.address}</p>
                        <p><strong>描述：</strong>${attraction.description}</p>
                        <div class="info-photo">
                            <img src="${attraction.photo}" alt="${attraction.name}" onerror="this.src='https://via.placeholder.com/200x150?text=图片加载失败'">
                        </div>
                        <button class="nav-btn" onclick="openAmapApp(${attraction.position[0]}, ${attraction.position[1]}, '${attraction.name}')">在高德地图中导航</button>
                      </div>`,
            offset: new AMap.Pixel(0, -30)
        });

        // 点击标记打开信息窗口
        marker.on('click', function() {
            infoWindow.open(map, marker.getPosition());
        });

        markers.push(marker);
    });

    // 绘制推荐路线（三坊七巷 → 西湖公园 → 福建博物院 → 上下杭）
    const routePath = [
        [119.297300, 26.083639], // 三坊七巷
        [119.289152, 26.092037], // 西湖公园
        [119.287602, 26.094102], // 福建博物院
        [119.304687, 26.052103]  // 上下杭
    ];

    const polyline = new AMap.Polyline({
        path: routePath,
        strokeColor: '#9b59b6',
        strokeWeight: 4,
        strokeOpacity: 0.8,
        strokeStyle: 'solid',
        lineJoin: 'round',
        map: map
    });

    // 添加缩放控件
    map.addControl(new AMap.ZoomControl({
        position: 'rb'
    }));

    // 添加比例尺
    map.addControl(new AMap.Scale());

    // 添加工具条
    map.addControl(new AMap.ToolBar({
        position: 'lt'
    }));

    // 自适应地图大小
    setTimeout(() => {
        map.setFitView();
    }, 500);
}

// 在高德地图App中打开导航
function openAmapApp(lng, lat, name) {
    // 高德地图URI scheme
    const url = `amapuri://route/plan/?dlat=${lat}&dlon=${lng}&dname=${encodeURIComponent(name)}&dev=0&t=0`;
    
    // 尝试打开App，如果失败则跳转到网页版
    window.location.href = url;
    
    // 备用方案：跳转到高德地图网页版
    setTimeout(() => {
        window.open(`https://uri.amap.com/navigation?to=${lng},${lat},${encodeURIComponent(name)}&mode=bus&src=mypage`, '_blank');
    }, 500);
}

// 页面加载完成后初始化地图
window.onload = function() {
    initMap();
    
    // 添加景区图片卡片
    createAttractionCards();
};

// 创建景区图片卡片
function createAttractionCards() {
    const attractions = [
        {
            name: '三坊七巷',
            photo: 'http://store.is.autonavi.com/showpic/cac3621ddbacd2210b468cd46393436e',
            description: '福州历史文化街区，保存完好的明清古建筑群'
        },
        {
            name: '西湖公园',
            photo: 'http://store.is.autonavi.com/showpic/f279f74689f7f722a87f216f068ff387',
            description: '福州古典园林，湖光山色相映成趣'
        },
        {
            name: '鼓山',
            photo: 'http://store.is.autonavi.com/showpic/208cb77e4dfb97e4c119eaed673fb9f2',
            description: '福州名山，登山俯瞰城市全景'
        },
        {
            name: '福州国家森林公园',
            photo: 'http://store.is.autonavi.com/showpic/208cb77e4dfb97e4c119eaed673fb9f2',
            description: '天然氧吧，植物种类丰富多样'
        },
        {
            name: '福建博物院',
            photo: 'http://store.is.autonavi.com/showpic/2a1ccc53a8893ee165e0968ad445fb5a',
            description: '福建省综合性博物馆，馆藏丰富'
        },
        {
            name: '上下杭历史文化街区',
            photo: 'http://store.is.autonavi.com/showpic/4f20fdab58f5a1140bf93ac7dcbe943e',
            description: '福州传统商业街区，近代建筑荟萃'
        }
    ];

    const container = document.createElement('div');
    container.className = 'image-cards-container';
    container.innerHTML = `
        <h2><i class="fas fa-images"></i> 景区图片展示</h2>
        <div class="image-cards">
            ${attractions.map(att => `
                <div class="image-card">
                    <div class="image-card-img">
                        <img src="${att.photo}" alt="${att.name}" 
                             onerror="this.src='https://via.placeholder.com/300x200?text=${encodeURIComponent(att.name)}'">
                    </div>
                    <div class="image-card-content">
                        <h3>${att.name}</h3>
                        <p>${att.description}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // 插入到地图容器之后
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        mapContainer.parentNode.insertBefore(container, mapContainer.nextSibling);
    }

    // 添加图片卡片样式
    const style = document.createElement('style');
    style.textContent = `
        .image-cards-container {
            grid-column: span 12;
            background-color: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            margin-top: 24px;
        }
        .image-cards-container h2 {
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            gap: 10px;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        .image-cards {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 24px;
        }
        .image-card {
            border-radius: 10px;
            overflow: hidden;
            background-color: #f8f9fa;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: 1px solid #e9ecef;
        }
        .image-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.12);
        }
        .image-card-img {
            height: 200px;
            overflow: hidden;
        }
        .image-card-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }
        .image-card:hover .image-card-img img {
            transform: scale(1.05);
        }
        .image-card-content {
            padding: 20px;
        }
        .image-card-content h3 {
            color: #2c3e50;
            margin-bottom: 10px;
            font-size: 1.2rem;
        }
        .image-card-content p {
            color: #6c757d;
            line-height: 1.5;
        }
        @media (max-width: 768px) {
            .image-cards {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);
}