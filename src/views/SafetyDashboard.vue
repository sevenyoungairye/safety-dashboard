<template>
    <div class="app-container">
      <header class="main-header">
        <div class="header-left">
          <el-icon class="logo-icon"><Platform /></el-icon>
          <h1 class="app-title">石家庄车辆段车间安全指标可视化平台</h1>
  
          <div style="color: #eee;" @click="goAdminPage" >返回管理页面</div>
        </div>
        <div class="header-right">
          <span class="time-text">数据更新时间: {{ currentTime }}</span>
          <el-button type="primary" plain size="small" :icon="Refresh" @click="handleRefresh">
            刷新数据
          </el-button>
        </div>
      </header>
  
      <main class="main-content">
        <el-card class="filter-card" shadow="hover">
          <div class="card-header-title">
            <el-icon><Filter /></el-icon> 数据筛选与定位
          </div>
          <el-form :inline="true" :model="queryParams" class="filter-form">
            <el-form-item label="车间/单元">
              <el-select clearable v-model="queryParams.unit" placeholder="全部班组" style="width: 200px">
                <el-option label="全部班组" value="all" />
                <el-option label="一班" value="一班" />
                <el-option label="二班" value="二班" />
                <el-option label="三班" value="三班" />
                <el-option label="四班" value="四班" />
              </el-select>
            </el-form-item>
            <el-form-item label="时间范围">
              <el-date-picker
                v-model="queryParams.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 280px"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
              <el-button :icon="Document" @click="showDetails = true">详情</el-button>
            </el-form-item>
          </el-form>
        </el-card>
  
        <div class="grid-section-3">
          <el-card class="dashboard-card" shadow="hover">
            <div class="card-header">
              <el-icon class="icon-blue"><PieChart /></el-icon> 安全问题类型分布
            </div>
            <div ref="pieChartRef" class="chart-box"></div>
          </el-card>
  
          <el-card class="dashboard-card" shadow="hover">
            <div class="card-header">
              <el-icon class="icon-blue"><Postcard /></el-icon> 最近发布牌卡详情
            </div>
            <el-table :data="cardData" style="width: 100%" height="240" stripe :header-cell-style="{background:'#f8fafc'}">
              <el-table-column prop="level" label="牌卡等级" width="90">
                <template #default="scope">
                  <el-tag :type="getLevelTag(scope.row.level)" size="small" effect="light">
                    {{ scope.row.level }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="颜色" width="60" align="center">
                <template #default="scope">
                  <div class="color-dot" :class="scope.row.colorClass"></div>
                </template>
              </el-table-column>
              <el-table-column prop="reason" label="发牌原因" show-overflow-tooltip min-width="120" />
              <el-table-column prop="responsible" label="责任人" width="80" />
              <el-table-column prop="team" label="班组" width="80" />
              <el-table-column prop="date" label="日期" width="100" />
            </el-table>
          </el-card>
  
          <el-card class="dashboard-card" shadow="hover">
            <div class="card-header">
              <el-icon class="icon-blue"><DataAnalysis /></el-icon> 数据汇总
            </div>
            <div class="summary-list">
              <div class="summary-item bg-gray">
                <div class="s-info">
                  <span>安全问题总数</span>
                  <span class="s-num text-danger">27</span>
                </div>
                <el-progress :percentage="85" :show-text="false" color="#ef4444" stroke-width="8" />
              </div>
              <div class="summary-item bg-gray">
                <div class="s-info">
                  <span>已解决问题</span>
                  <span class="s-num text-success">19</span>
                </div>
                <el-progress :percentage="70" :show-text="false" color="#10b981" stroke-width="8" />
              </div>
              <div class="summary-item bg-gray">
                <div class="s-info">
                  <span>待解决问题</span>
                  <span class="s-num text-warning">8</span>
                </div>
                <el-progress :percentage="30" :show-text="false" color="#f59e0b" stroke-width="8" />
              </div>
            </div>
          </el-card>
        </div>
  
        <div class="grid-section-2">
          <el-card class="dashboard-card" shadow="hover">
            <div class="card-header">
              <el-icon class="icon-blue"><RefreshRight /></el-icon> 安全问题重复发生统计
            </div>
            <div ref="recurringChartRef" class="chart-box"></div>
          </el-card>
  
          <el-card class="dashboard-card" shadow="hover">
            <div class="card-header">
              <el-icon class="icon-blue"><List /></el-icon> 安全隐患与信息跟踪
            </div>
            <div class="mini-stats">
              <div class="stat-box bg-gray">
                <div class="stat-num text-info">42</div>
                <div class="stat-label">隐患录入</div>
              </div>
              <div class="stat-box bg-gray">
                <div class="stat-num text-warning">15</div>
                <div class="stat-label">未销号</div>
              </div>
            </div>
            <el-table :data="trackingData" style="width: 100%" height="150" :header-cell-style="{background:'#f8fafc'}">
              <el-table-column prop="title" label="信息标题" show-overflow-tooltip />
              <el-table-column prop="statusText" label="状态" width="100">
                 <template #default="scope">
                   <el-tag size="small" :type="scope.row.status === 'processing' ? '' : 'warning'">
                     {{ scope.row.statusText }}
                   </el-tag>
                 </template>
              </el-table-column>
              <el-table-column prop="assignee" label="责任人" width="80" />
            </el-table>
          </el-card>
        </div>
  
        <el-card class="dashboard-card mt-20" shadow="hover">
          <div class="card-header flex-between">
            <span><el-icon class="icon-blue"><FirstAidKit /></el-icon> 消防设备巡检维护</span>
            <span class="sub-text">更新周期: 每周</span>
          </div>
          <div class="fire-grid">
            <div 
              v-for="(item, index) in fireData" 
              :key="index" 
              class="fire-card"
            >
              <div class="fc-header">
                <span class="fc-loc">{{ item.location }}</span>
                <el-tag size="small" :type="item.status === 'normal' ? 'success' : 'danger'">
                  {{ item.status === 'normal' ? '正常' : '需更换' }}
                </el-tag>
              </div>
              <div class="fc-body">
                <div class="fc-row">
                  <span>上次:</span> <span>{{ item.lastChecked }}</span>
                </div>
                <div class="fc-row">
                  <span>下次:</span> <span>{{ item.nextCheck }}</span>
                </div>
                <div class="fc-row mt-1">
                  <span>状态:</span> 
                  <el-icon :class="item.isOverdue ? 'text-danger' : 'text-success'">
                    <CircleCheckFilled v-if="!item.isOverdue"/>
                    <CircleCloseFilled v-else/>
                  </el-icon>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </main>
  
      <footer class="main-footer">
        <p>邯郸运用二车间可视化平台 © 2025</p>
        <p class="footer-time">数据更新时间: {{ currentTime }}</p>
      </footer>
  
      <el-dialog v-model="showDetails" title="安全问题明细" width="70%">
        <el-table :data="detailData" stripe border>
          <el-table-column prop="id" label="问题编号" />
          <el-table-column prop="type" label="类型" />
          <el-table-column prop="unit" label="责任单元" />
          <el-table-column prop="time" label="发生时间" />
          <el-table-column prop="status" label="状态">
              <template #default="scope">
                  <el-tag :type="scope.row.status === 'solved' ? 'success' : 'warning'">
                      {{ scope.row.status === 'solved' ? '已解决' : '待解决' }}
                  </el-tag>
              </template>
          </el-table-column>
        </el-table>
        <template #footer>
          <el-button @click="showDetails = false">关闭</el-button>
        </template>
      </el-dialog>
  
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, onUnmounted } from 'vue'
  import * as echarts from 'echarts'
  import { 
    Platform, Refresh, Filter, Search, Document, 
    PieChart, Postcard, DataAnalysis, RefreshRight, 
    List, FirstAidKit, CircleCheckFilled, CircleCloseFilled 
  } from '@element-plus/icons-vue'
  
  
  
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  
  // --- 状态定义 ---
  const currentTime = ref('2025-07-21 08:30')
  const showDetails = ref(false)
  const queryParams = reactive({
    unit: '',
    dateRange: []
  })
  
  // --- Mock 数据 (源自 index.html) ---
  // const cardData = [
  //   { level: '局级', colorClass: 'bg-red', reason: '未按规定进行设备检查', responsible: '张工', team: '一班', date: '07-18' },
  //   { level: '段级', colorClass: 'bg-yellow', reason: '安全培训未按时完成', responsible: '李工', team: '二班', date: '07-16' },
  //   { level: '车间级', colorClass: 'bg-yellow', reason: '消防设施检查记录不完整', responsible: '王工', team: '三班', date: '07-15' },
  //   { level: '班组级', colorClass: 'bg-white', reason: '工具摆放不规范', responsible: '赵工', team: '四班', date: '07-14' },
  //   { level: '段级', colorClass: 'bg-yellow', reason: '作业流程执行不严格', responsible: '刘工', team: '一班', date: '07-12' },
  // ]
  
  // --- 1. 定义原始数据 (不会被修改) ---
  const rawCardData = [
    { level: '局级', colorClass: 'bg-red', reason: '未按规定进行设备检查', responsible: '张工', team: '一班', date: '2026-01-29' },
    { level: '段级', colorClass: 'bg-yellow', reason: '安全培训未按时完成', responsible: '李工', team: '二班', date: '22026-01-29' },
    { level: '车间级', colorClass: 'bg-yellow', reason: '消防设施检查记录不完整', responsible: '王工', team: '三班', date: '2026-01-30' },
    { level: '班组级', colorClass: 'bg-white', reason: '工具摆放不规范', responsible: '赵工', team: '四班', date: '2026-02-01' },
    { level: '段级', colorClass: 'bg-yellow', reason: '作业流程执行不严格', responsible: '刘工', team: '一班', date: '2026-02-12' },
  ]
  
  // --- 2. 定义响应式数据 (用于绑定 el-table) ---
  // 初始化时，让它等于原始数据
  const cardData = ref([...rawCardData])
  
  const trackingData = [
      { title: '关于加强雨季防洪安全的通知', status: 'pending', statusText: '待反馈', assignee: '张工' },
      { title: '设备维护保养计划落实情况', status: 'processing', statusText: '办理中', assignee: '李工' },
      { title: '安全培训考核结果反馈', status: 'pending', statusText: '待反馈', assignee: '王工' }
  ]
  
  const fireData = [
      { location: '南待检室', status: 'normal', lastChecked: '07-18', nextCheck: '07-25', isOverdue: false },
      { location: '车间二楼', status: 'replace', lastChecked: '07-15', nextCheck: '07-22', isOverdue: true },
      { location: '车间一楼', status: 'normal', lastChecked: '07-17', nextCheck: '07-24', isOverdue: false },
      { location: '北待检室', status: 'normal', lastChecked: '07-19', nextCheck: '07-26', isOverdue: false },
      { location: '站修大库', status: 'replace', lastChecked: '07-14', nextCheck: '07-21', isOverdue: true },
  ]
  
  const detailData = [
      { id: 'AQ001', type: '行车', unit: '运用二车间', time: '2025-03-05', status: 'solved' },
      { id: 'AQ002', type: '设备', unit: '检查车间', time: '2025-03-09', status: 'pending' },
  ]
  
  // --- 方法 ---
  
  const goAdminPage = () => {
    router.push('/')
  }
  
  const getLevelTag = (level) => {
    const map = { '局级': 'danger', '段级': 'warning', '车间级': 'info', '班组级': 'success' }
    return map[level] || 'info'
  }
  
  const handleRefresh = () => {
      // 模拟刷新逻辑
      const now = new Date()
      currentTime.value = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`
  }
  
  const handleSearch = () => {
    console.log('params, ', queryParams.unit)
    let results = [...rawCardData]
  
    // 1. 班组筛选 (直接对比)
    if (queryParams.unit && queryParams.unit !== 'all') {
      results = results.filter(item => item.team === queryParams.unit)
    }
  
    // 2. 时间筛选
    if (queryParams.dateRange && queryParams.dateRange.length === 2) {
      const start = queryParams.dateRange[0].getTime()
      const end = queryParams.dateRange[1].getTime()
      results = results.filter(item => {
         // 补全 mock 数据的时间格式
         const dateStr = item.date.length <= 5 ? `2025-${item.date}` : item.date
         const t = new Date(dateStr).getTime()
         return t >= start && t <= end
      })
    }
  
    cardData.value = results
  }
  
  // --- ECharts 初始化 ---
  const pieChartRef = ref(null)
  const recurringChartRef = ref(null)
  let pieChart = null
  let recurChart = null
  
  const initCharts = () => {
    // 1. 饼图 (安全问题类型)
    if (pieChartRef.value) {
      pieChart = echarts.init(pieChartRef.value)
      pieChart.setOption({
          tooltip: { trigger: 'item' },
          color: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#64748b'],
          legend: { orient: 'vertical', right: 0, top: 'center' },
          series: [{
              type: 'pie',
              radius: ['0%', '75%'], // 实心饼图
              center: ['40%', '50%'],
              data: [
                  { value: 12, name: '行车' },
                  { value: 8, name: '人身' },
                  { value: 5, name: '设备' },
                  { value: 2, name: '消防' },
                  { value: 3, name: '其他' }
              ]
          }]
      })
    }
  
    // 2. 环形图 (重复发生)
    if (recurringChartRef.value) {
      recurChart = echarts.init(recurringChartRef.value)
      recurChart.setOption({
          tooltip: { trigger: 'item' },
          color: ['#ef4444', '#10b981'],
          legend: { bottom: 0 },
          series: [{
              type: 'pie',
              radius: ['50%', '70%'], // 空心环形
              center: ['50%', '45%'],
              label: { show: false },
              data: [
                  { value: 8, name: '重复发生' },
                  { value: 19, name: '首次发生' }
              ]
          }]
      })
    }
  }
  
  onMounted(() => {
      initCharts()
      window.addEventListener('resize', () => {
          pieChart?.resize()
          recurChart?.resize()
      })
  })
  
  onUnmounted(() => {
      pieChart?.dispose()
      recurChart?.dispose()
  })
  </script>
  
  <style lang="scss" scoped>
  // 变量定义 - 提取自 Tailwind 配置
  $primary: #1e40af;
  $bg-gray: #f9fafb;
  $border-light: #e2e8f0;
  $text-dark: #334155;
  $text-light: #64748b;
  $success: #10b981;
  $danger: #ef4444;
  $warning: #f59e0b;
  $info: #06b6d4;
  
  .app-container {
    min-height: 100vh;
    background-color: #f0f2f5;
    font-family: 'Inter', sans-serif;
  }
  
  // 1. Header
  .main-header {
    background: $primary;
    color: white;
    height: 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
      .logo-icon { font-size: 24px; }
      .app-title { font-size: 20px; font-weight: 700; margin: 0; }
    }
  
    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
      .time-text { font-size: 14px; opacity: 0.9; }
    }
  }
  
  // 2. Content
  .main-content {
    padding: 24px;
    max-width: 1440px;
    margin: 0 auto;
  }
  
  .card-header-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: $text-dark;
    font-size: 16px;
    margin-bottom: 16px;
    .el-icon { color: #3b82f6; }
  }
  
  .filter-card {
    margin-bottom: 24px;
    border: none;
    .el-form-item { margin-bottom: 0; margin-right: 24px; }
  }
  
  // 3. 通用卡片样式
  .dashboard-card {
    border: none;
    display: flex;
    flex-direction: column;
    
    :deep(.el-card__body) {
      padding: 16px;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  
    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: $text-dark;
      margin-bottom: 16px;
      font-size: 16px;
      
      .icon-blue { color: #3b82f6; margin-right: 4px; }
      &.flex-between { justify-content: space-between; }
      .sub-text { font-size: 12px; color: $text-light; font-weight: normal; }
    }
  }
  
  // 4. Grid 布局
  .grid-section-3 {
    display: grid;
    grid-template-columns: 1fr 1.4fr 1fr; // 左中右比例
    gap: 24px;
    margin-bottom: 24px;
    
    @media (max-width: 1024px) { grid-template-columns: 1fr; }
  }
  
  .grid-section-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    
    @media (max-width: 768px) { grid-template-columns: 1fr; }
  }
  
  // 5. 图表与列表
  .chart-box {
    height: 250px;
    width: 100%;
  }
  
  .color-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin: 0 auto;
    &.bg-red { background-color: $danger; }
    &.bg-yellow { background-color: $warning; }
    &.bg-white { background-color: #fff; border: 1px solid #ddd; }
  }
  
  // 6. 数据汇总列表
  .summary-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;
  }
  
  .summary-item {
    padding: 16px;
    border-radius: 8px;
    &.bg-gray { background-color: #f1f5f9; }
  
    .s-info {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 8px;
      font-size: 14px;
      color: $text-light;
      
      .s-num { font-size: 20px; font-weight: bold; }
      .text-danger { color: $danger; }
      .text-success { color: $success; }
      .text-warning { color: $warning; }
    }
  }
  
  // 7. 隐患跟踪的小统计块
  .mini-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  
    .stat-box {
      text-align: center;
      padding: 12px;
      border-radius: 8px;
      &.bg-gray { background-color: #f1f5f9; }
      
      .stat-num { font-size: 24px; font-weight: bold; }
      .text-info { color: $info; }
      .text-warning { color: $warning; }
      .stat-label { font-size: 12px; color: $text-light; margin-top: 4px; }
    }
  }
  
  // 8. 消防设备巡检 Grid
  .mt-20 { margin-top: 24px; }
  .fire-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    
    @media (max-width: 1200px) { grid-template-columns: repeat(3, 1fr); }
    @media (max-width: 768px) { grid-template-columns: repeat(2, 1fr); }
  }
  
  .fire-card {
    background-color: #f1f5f9;
    padding: 16px;
    border-radius: 8px;
    transition: transform 0.2s;
    
    &:hover { transform: translateY(-2px); box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
  
    .fc-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      .fc-loc { font-weight: 600; color: $text-dark; font-size: 14px; }
    }
    
    .fc-body {
      font-size: 12px;
      color: $text-light;
      .fc-row { 
        display: flex; 
        justify-content: space-between; 
        margin-bottom: 4px; 
      }
      .text-success { color: $success; font-size: 16px; }
      .text-danger { color: $danger; font-size: 16px; }
    }
  }
  
  // 9. Footer
  .main-footer {
    background-color: $text-dark;
    color: white;
    padding: 24px;
    text-align: center;
    margin-top: 32px;
    font-size: 14px;
    
    .footer-time { color: #94a3b8; margin-top: 8px; font-size: 12px; }
  }
  </style>