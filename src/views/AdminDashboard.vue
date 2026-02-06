<template>
    <el-container class="app-container">
      <el-header class="main-header">
        <div class="header-left">
          <el-icon class="logo-icon"><Shield /></el-icon>
          <h1 class="app-title">邯郸运用二车间可视化平台 - 后台数据管理</h1>
  
          <div style="color: #eee" @click="goSafePage">查看安全记录数据</div>
        </div>
        <div class="header-right">
          <span class="user-info">当前用户: 管理员</span>
          <el-button
            type="primary"
            bg
            text
            :icon="SwitchButton"
            @click="handleLogout"
            class="logout-btn"
          >
            退出登录
          </el-button>
        </div>
      </el-header>
  
      <el-main class="main-content">
        <el-tabs v-model="activeTab" type="card" class="content-tabs">
          <el-tab-pane label="安全问题记录" name="safety">
            <template #label
              ><span class="tab-label"
                ><el-icon><Warning /></el-icon> 安全问题记录</span
              ></template
            >
            <div class="pane-layout">
              <el-card class="form-card">
                <template #header>
                  <div class="card-header">
                    <el-icon class="icon-blue"><CirclePlus /></el-icon>
                    添加安全问题记录
                  </div>
                </template>
                <el-form
                  :model="forms.safety"
                  label-position="top"
                  ref="safetyFormRef"
                >
                  <el-form-item label="问题类型" required>
                    <el-select
                      v-model="forms.safety.type"
                      placeholder="请选择"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="opt in ['行车', '人身', '设备', '消防', '其他']"
                        :key="opt"
                        :label="opt"
                        :value="opt"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="责任班组" required>
                    <el-select
                      v-model="forms.safety.team"
                      placeholder="请选择"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="opt in teamOptions"
                        :key="opt"
                        :label="opt"
                        :value="opt"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="问题描述" required>
                    <el-input
                      v-model="forms.safety.description"
                      type="textarea"
                      :rows="3"
                    />
                  </el-form-item>
                  <el-form-item label="发生时间" required>
                    <el-date-picker
                      v-model="forms.safety.time"
                      type="datetime"
                      placeholder="选择时间"
                      style="width: 100%"
                    />
                  </el-form-item>
                  <el-form-item label="处置状态" required>
                    <el-select v-model="forms.safety.status" style="width: 100%">
                      <el-option label="待解决" value="pending" />
                      <el-option label="已解决" value="solved" />
                    </el-select>
                  </el-form-item>
                  <div class="form-actions">
                    <el-button type="primary" @click="submitForm('safety')"
                      >保存记录</el-button
                    >
                    <el-button @click="resetForm('safety')">重置</el-button>
                  </div>
                </el-form>
              </el-card>
  
              <el-card class="table-card">
                <template #header>
                  <div class="table-header">
                    <span class="card-header"
                      ><el-icon class="icon-blue"><List /></el-icon>
                      记录列表</span
                    >
                    <div class="header-search">
                      <el-input
                        v-model="search.safety"
                        placeholder="搜索问题..."
                        :prefix-icon="Search"
                        clearable
                      />
                      <el-button
                        :icon="Refresh"
                        circle
                        @click="refreshData('safety')"
                      />
                    </div>
                  </div>
                </template>
                <el-table
                  :data="paginatedSafety"
                  stripe
                  style="width: 100%"
                  height="500"
                >
                  <el-table-column prop="id" label="编号" width="120" />
                  <el-table-column prop="type" label="类型" width="80" />
                  <el-table-column prop="team" label="班组" width="80" />
                  <el-table-column prop="time" label="发生时间" width="160">
                    <template #default="{ row }">{{
                      formatDate(row.time)
                    }}</template>
                  </el-table-column>
                  <el-table-column prop="status" label="状态" width="100">
                    <template #default="{ row }">
                      <el-tag
                        :type="row.status === 'solved' ? 'success' : 'warning'"
                      >
                        {{ row.status === "solved" ? "已解决" : "待解决" }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{ row }">
                      <el-button
                        link
                        type="primary"
                        @click="showDetail(row, 'safety')"
                        >查看</el-button
                      >
                      <el-button
                        link
                        type="danger"
                        @click="handleDelete(row.id, 'safety')"
                        >删除</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
                <div class="pagination-wrapper">
                  <el-pagination
                    background
                    layout="prev, pager, next, total"
                    :total="filteredSafety.length"
                    v-model:current-page="pages.safety"
                    :page-size="pageSize"
                  />
                </div>
              </el-card>
            </div>
          </el-tab-pane>
  
          <el-tab-pane label="牌卡信息管理" name="cards">
            <template #label
              ><span class="tab-label"
                ><el-icon><Postcard /></el-icon> 牌卡信息管理</span
              ></template
            >
            <div class="pane-layout">
              <el-card class="form-card">
                <template #header
                  ><div class="card-header">
                    <el-icon class="icon-blue"><CirclePlus /></el-icon>
                    添加牌卡信息
                  </div></template
                >
                <el-form :model="forms.cards" label-position="top">
                  <el-form-item label="牌卡等级">
                    <el-select v-model="forms.cards.level" style="width: 100%">
                      <el-option
                        v-for="l in ['局级', '段级', '车间级', '班组级']"
                        :key="l"
                        :label="l"
                        :value="l"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="牌卡颜色">
                    <el-select v-model="forms.cards.color" style="width: 100%">
                      <el-option label="红色" value="红色"
                        ><span style="color: red">● 红色</span></el-option
                      >
                      <el-option label="黄色" value="黄色"
                        ><span style="color: orange">● 黄色</span></el-option
                      >
                      <el-option label="白色" value="白色"
                        ><span style="color: #ddd">● 白色</span></el-option
                      >
                    </el-select>
                  </el-form-item>
                  <el-form-item label="发牌原因"
                    ><el-input v-model="forms.cards.reason" type="textarea"
                  /></el-form-item>
                  <el-form-item label="责任人"
                    ><el-input v-model="forms.cards.responsible"
                  /></el-form-item>
                  <el-form-item label="责任班组">
                    <el-select v-model="forms.cards.team" style="width: 100%">
                      <el-option
                        v-for="opt in teamOptions"
                        :key="opt"
                        :label="opt"
                        :value="opt"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="发牌日期">
                    <el-date-picker
                      v-model="forms.cards.date"
                      type="date"
                      style="width: 100%"
                      value-format="YYYY-MM-DD"
                    />
                  </el-form-item>
                  <div class="form-actions">
                    <el-button type="primary" @click="submitForm('cards')"
                      >保存</el-button
                    >
                    <el-button @click="resetForm('cards')">重置</el-button>
                  </div>
                </el-form>
              </el-card>
              <el-card class="table-card">
                <template #header>
                  <div class="table-header">
                    <span class="card-header"
                      ><el-icon class="icon-blue"><List /></el-icon>
                      牌卡列表</span
                    >
                    <div class="header-search">
                      <el-input
                        v-model="search.cards"
                        placeholder="搜索牌卡..."
                        :prefix-icon="Search"
                        clearable
                      />
                    </div>
                  </div>
                </template>
                <el-table :data="paginatedCards" stripe height="500">
                  <el-table-column prop="level" label="等级" width="90">
                    <template #default="{ row }"
                      ><el-tag :type="getLevelType(row.level)">{{
                        row.level
                      }}</el-tag></template
                    >
                  </el-table-column>
                  <el-table-column label="颜色" width="60" align="center">
                    <template #default="{ row }">
                      <div
                        class="color-dot"
                        :style="{ background: getColorCode(row.color) }"
                      ></div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="reason"
                    label="原因"
                    show-overflow-tooltip
                  />
                  <el-table-column prop="responsible" label="责任人" width="80" />
                  <el-table-column prop="team" label="班组" width="80" />
                  <el-table-column prop="date" label="日期" width="110" />
                  <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{ row }">
                      <el-button
                        link
                        type="primary"
                        @click="showDetail(row, 'cards')"
                        >查看</el-button
                      >
                      <el-button
                        link
                        type="danger"
                        @click="handleDelete(row.id, 'cards')"
                        >删除</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
                <div class="pagination-wrapper">
                  <el-pagination
                    background
                    layout="prev, pager, next, total"
                    :total="filteredCards.length"
                    v-model:current-page="pages.cards"
                    :page-size="pageSize"
                  />
                </div>
              </el-card>
            </div>
          </el-tab-pane>
  
          <el-tab-pane label="消防设备巡检" name="fire">
            <template #label
              ><span class="tab-label"
                ><el-icon><FirstAidKit /></el-icon> 消防设备巡检</span
              ></template
            >
            <div class="pane-layout">
              <el-card class="form-card">
                <template #header
                  ><div class="card-header">
                    <el-icon class="icon-blue"><CirclePlus /></el-icon>
                    消防巡检记录
                  </div></template
                >
                <el-form :model="forms.fire" label-position="top">
                  <el-form-item label="设备位置">
                    <el-select v-model="forms.fire.location" style="width: 100%">
                      <el-option
                        v-for="l in [
                          '南待检室',
                          '北待检室',
                          '车间一楼',
                          '车间二楼',
                          '车棚',
                          '站修大库',
                          '伙食团',
                        ]"
                        :key="l"
                        :label="l"
                        :value="l"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="设备状态">
                    <el-select v-model="forms.fire.status" style="width: 100%">
                      <el-option label="正常" value="normal" />
                      <el-option label="需要更换" value="needsReplacement" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="检查日期">
                    <el-date-picker
                      v-model="forms.fire.checkDate"
                      type="date"
                      style="width: 100%"
                      value-format="YYYY-MM-DD"
                    />
                  </el-form-item>
                  <el-form-item label="检查人"
                    ><el-input v-model="forms.fire.inspector"
                  /></el-form-item>
                  <el-form-item label="备注"
                    ><el-input v-model="forms.fire.note" type="textarea"
                  /></el-form-item>
                  <div class="form-actions">
                    <el-button type="primary" @click="submitForm('fire')"
                      >保存</el-button
                    >
                    <el-button @click="resetForm('fire')">重置</el-button>
                  </div>
                </el-form>
              </el-card>
              <el-card class="table-card">
                <template #header>
                  <div class="table-header">
                    <span class="card-header"
                      ><el-icon class="icon-blue"><List /></el-icon>
                      设备列表</span
                    >
                    <div class="header-search">
                      <el-input
                        v-model="search.fire"
                        placeholder="搜索设备..."
                        :prefix-icon="Search"
                      />
                    </div>
                  </div>
                </template>
                <el-table :data="paginatedFire" stripe height="500">
                  <el-table-column prop="location" label="位置" />
                  <el-table-column label="状态" width="100">
                    <template #default="{ row }"
                      ><el-tag
                        :type="row.status === 'normal' ? 'success' : 'danger'"
                        >{{ row.status === "normal" ? "正常" : "需更换" }}</el-tag
                      ></template
                    >
                  </el-table-column>
                  <el-table-column
                    prop="lastChecked"
                    label="上次检查"
                    width="110"
                  />
                  <el-table-column
                    prop="nextCheck"
                    label="下次检查"
                    width="110"
                  />
                  <el-table-column label="更新状态" width="90" align="center">
                    <template #default="{ row }">
                      <el-icon
                        :color="row.isOverdue ? '#f56c6c' : '#67c23a'"
                        size="18"
                      >
                        <CircleCloseFilled
                          v-if="row.isOverdue"
                        /><CircleCheckFilled v-else />
                      </el-icon>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{ row }">
                      <el-button
                        link
                        type="primary"
                        @click="showDetail(row, 'fire')"
                        >查看</el-button
                      >
                      <el-button
                        link
                        type="danger"
                        @click="handleDelete(row.id, 'fire')"
                        >删除</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
                <div class="pagination-wrapper">
                  <el-pagination
                    background
                    layout="prev, pager, next, total"
                    :total="filteredFire.length"
                    v-model:current-page="pages.fire"
                    :page-size="pageSize"
                  />
                </div>
              </el-card>
            </div>
          </el-tab-pane>
  
          <el-tab-pane label="安全隐患管理" name="danger">
            <template #label
              ><span class="tab-label"
                ><el-icon><WarningFilled /></el-icon> 安全隐患管理</span
              ></template
            >
            <div class="pane-layout">
              <el-card class="form-card">
                <template #header
                  ><div class="card-header">
                    <el-icon class="icon-blue"><CirclePlus /></el-icon>
                    添加隐患记录
                  </div></template
                >
                <el-form :model="forms.danger" label-position="top">
                  <el-form-item label="隐患类型">
                    <el-select v-model="forms.danger.type" style="width: 100%">
                      <el-option
                        v-for="t in [
                          '设备隐患',
                          '操作隐患',
                          '环境隐患',
                          '管理隐患',
                        ]"
                        :key="t"
                        :label="t"
                        :value="t"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="隐患描述"
                    ><el-input v-model="forms.danger.description" type="textarea"
                  /></el-form-item>
                  <el-form-item label="责任班组">
                    <el-select v-model="forms.danger.team" style="width: 100%">
                      <el-option
                        v-for="opt in teamOptions"
                        :key="opt"
                        :label="opt"
                        :value="opt"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="发现日期">
                    <el-date-picker
                      v-model="forms.danger.date"
                      type="date"
                      style="width: 100%"
                      value-format="YYYY-MM-DD"
                    />
                  </el-form-item>
                  <el-form-item label="隐患状态">
                    <el-select v-model="forms.danger.status" style="width: 100%">
                      <el-option label="未销号" value="pending" />
                      <el-option label="已销号" value="solved" />
                    </el-select>
                  </el-form-item>
                  <div class="form-actions">
                    <el-button type="primary" @click="submitForm('danger')"
                      >保存</el-button
                    >
                    <el-button @click="resetForm('danger')">重置</el-button>
                  </div>
                </el-form>
              </el-card>
              <el-card class="table-card">
                <template #header>
                  <div class="table-header">
                    <span class="card-header"
                      ><el-icon class="icon-blue"><List /></el-icon>
                      隐患列表</span
                    >
                    <div class="header-search">
                      <el-input
                        v-model="search.danger"
                        placeholder="搜索隐患..."
                        :prefix-icon="Search"
                      />
                    </div>
                  </div>
                </template>
                <el-table :data="paginatedDanger" stripe height="500">
                  <el-table-column prop="type" label="类型" />
                  <el-table-column prop="team" label="责任班组" />
                  <el-table-column prop="date" label="日期" width="110" />
                  <el-table-column label="状态" width="100">
                    <template #default="{ row }">
                      <el-tag
                        :type="row.status === 'solved' ? 'success' : 'warning'"
                        >{{
                          row.status === "solved" ? "已销号" : "未销号"
                        }}</el-tag
                      >
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{ row }">
                      <el-button
                        link
                        type="primary"
                        @click="showDetail(row, 'danger')"
                        >查看</el-button
                      >
                      <el-button
                        link
                        type="danger"
                        @click="handleDelete(row.id, 'danger')"
                        >删除</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
                <div class="pagination-wrapper">
                  <el-pagination
                    background
                    layout="prev, pager, next, total"
                    :total="filteredDanger.length"
                    v-model:current-page="pages.danger"
                    :page-size="pageSize"
                  />
                </div>
              </el-card>
            </div>
          </el-tab-pane>
  
          <el-tab-pane label="信息跟踪管理" name="tracking">
            <template #label
              ><span class="tab-label"
                ><el-icon><Files /></el-icon> 信息跟踪管理</span
              ></template
            >
            <div class="pane-layout">
              <el-card class="form-card">
                <template #header
                  ><div class="card-header">
                    <el-icon class="icon-blue"><CirclePlus /></el-icon>
                    添加跟踪信息
                  </div></template
                >
                <el-form :model="forms.tracking" label-position="top">
                  <el-form-item label="信息标题"
                    ><el-input v-model="forms.tracking.title"
                  /></el-form-item>
                  <el-form-item label="信息内容"
                    ><el-input v-model="forms.tracking.content" type="textarea"
                  /></el-form-item>
                  <el-form-item label="责任人"
                    ><el-input v-model="forms.tracking.assignee"
                  /></el-form-item>
                  <el-form-item label="发起日期">
                    <el-date-picker
                      v-model="forms.tracking.date"
                      type="date"
                      style="width: 100%"
                      value-format="YYYY-MM-DD"
                    />
                  </el-form-item>
                  <el-form-item label="状态">
                    <el-select
                      v-model="forms.tracking.status"
                      style="width: 100%"
                    >
                      <el-option label="待反馈" value="pending" />
                      <el-option label="办理中" value="processing" />
                      <el-option label="已完成" value="completed" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="进度 (%)">
                    <el-slider v-model="forms.tracking.progress" />
                  </el-form-item>
                  <div class="form-actions">
                    <el-button type="primary" @click="submitForm('tracking')"
                      >保存</el-button
                    >
                    <el-button @click="resetForm('tracking')">重置</el-button>
                  </div>
                </el-form>
              </el-card>
              <el-card class="table-card">
                <template #header>
                  <div class="table-header">
                    <span class="card-header"
                      ><el-icon class="icon-blue"><List /></el-icon>
                      跟踪列表</span
                    >
                    <div class="header-search">
                      <el-input
                        v-model="search.tracking"
                        placeholder="搜索信息..."
                        :prefix-icon="Search"
                      />
                    </div>
                  </div>
                </template>
                <el-table :data="paginatedTracking" stripe height="500">
                  <el-table-column
                    prop="title"
                    label="标题"
                    show-overflow-tooltip
                  />
                  <el-table-column prop="assignee" label="责任人" width="100" />
                  <el-table-column prop="date" label="日期" width="110" />
                  <el-table-column label="状态" width="90">
                    <template #default="{ row }">
                      <el-tag :type="getTrackingTag(row.status)">{{
                        row.statusText
                      }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="进度" width="120">
                    <template #default="{ row }">
                      <el-progress
                        :percentage="parseInt(row.progress)"
                        :status="row.status === 'completed' ? 'success' : ''"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{ row }">
                      <el-button
                        link
                        type="primary"
                        @click="showDetail(row, 'tracking')"
                        >查看</el-button
                      >
                      <el-button
                        link
                        type="danger"
                        @click="handleDelete(row.id, 'tracking')"
                        >删除</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
                <div class="pagination-wrapper">
                  <el-pagination
                    background
                    layout="prev, pager, next, total"
                    :total="filteredTracking.length"
                    v-model:current-page="pages.tracking"
                    :page-size="pageSize"
                  />
                </div>
              </el-card>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-main>
  
      <el-footer class="main-footer">
        <p>邯郸运用二车间可视化平台 - 后台数据管理 &copy; 2025</p>
        <p class="footer-time">最后更新时间: {{ currentTime }}</p>
      </el-footer>
  
      <el-dialog v-model="detailVisible" :title="detailTitle" width="600px">
        <div v-if="currentDetail" class="detail-content">
          <div
            class="detail-row"
            v-for="(val, key) in currentDetailDisplay"
            :key="key"
          >
            <span class="detail-label">{{ key }}:</span>
            <span class="detail-value">{{ val }}</span>
          </div>
          <div
            v-if="
              currentDetail.description ||
              currentDetail.reason ||
              currentDetail.note ||
              currentDetail.content
            "
            class="detail-block"
          >
            <div class="detail-label-block">详细内容/备注:</div>
            <div class="detail-text-box">
              {{
                currentDetail.description ||
                currentDetail.reason ||
                currentDetail.note ||
                currentDetail.content
              }}
            </div>
          </div>
        </div>
        <template #footer>
          <el-button @click="detailVisible = false">关闭</el-button>
        </template>
      </el-dialog>
    </el-container>
  </template>
    
  <script setup>
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  
  import { ref, reactive, computed, onMounted } from "vue";
  import { ElMessage, ElMessageBox } from "element-plus";
  import {
    SwitchButton,
    Warning,
    CirclePlus,
    List,
    Search,
    Refresh,
    Postcard,
    FirstAidKit,
    CircleCheckFilled,
    CircleCloseFilled,
    WarningFilled,
    Files,
  } from "@element-plus/icons-vue";
  
  // --- 状态定义 ---
  const activeTab = ref("safety");
  const currentTime = ref("");
  const pageSize = 10;
  const teamOptions = ["一班", "二班", "三班", "四班", "站修"];
  
  // 模拟数据源 (Ref 方便直接操作数组)
  const mockData = reactive({
    safety: [
      {
        id: "AQ202507001",
        type: "行车",
        team: "一班",
        description: "未按规定进行车辆检查",
        time: "2025-07-01T08:23:00",
        status: "solved",
      },
      {
        id: "AQ202507002",
        type: "人身",
        team: "二班",
        description: "作业时未佩戴安全防护装备",
        time: "2025-07-03T14:15:00",
        status: "solved",
      },
      {
        id: "AQ202507003",
        type: "设备",
        team: "三班",
        description: "设备维护记录不完整",
        time: "2025-07-05T10:42:00",
        status: "pending",
      },
    ],
    cards: [
      {
        id: "PK202507001",
        level: "局级",
        color: "红色",
        reason: "未按规定进行设备检查",
        responsible: "张工",
        team: "一班",
        date: "2025-07-18",
      },
      {
        id: "PK202507002",
        level: "段级",
        color: "黄色",
        reason: "安全培训未按时完成",
        responsible: "李工",
        team: "二班",
        date: "2025-07-16",
      },
    ],
    fire: [
      {
        id: "XF202507001",
        location: "南待检室",
        status: "normal",
        lastChecked: "2025-07-18",
        nextCheck: "2025-07-25",
        inspector: "张工",
        note: "正常",
        isOverdue: false,
      },
      {
        id: "XF202507004",
        location: "车间二楼",
        status: "needsReplacement",
        lastChecked: "2025-07-15",
        nextCheck: "2025-07-22",
        inspector: "赵工",
        note: "压力不足",
        isOverdue: true,
      },
    ],
    danger: [
      {
        id: "YH202507001",
        type: "设备隐患",
        description: "设备老化",
        team: "一班",
        date: "2025-07-01",
        status: "pending",
      },
    ],
    tracking: [
      {
        id: "XG202507001",
        title: "雨季防洪通知",
        content: "加强防洪",
        assignee: "张工",
        date: "2025-07-01",
        status: "pending",
        statusText: "待反馈",
        progress: "50",
      },
    ],
  });
  
  // 表单模型
  const forms = reactive({
    safety: { type: "", team: "", description: "", time: "", status: "pending" },
    cards: {
      level: "",
      color: "",
      reason: "",
      responsible: "",
      team: "",
      date: "",
    },
    fire: { location: "", status: "", checkDate: "", inspector: "", note: "" },
    danger: { type: "", description: "", team: "", date: "", status: "pending" },
    tracking: {
      title: "",
      content: "",
      assignee: "",
      date: "",
      status: "pending",
      progress: 0,
    },
  });
  
  // 搜索和分页状态
  const search = reactive({
    safety: "",
    cards: "",
    fire: "",
    danger: "",
    tracking: "",
  });
  const pages = reactive({
    safety: 1,
    cards: 1,
    fire: 1,
    danger: 1,
    tracking: 1,
  });
  
  // 详情弹窗状态
  const detailVisible = ref(false);
  const detailTitle = ref("");
  const currentDetail = ref(null);
  
  // --- 计算属性 (Search & Pagination) ---
  const filterList = (list, query, keys) => {
    if (!query) return list;
    const lowerQ = query.toLowerCase();
    return list.filter((item) =>
      keys.some((k) =>
        String(item[k] || "")
          .toLowerCase()
          .includes(lowerQ)
      )
    );
  };
  const paginate = (list, page) =>
    list.slice((page - 1) * pageSize, page * pageSize);
  
  // Safety Computed
  const filteredSafety = computed(() =>
    filterList(mockData.safety, search.safety, ["type", "team", "description"])
  );
  const paginatedSafety = computed(() =>
    paginate(filteredSafety.value, pages.safety)
  );
  
  // Cards Computed
  const filteredCards = computed(() =>
    filterList(mockData.cards, search.cards, ["level", "responsible", "team"])
  );
  const paginatedCards = computed(() =>
    paginate(filteredCards.value, pages.cards)
  );
  
  // Fire Computed
  const filteredFire = computed(() =>
    filterList(mockData.fire, search.fire, ["location", "inspector"])
  );
  const paginatedFire = computed(() => paginate(filteredFire.value, pages.fire));
  
  // Danger Computed
  const filteredDanger = computed(() =>
    filterList(mockData.danger, search.danger, ["type", "team"])
  );
  const paginatedDanger = computed(() =>
    paginate(filteredDanger.value, pages.danger)
  );
  
  // Tracking Computed
  const filteredTracking = computed(() =>
    filterList(mockData.tracking, search.tracking, ["title", "assignee"])
  );
  const paginatedTracking = computed(() =>
    paginate(filteredTracking.value, pages.tracking)
  );
  
  // 详情展示的计算属性
  const currentDetailDisplay = computed(() => {
    if (!currentDetail.value) return {};
    const item = currentDetail.value;
    // 根据不同类型返回不同的字段映射
    if (item.id.startsWith("AQ"))
      return {
        编号: item.id,
        类型: item.type,
        班组: item.team,
        时间: formatDate(item.time),
        状态: item.status === "solved" ? "已解决" : "待解决",
      };
    if (item.id.startsWith("PK"))
      return {
        编号: item.id,
        等级: item.level,
        颜色: item.color,
        责任人: item.responsible,
        班组: item.team,
        日期: item.date,
      };
    if (item.id.startsWith("XF"))
      return {
        编号: item.id,
        位置: item.location,
        状态: item.status === "normal" ? "正常" : "需更换",
        检查人: item.inspector,
        上次: item.lastChecked,
        下次: item.nextCheck,
      };
    if (item.id.startsWith("YH"))
      return {
        编号: item.id,
        类型: item.type,
        班组: item.team,
        日期: item.date,
        状态: item.status === "solved" ? "已销号" : "未销号",
      };
    if (item.id.startsWith("XG"))
      return {
        编号: item.id,
        标题: item.title,
        责任人: item.assignee,
        日期: item.date,
        状态: item.statusText,
        进度: item.progress + "%",
      };
    return {};
  });
  
  // --- 方法 ---
  
  // 1. 初始化
  onMounted(() => {
    updateTime();
    setInterval(updateTime, 1000);
    // 设置默认日期
    const today = new Date().toISOString().split("T")[0];
    forms.cards.date = today;
    forms.fire.checkDate = today;
    forms.danger.date = today;
    forms.tracking.date = today;
  });
  
  const goSafePage = () => {
    console.log("go safe page, ", "u xxx");
    router.push('/sd')
  };
  
  const updateTime = () => {
    const now = new Date();
    currentTime.value = now.toLocaleString("zh-CN", { hour12: false });
  };
  
  // 2. 辅助函数
  const formatDate = (val) => {
    if (!val) return "";
    const d = new Date(val);
    return d.toLocaleString("zh-CN", { hour12: false });
  };
  const getLevelType = (level) => {
    const map = {
      局级: "danger",
      段级: "warning",
      车间级: "info",
      班组级: "success",
    };
    return map[level] || "info";
  };
  const getColorCode = (name) => {
    const map = { 红色: "#f56c6c", 黄色: "#e6a23c", 白色: "#ffffff" };
    return map[name] || "#eee";
  };
  const getTrackingTag = (status) => {
    const map = { pending: "warning", processing: "", completed: "success" };
    return map[status] || "info";
  };
  
  // 3. CRUD 操作
  const generateId = (prefix, list) => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const count = String(list.length + 1).padStart(3, "0");
    return `${prefix}${dateStr}${count}`;
  };
  
  const submitForm = (type) => {
    const form = forms[type];
    // 简单验证: 检查是否有空值 (实际项目可以用 el-form rules)
    if (Object.values(form).some((v) => v === "" || v === null)) {
      ElMessage.warning("请填写所有必填项");
      return;
    }
  
    let newItem = { ...form };
  
    // 特殊处理
    if (type === "safety") {
      newItem.id = generateId("AQ", mockData.safety);
    } else if (type === "cards") {
      newItem.id = generateId("PK", mockData.cards);
    } else if (type === "fire") {
      newItem.id = generateId("XF", mockData.fire);
      // 计算下次检查
      const d = new Date(newItem.checkDate);
      d.setDate(d.getDate() + 7);
      newItem.nextCheck = d.toISOString().split("T")[0];
      newItem.lastChecked = newItem.checkDate;
      newItem.isOverdue = false;
    } else if (type === "danger") {
      newItem.id = generateId("YH", mockData.danger);
    } else if (type === "tracking") {
      newItem.id = generateId("XG", mockData.tracking);
      const statusMap = {
        pending: "待反馈",
        processing: "办理中",
        completed: "已完成",
      };
      newItem.statusText = statusMap[newItem.status];
    }
  
    mockData[type].unshift(newItem);
    ElMessage.success("记录添加成功");
    resetForm(type);
  };
  
  const resetForm = (type) => {
    // 简单重置，实际可根据需要保留部分字段
    Object.keys(forms[type]).forEach((k) => {
      if (k === "progress") forms[type][k] = 0;
      else if (k.includes("ate"))
        forms[type][k] = new Date().toISOString().split("T")[0]; // 重置日期为今天
      else forms[type][k] = "";
    });
  };
  
  const handleDelete = (id, type) => {
    ElMessageBox.confirm("确定要删除这条记录吗?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      mockData[type] = mockData[type].filter((item) => item.id !== id);
      ElMessage.success("删除成功");
    });
  };
  
  const refreshData = (type) => {
    // 模拟刷新
    setTimeout(() => ElMessage.success("数据已刷新"), 500);
  };
  
  const showDetail = (row, type) => {
    currentDetail.value = row;
    const titles = {
      safety: "安全问题",
      cards: "牌卡信息",
      fire: "消防巡检",
      danger: "隐患信息",
      tracking: "跟踪信息",
    };
    detailTitle.value = titles[type] + "详情";
    detailVisible.value = true;
  };
  
  const handleLogout = () => {
    ElMessageBox.confirm("确定退出登录?", "提示").then(() => {
      ElMessage.success("已退出");
    });
  };
  </script>
    
  <style lang="scss" scoped>
  
  // 变量定义 (仿照 Tailwind 配置)
  $primary: #1e40af;
  $bg-main: #f9fafb;
  $border-color: #e2e8f0;
  
  .app-container {
    height: 100vh;
    background-color: $bg-main;
    display: flex;
    flex-direction: column;
  }
  
  // Header
  .main-header {
    background-color: $primary;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  
    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;
      .logo-icon {
        font-size: 24px;
      }
      .app-title {
        font-size: 18px;
        font-weight: bold;
        margin: 0;
      }
    }
  
    .header-right {
      display: flex;
      align-items: center;
      gap: 15px;
      .user-info {
        font-size: 14px;
        opacity: 0.9;
      }
      .logout-btn {
        color: #666;
        &:hover {
          color: #999;
        }
      }
    }
  }
  
  // Main Content
  .main-content {
    padding: 20px;
    overflow-y: auto;
  }
  
  // Tabs
  .content-tabs {
    background: white;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    min-height: calc(100vh - 140px);
  
    :deep(.el-tabs__item) {
      font-size: 15px;
      height: 45px;
      &.is-active {
        color: $primary;
        font-weight: bold;
      }
    }
    .tab-label {
      display: flex;
      align-items: center;
      gap: 5px;
    }
  }
  
  // Pane Layout (Grid simulation)
  .pane-layout {
    display: flex;
    gap: 20px;
    margin-top: 15px;
  
    @media (max-width: 992px) {
      flex-direction: column;
    }
  
    .form-card {
      flex: 1; // 1/3 width approx
      min-width: 300px;
  
      .card-header {
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 5px;
        color: #334155;
      }
      .icon-blue {
        color: #3b82f6;
      }
      .form-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
      }
    }
  
    .table-card {
      flex: 2; // 2/3 width approx
  
      .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .card-header {
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 5px;
          color: #334155;
        }
        .icon-blue {
          color: #3b82f6;
        }
        .header-search {
          display: flex;
          gap: 10px;
          width: 250px;
        }
      }
      .pagination-wrapper {
        margin-top: 15px;
        display: flex;
        justify-content: flex-end;
      }
      .color-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 1px solid #ddd;
        margin: 0 auto;
      }
    }
  }
  
  // Footer
  .main-footer {
    background-color: #334155;
    color: white;
    text-align: center;
    padding: 15px 0;
    font-size: 12px;
    height: auto;
    .footer-time {
      color: #94a3b8;
      margin-top: 5px;
    }
  }
  
  // Detail Dialog
  .detail-content {
    .detail-row {
      display: flex;
      border-bottom: 1px solid #f1f5f9;
      padding: 10px 0;
      .detail-label {
        width: 80px;
        color: #64748b;
        font-weight: 500;
      }
      .detail-value {
        color: #334155;
        font-weight: bold;
      }
    }
    .detail-block {
      margin-top: 15px;
      .detail-label-block {
        color: #64748b;
        margin-bottom: 5px;
      }
      .detail-text-box {
        background: #f8fafc;
        padding: 10px;
        border-radius: 4px;
        color: #334155;
      }
    }
  }
  </style>