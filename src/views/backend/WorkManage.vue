<template>
  <AdminLayout>
    <div class="work-manage-page">
      <div class="page-header">
        <h1 class="page-title">作品管理</h1>
        <el-button type="primary" @click="$router.push('/upload')">
          <el-icon><Upload /></el-icon> 上传作品
        </el-button>
      </div>

      <!-- 搜索 + 筛选 -->
      <div class="toolbar">
        <el-input v-model="searchKeyword" placeholder="搜索作品标题..." prefix-icon="Search" clearable style="width: 240px" @input="handleSearch" />
        <el-select v-model="filterCategory" placeholder="按分类筛选" clearable style="width: 150px" @change="handleFilter">
          <el-option v-for="cat in categoryStore.categories" :key="cat.id" :label="cat.name" :value="cat.id" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="按状态筛选" clearable style="width: 130px" @change="handleFilter">
          <el-option label="已发布" value="published" />
          <el-option label="草稿" value="draft" />
        </el-select>
      </div>

      <!-- 表格 -->
      <el-table :data="works" stripe v-loading="loading" style="width: 100%">
        <el-table-column label="封面" width="80">
          <template #default="{ row }">
            <video v-if="isVideoCover(row.coverImage)" :src="row.coverImage" muted preload="metadata" class="table-cover"></video>
            <img v-else :src="row.coverImage" class="table-cover" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip />
        <el-table-column prop="categoryName" label="分类" width="100" />
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'info'" size="small">
              {{ row.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="views" label="浏览" width="80" sortable />
        <el-table-column prop="likes" label="点赞" width="80" sortable />
        <el-table-column label="发布时间" width="120">
          <template #default="{ row }">{{ row.publishTime ? formatDate(row.publishTime) : '-' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="editWork(row.id)">编辑</el-button>
            <el-button size="small" type="danger" link @click="confirmDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrap" v-if="total > pageSize">
        <el-pagination
          v-model:current-page="page"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next, total"
          @change="fetchData"
        />
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWorkStore, useUserStore, useCategoryStore } from '@/stores'
import { formatDate } from '@/utils/date'
import { ElMessage, ElMessageBox } from 'element-plus'
import AdminLayout from '@/components/AdminLayout.vue'

const router = useRouter()

function isVideoCover(url) {
  return /\.(mp4|webm|mov)($|\?)/i.test(url || '')
}
const workStore = useWorkStore()
const userStore = useUserStore()
const categoryStore = useCategoryStore()

const works = ref([])
const loading = ref(false)
const total = ref(0)
const page = ref(1)
const pageSize = 10
const searchKeyword = ref('')
const filterCategory = ref(null)
const filterStatus = ref(null)

async function fetchData() {
  loading.value = true
  try {
    const params = {
      authorId: userStore.currentUserId,
      page: page.value,
      pageSize,
      sort: 'latest'
    }
    if (searchKeyword.value) params.keyword = searchKeyword.value
    if (filterCategory.value) params.categoryId = filterCategory.value
    if (filterStatus.value) params.status = filterStatus.value
    const res = await workStore.fetchWorks(params)
    works.value = res.items
    total.value = res.total
  } finally {
    loading.value = false
  }
}

function handleSearch() { page.value = 1; fetchData() }
function handleFilter() { page.value = 1; fetchData() }

function editWork(id) { router.push(`/edit/${id}`) }

async function confirmDelete(row) {
  try {
    await ElMessageBox.confirm(`确定删除作品"${row.title}"吗？此操作不可恢复。`, '确认删除', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消'
    })
    await workStore.deleteWork(row.id)
    ElMessage.success('已删除')
    fetchData()
  } catch { /* cancelled */ }
}

onMounted(async () => {
  if (!categoryStore.categories.length) await categoryStore.fetchCategories()
  fetchData()
})
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-title { font-size: 22px; font-weight: 700; }
.toolbar { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.table-cover { width: 48px; height: 36px; object-fit: cover; border-radius: 4px; display: block; }
.pagination-wrap { margin-top: 16px; display: flex; justify-content: flex-end; }
</style>
