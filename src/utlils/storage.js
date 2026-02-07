// src/utils/storage.js
const KEY = 'safety-app-data';

// 默认的初始数据（防止第一次打开是空的，给点演示数据）
const DEFAULT_DATA = {
  safety: [
    { id: 'AQ001', type: '行车', team: '一班', description: '未按规定检查', time: '2025-07-01T08:30:00', status: 'solved' },
    { id: 'AQ002', type: '人身', team: '二班', description: '未戴安全帽', time: '2025-07-02T09:00:00', status: 'pending' },
    { id: 'AQ003', type: '设备', team: '三班', description: '设备异响', time: '2025-07-03T10:00:00', status: 'solved' },
    { id: 'AQ004', type: '消防', team: '四班', description: '灭火器过期', time: '2025-07-04T11:00:00', status: 'pending' },
    { id: 'AQ005', type: '其他', team: '一班', description: '卫生不合格', time: '2025-07-05T14:00:00', status: 'solved' }
  ],
  cards: [
    { id: 'PK001', level: '局级', color: '红色', reason: '违章操作', responsible: '张三', team: '一班', date: '2025-07-20' },
    { id: 'PK002', level: '段级', color: '黄色', reason: '迟到', responsible: '李四', team: '二班', date: '2025-07-19' }
  ]
};

export const db = {
  // 获取数据
  load() {
    try {
      const str = localStorage.getItem(KEY);
      return str ? JSON.parse(str) : DEFAULT_DATA;
    } catch (e) {
      return DEFAULT_DATA;
    }
  },

  // 保存数据 (全量保存)
  save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }
};