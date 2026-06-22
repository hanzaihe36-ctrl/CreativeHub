<template>
  <AdminLayout>
    <div class="upload-page">
      <h1 class="page-title">上传作品</h1>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" class="upload-form">
        <el-row :gutter="24">
          <el-col :span="16">
            <!-- 基本信息 -->
            <div class="form-section">
              <h2>基本信息</h2>
              <el-form-item label="作品标题" prop="title">
                <el-input v-model="form.title" placeholder="请输入作品标题（3-50字符）" maxlength="50" show-word-limit />
              </el-form-item>
              <el-form-item label="作品描述" prop="description">
                <el-input v-model="form.description" type="textarea" :rows="5" placeholder="请描述你的作品（10-500字符）" maxlength="500" show-word-limit />
              </el-form-item>
              <el-row :gutter="16">
                <el-col :span="12">
                  <el-form-item label="分类" prop="categoryId">
                    <el-select v-model="form.categoryId" placeholder="选择分类" style="width: 100%">
                      <el-option v-for="cat in categoryStore.categories" :key="cat.id" :label="cat.name" :value="cat.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="标签（最多5个）" prop="tags">
                    <el-select v-model="form.tags" multiple filterable allow-create placeholder="输入标签后回车添加" style="width: 100%" :multiple-limit="5">
                      <el-option v-for="tag in categoryStore.tags" :key="tag.name" :label="tag.name" :value="tag.name" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="使用工具">
                <el-select v-model="form.toolsUsed" multiple filterable allow-create placeholder="如：Photoshop、Figma" style="width: 100%">
                  <el-option v-for="tool in commonTools" :key="tool" :label="tool" :value="tool" />
                </el-select>
              </el-form-item>
            </div>

            <!-- 图片上传 -->
            <div class="form-section">
              <h2>作品图片（1-9张）</h2>
              <div class="image-upload-area">
                <div v-for="(img, i) in form.images" :key="i" class="image-preview">
                  <img :src="img" />
                  <el-button class="img-remove" type="danger" size="small" circle @click="removeImage(i)">
                    <el-icon><Close /></el-icon>
                  </el-button>
                  <span class="img-index">{{ i + 1 }}</span>
                </div>
                <div v-if="form.images.length < 9" class="upload-btn" @click="triggerUpload">
                  <el-icon :size="32"><Plus /></el-icon>
                  <span>添加图片</span>
                  <input ref="fileInput" type="file" accept="image/*" multiple hidden @change="handleFileChange" />
                </div>
              </div>
            </div>
          </el-col>

          <!-- 侧边提示 -->
          <el-col :span="8">
            <div class="tips-panel">
              <h3>上传须知</h3>
              <ul>
                <li>图片格式支持 JPG、PNG、GIF</li>
                <li>至少上传 1 张，最多 9 张</li>
                <li>第一张图片将作为封面展示</li>
                <li>标题和描述要认真填写，有助于作品被发现</li>
              </ul>
            </div>
          </el-col>
        </el-row>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <el-button @click="saveDraft" :loading="submitting">保存草稿</el-button>
          <el-button type="primary" @click="publish" :loading="submitting">立即发布</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </div>
      </el-form>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWorkStore, useUserStore, useCategoryStore } from '@/stores'
import { ElMessage } from 'element-plus'
import AdminLayout from '@/components/AdminLayout.vue'

const router = useRouter()
const workStore = useWorkStore()
const userStore = useUserStore()
const categoryStore = useCategoryStore()

const formRef = ref(null)
const fileInput = ref(null)
const submitting = ref(false)

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
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
  tags: [{ type: 'array', max: 5, message: '最多5个标签', trigger: 'change' }]
}

const commonTools = ['Photoshop', 'Illustrator', 'Figma', 'Sketch', 'Procreate', 'Blender', 'Lightroom', 'Premiere', 'After Effects', 'DaVinci', 'Capture One', 'InDesign']

function triggerUpload() { fileInput.value.click() }

function handleFileChange(e) {
  const files = Array.from(e.target.files)
  const remaining = 9 - form.images.length
  if (files.length > remaining) {
    ElMessage.warning(`最多还能添加 ${remaining} 张图片`)
    return
  }
  files.forEach(file => {
    if (file.size > 5 * 1024 * 1024) { ElMessage.warning(`${file.name} 超过5MB`); return }
    const reader = new FileReader()
    reader.onload = () => { form.images.push(reader.result) }
    reader.readAsDataURL(file)
  })
  fileInput.value.value = ''
}

function removeImage(i) { form.images.splice(i, 1) }

async function submit(status) {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  if (form.images.length === 0) { ElMessage.warning('请至少上传一张图片'); return }
  submitting.value = true
  try {
    await workStore.createWork({
      ...form,
      coverImage: form.images[0],
      authorId: userStore.currentUserId,
      status
    })
    ElMessage.success(status === 'published' ? '作品发布成功！' : '已保存到草稿箱')
    router.push('/manage/works')
  } catch (e) {
    ElMessage.error('操作失败')
  } finally {
    submitting.value = false
  }
}

function saveDraft() { submit('draft') }
function publish() { submit('published') }

onMounted(async () => {
  if (!categoryStore.categories.length) await categoryStore.fetchCategories()
  if (!categoryStore.tags.length) await categoryStore.fetchTags()
})
</script>

<style scoped>
.page-title { font-size: 22px; font-weight: 700; margin-bottom: 24px; }
.upload-form { max-width: 100%; }
.form-section { background: #fff; padding: 24px; border-radius: 8px; box-shadow: var(--shadow-sm); margin-bottom: 20px; }
.form-section h2 { font-size: var(--font-size-md); font-weight: 600; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid var(--color-bg); }

.image-upload-area { display: flex; flex-wrap: wrap; gap: 12px; }
.image-preview { position: relative; width: 120px; height: 90px; border-radius: 6px; overflow: hidden; }
.image-preview img { width: 100%; height: 100%; object-fit: cover; }
.img-remove { position: absolute; top: 2px; right: 2px; }
.img-index { position: absolute; bottom: 2px; left: 4px; font-size: 11px; color: #fff; background: rgba(0,0,0,0.5); padding: 0 4px; border-radius: 2px; }
.upload-btn { width: 120px; height: 90px; border: 2px dashed #ddd; border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--color-text-light); cursor: pointer; transition: border-color var(--transition-fast); }
.upload-btn:hover { border-color: var(--color-secondary); color: var(--color-secondary); }
.upload-btn span { font-size: 12px; margin-top: 2px; }

.tips-panel { background: #fff; padding: 20px; border-radius: 8px; box-shadow: var(--shadow-sm); }
.tips-panel h3 { font-size: var(--font-size-base); font-weight: 600; margin-bottom: 12px; }
.tips-panel ul { font-size: var(--font-size-sm); color: var(--color-text-light); padding-left: 18px; }
.tips-panel li { margin-bottom: 6px; }

.form-actions { display: flex; gap: 12px; padding-top: 8px; }
</style>
