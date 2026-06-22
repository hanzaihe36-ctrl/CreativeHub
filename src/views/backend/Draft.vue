<template>
  <AdminLayout>
    <div class="draft-page">
      <h1 class="page-title">草稿箱</h1>

      <el-table :data="drafts" stripe v-loading="loading" empty-text="暂无草稿">
        <el-table-column label="封面" width="80">
          <template #default="{ row }">
            <img :src="row.coverImage" class="table-cover" v-if="row.coverImage" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="categoryName" label="分类" width="100" />
        <el-table-column label="创建时间" width="120">
          <template #default="{ row }">{{ formatDate(row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="editWork(row.id)">编辑</el-button>
            <el-button size="small" type="success" @click="publishWork(row)">发布</el-button>
            <el-button size="small" type="danger" link @click="deleteDraft(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWorkStore, useUserStore } from '@/stores'
import { formatDate } from '@/utils/date'
import { ElMessage, ElMessageBox } from 'element-plus'
import AdminLayout from '@/components/AdminLayout.vue'

const router = useRouter()
const workStore = useWorkStore()
const userStore = useUserStore()

const drafts = ref([])
const loading = ref(false)

async function fetchDrafts() {
  loading.value = true
  try {
    const res = await workStore.fetchWorks({
      authorId: userStore.currentUserId,
      status: 'draft',
      page: 1,
      pageSize: 50
    })
    drafts.value = res.items
  } finally { loading.value = false }
}

function editWork(id) { router.push(`/edit/${id}`) }

async function publishWork(row) {
  try {
    await workStore.updateWork(row.id, { status: 'published', publishTime: Date.now() })
    ElMessage.success('作品已发布')
    fetchDrafts()
  } catch { ElMessage.error('发布失败') }
}

async function deleteDraft(row) {
  try {
    await ElMessageBox.confirm(`确定删除草稿"${row.title}"吗？`, '确认', { type: 'warning' })
    await workStore.deleteWork(row.id)
    ElMessage.success('已删除')
    fetchDrafts()
  } catch { /* cancelled */ }
}

onMounted(fetchDrafts)
</script>

<style scoped>
.page-title { font-size: 22px; font-weight: 700; margin-bottom: 20px; }
.table-cover { width: 48px; height: 36px; object-fit: cover; border-radius: 4px; }
</style>
