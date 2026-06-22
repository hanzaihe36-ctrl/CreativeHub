<template>
  <AdminLayout>
    <div class="settings-page">
      <h1 class="page-title">个人设置</h1>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" class="settings-form" v-if="userStore.currentUser">
        <div class="form-section">
          <h2>基本信息</h2>
          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username" maxlength="20" show-word-limit />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱">
                <el-input :value="userStore.currentUser.email" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="个人简介">
            <el-input v-model="form.bio" type="textarea" :rows="3" maxlength="200" show-word-limit placeholder="介绍一下你自己..." />
          </el-form-item>
          <el-form-item label="技能标签">
            <el-select v-model="form.skills" multiple filterable allow-create placeholder="如：Figma、Photoshop" style="width: 100%">
              <el-option v-for="s in skillOptions" :key="s" :label="s" :value="s" />
            </el-select>
          </el-form-item>
          <el-form-item label="个人网站">
            <el-input v-model="form.website" placeholder="https://..." />
          </el-form-item>
        </div>

        <div class="form-section">
          <h2>修改密码</h2>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="form.newPassword" type="password" placeholder="留空则不修改" show-password />
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input v-model="form.confirmPassword" type="password" placeholder="留空则不修改" show-password />
          </el-form-item>
        </div>

        <div class="form-actions">
          <el-button type="primary" @click="save" :loading="saving">保存设置</el-button>
        </div>
      </el-form>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import AdminLayout from '@/components/AdminLayout.vue'

const userStore = useUserStore()
const formRef = ref(null)
const saving = ref(false)

const form = reactive({
  username: '',
  bio: '',
  skills: [],
  website: '',
  newPassword: '',
  confirmPassword: ''
})

const rules = {
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 3, max: 20, message: '3-20个字符', trigger: 'blur' }
  ],
  confirmPassword: {
    validator: (rule, value, cb) => {
      if (form.newPassword && value !== form.newPassword) return cb('两次密码不一致')
      cb()
    },
    trigger: 'blur'
  }
}

const skillOptions = ['Figma', 'Sketch', 'Photoshop', 'Illustrator', 'Procreate', 'Blender', 'Lightroom', 'Premiere', 'After Effects', 'DaVinci', 'InDesign']

async function save() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    const data = {
      username: form.username,
      bio: form.bio,
      skills: form.skills,
      website: form.website
    }
    if (form.newPassword) {
      data.password = form.newPassword
    }
    await userStore.updateProfile(userStore.currentUserId, data)
    ElMessage.success('设置已保存')
  } catch { ElMessage.error('保存失败') }
  finally { saving.value = false }
}

onMounted(() => {
  const u = userStore.currentUser
  if (u) {
    form.username = u.username || ''
    form.bio = u.bio || ''
    form.skills = u.skills || []
    form.website = u.website || ''
  }
})
</script>

<style scoped>
.page-title { font-size: 22px; font-weight: 700; margin-bottom: 24px; }
.settings-form { max-width: 700px; }
.form-section { background: #fff; padding: 24px; border-radius: 8px; box-shadow: var(--shadow-sm); margin-bottom: 20px; }
.form-section h2 { font-size: var(--font-size-md); font-weight: 600; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid var(--color-bg); }
.form-actions { padding-top: 8px; }
</style>
