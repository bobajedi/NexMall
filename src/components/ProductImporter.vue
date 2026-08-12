<template>
  <div class="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100">
    <h2 class="text-xl font-bold mb-4 text-gray-800">Toplu Ürün Yükleme</h2>

    <!-- Drag & Drop Alanı -->
    <div
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
      :class="[
        'border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer select-none',
        isDragging ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
      ]"
    >
      <input
        ref="fileInput"
        type="file"
        accept=".xlsx, .xls, .csv"
        class="hidden"
        @change="handleFileSelect"
      />

      <div class="flex flex-col items-center justify-center gap-2">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p class="text-sm font-medium text-gray-700">
          Tablo dosyasını buraya sürükleyin veya <span class="text-indigo-600 underline">seçin</span>
        </p>
        <p class="text-xs text-gray-400">Desteklenen formatlar: .xlsx, .xls, .csv</p>
      </div>
    </div>

    <!-- Durum ve Yükleme Göstergesi -->
    <div v-if="loading" class="mt-4 text-center text-sm text-indigo-600 font-medium animate-pulse">
      Dosya işleniyor ve ürünler aktarılıyor...
    </div>

    <!-- Sonuç Bildirimi -->
    <div v-if="result" class="mt-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
      <p class="font-semibold">İşlem Tamamlandı!</p>
      <ul class="mt-1 list-disc list-inside text-xs space-y-1">
        <li>Toplam Satır: {{ result.totalProcessed }}</li>
        <li>Başarıyla Eklenen: {{ result.insertedCount }}</li>
        <li v-if="result.failedCount > 0" class="text-rose-600 font-medium">Hatalı Satır: {{ result.failedCount }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isDragging = ref(false)
const loading = ref(false)
const result = ref(null)
const fileInput = ref(null)

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) uploadFile(file)
}

const handleDrop = (event) => {

  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file) uploadFile(file)
}

const uploadFile = async (file) => {
  const allowedExtensions = ['xlsx', 'xls', 'csv']
  const ext = file.name.split('.').pop().toLowerCase()
  
  if (!allowedExtensions.includes(ext)) {
    alert('Lütfen geçerli bir Excel (.xlsx, .xls) veya CSV (.csv) dosyası yükleyin.')
    return
  }

  loading.value = true
  result.value = null

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch('/api/products/import', {
      method: 'POST',
      body: formData
    })

    const data = await response.json()
    if (response.ok) {
      result.value = data
    } else {
      alert(data.error || 'İçe aktarma sırasında bir hata oluştu.')
    }
  } catch (error) {
    console.error('Yükleme hatası:', error)
    alert('Sunucuya bağlanırken bir hata oluştu.')
  } finally {
    loading.value = false
  }
}
</script>