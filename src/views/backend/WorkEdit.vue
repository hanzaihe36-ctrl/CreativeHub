<template>
  <AdminLayout>
    <div class="edit-page">
      <h1 class="page-title">编辑作品</h1>

      <el-form v-if="loaded" ref="formRef" :model="form" :rules="rules" label-position="top" class="upload-form" v-loading="loading">
        <el-row :gutter="24">
          <el-col :span="16">
            <div class="form-section">
              <h2>基本信息</h2>
              <el-form-item label="作品标题" prop="title">
                <el-input v-model="form.title" placeholder="请输入作品标题" maxlength="50" show-word-limit />
              </el-form-item>
              <el-form-item label="作品描述" prop="description">
                <el-input v-model="form.description" type="textarea" :rows="5" maxlength="500" show-word-limit />
              </el-form-item>
              <el-row :gutter="16">
                <el-col :span="12">
                  <el-form-item label="分类" prop="categoryId">
                    <el-select v-model="form.categoryId" style="width: 100%">
                      <el-option v-for="cat in categoryStore.categories" :key="cat.id" :label="cat.name" :value="cat.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="标签">
                    <el-select v-model="form.tags" multiple filterable allow-create style="width: 100%" :multiple-limit="5">
                      <el-option v-for="tag in categoryStore.tags" :key="tag.name" :label="tag.name" :value="tag.name" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="使用工具">
                <el-select v-model="form.toolsUsed" multiple filterable allow-create style="width: 100%">
                  <el-option v-for="tool in commonTools" :key="tool" :label="tool" :value="tool" />
                </el-select>
              </el-form-item>
            </div>

            <div class="form-section">
              <h2>作品图片（1-9张）</h2>
              <div class="image-upload-area">
                <div v-for="(img, i) in form.images" :key="i" class="image-preview">
                  <img :src="img" />
                  <el-button class="img-remove" type="danger" size="small" circle @click="removeImage(i)">
                    <el-icon><Close /></el-icon>
                  </el-button>
                </div>
                <div v-if="form.images.length < 9" class="upload-btn" @click="triggerUpload">
                  <el-icon :size="32"><Plus /></el-icon>
                  <span>添加图片</span>
                  <input ref="fileInput" type="file" accept="image/*" multiple hidden @change="handleFileChange" />
                </div>
              </div>
            </div>
          </el-col>
        </el-row>

        <div class="form-actions">
          <el-button type="primary" @click="save" :loading="saving">保存修改</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </div>
      </el-form>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWorkStore, useCategoryStore } from '@/stores'
import { ElMessage } from 'element-plus'
import AdminLayout from '@/components/AdminLayout.vue'

const route = useRoute()
const router = useRouter()
const workStore = useWorkStore()
const categoryStore = useCategoryStore()

const formRef = ref(null)
const fileInput = ref(null)
const loading = ref(true)
const saving = ref(false)
const loaded = ref(false)

const form = reactive({
  title: '',
  description: '',
  categoryId: null,
  tags: [],
  toolsUsed: [],
  images: []
})

const rules = {
  title: [
    { required: true, message: '请输入作品标题', trigger: 'blur' },
    { min: 3, max: 50, message: '3-50个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入作品描述', trigger: 'blur' },
    { min: 10, max: 500, message: '10-500个字符', trigger: 'blur' }
  ],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }]
}

const commonTools = ['Photoshop', 'Illustrator', 'Figma', 'Sketch', 'Procreate', 'Blender', 'Lightroom', 'Premiere', 'After Effects', 'DaVinci', 'Capture One', 'InDesign']

function triggerUpload() { fileInput.value.click() }
function handleFileChange(e) {
  const files = Array.from(e.target.files)
  files.forEach(file => {
    if (file.size > 5 * 1024 * 1024) { ElMessage.warning(`${file.name} 超过5MB`); return }
    const reader = new FileReader()
    reader.onload = () => { form.images.push(reader.result) }
    reader.readAsDataURL(file)
  })
  fileInput.value.value = ''
}
function removeImage(i) { form.images.splice(i, 1) }

async function save() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    await workStore.updateWork(Number(route.params.id), {
      ...form,
      coverImage: form.images[0]
    })
    ElMessage.success('作品已更新')
    router.push('/manage/works')
  } catch { ElMessage.error('更新失败') }
  finally { saving.value = false }
}

onMounted(async () => {
  if (!categoryStore.categories.length) await categoryStore.fetchCategories()
  if (!categoryStore.tags.length) await categoryStore.fetchTags()
  const id = Number(route.params.id)
  if (id) {
    const work = await workStore.fetchWorkDetail(id)
    Object.assign(form, {
      title: work.title,
      description: work.description,
      categoryId: work.categoryId,
      tags: work.tags,
      toolsUsed: work.toolsUsed,
      images: work.images
    })
    loaded.value = true
  }
  loading.value = false
})
</script>

<style scoped>
.page-title { font-size: 22px; font-weight: 700; margin-bottom: 24px; }
.form-section { background: #fff; padding: 24px; border-radius: 8px; box-shadow: var(--shadow-sm); margin-bottom: 20px; }
.form-section h2 { font-size: var(--font-size-md); font-weight: 600; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid var(--color-bg); }
.image-upload-area { display: flex; flex-wrap: wrap; gap: 12px; }
.image-preview { position: relative; width: 120px; height: 90px; border-radius: 6px; overflow: hidden; }
.image-preview img { width: 100%; height: 100%; object-fit: cover; }
.img-remove { position: absolute; top: 2px; right: 2px; }
.upload-btn { width: 120px; height: 90px; border: 2px dashed #ddd; border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--color-text-light); cursor: pointer; }
.upload-btn:hover { border-color: var(--color-secondary); color: var(--color-secondary); }
.upload-btn span { font-size: 12px; margin-top: 2px; }
.form-actions { display: flex; gap: 12px; padding-top: 8px; }
</style>
