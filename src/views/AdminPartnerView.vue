<template>
  <div class="min-h-screen bg-[#f4f6f9] py-8 px-4 md:px-8">
    <div class="max-w-7xl mx-auto space-y-8">
      
      <!-- Shiriti i Sipërm / Paneli i Profilit -->
      <div class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span class="text-[10px] font-black bg-[#d61f43]/10 text-[#d61f43] px-2.5 py-1 rounded-md uppercase tracking-wider inline-block mb-1">
            Qendra e Kontrollit të Administratorit
          </span>
          <h1 class="text-xl font-black text-gray-900 uppercase tracking-tight">
            🤝 Pustina e Aplikimeve për Partneritet & Bashkëpunim
          </h1>
        </div>

        <div class="flex items-center gap-3">
          <router-link 
            to="/dashboard" 
            class="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-black uppercase rounded-xl transition shadow-sm active:scale-[0.97]"
          >
            Kthehu te Paneli i Shitësit
          </router-link>
        </div>
      </div>

      <!-- Zona e Përmbajtjes -->
      <div class="grid grid-cols-1 gap-8">
        
        <div class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 class="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            📋 Aplikimet e Ardhura për Partneritet (CRM)
          </h2>

          <div v-if="partnerApplications.length === 0" class="text-center py-12 text-gray-400 text-xs font-bold uppercase">
            Nuk ka ende asnjë aplikim për partneritet.
          </div>

          <div v-else class="space-y-4">
            <div 
              v-for="partner in partnerApplications" 
              :key="partner.id"
              class="border border-gray-100 bg-gray-50 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition hover:bg-white"
            >
              <div class="space-y-2">
                <div class="flex items-center gap-3">
                  <h3 class="text-sm font-black text-gray-900 uppercase tracking-tight">{{ partner.companyName }}</h3>
                  <span 
                    class="px-2 py-0.5 text-[9px] font-black uppercase rounded-md"
                    :class="{
                      'bg-amber-100 text-amber-700': partner.status === 'pending',
                      'bg-emerald-100 text-emerald-700': partner.status === 'approved',
                      'bg-red-100 text-red-700': partner.status === 'rejected'
                    }"
                  >
                    {{ partner.status === 'pending' ? 'Në Shqyrtim' : (partner.status === 'approved' ? 'E Miratuar' : 'E Refuzuar') }}
                  </span>
                </div>
                
                <div class="text-xs text-gray-600 font-bold space-y-1">
                  <p>👤 Përfaqësuesi: <span class="text-gray-900">{{ partner.contactName }}</span> | 📞 {{ partner.phone }} | ✉️ {{ partner.email }}</p>
                  <p class="text-gray-500 font-normal bg-white p-3 rounded-xl border border-gray-100 mt-1">
                    💬 <strong>Mesazhi:</strong> {{ partner.message || 'Nuk është specifikuar' }}
                  </p>
                </div>
                
                <span class="text-[10px] text-gray-400 font-mono block">Data e Aplikimit: {{ partner.date }}</span>
              </div>

              <!-- Butonat e Aksionit -->
              <div class="flex gap-2 w-full md:w-auto">
                <button 
                  @click="handleStatus(partner.id, 'approved')" 
                  class="flex-1 md:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase rounded-xl transition shadow-sm active:scale-[0.98]"
                >
                  Mirato ✓
                </button>
                <button 
                  @click="handleStatus(partner.id, 'rejected')" 
                  class="flex-1 md:flex-none px-4 py-2.5 bg-red-100 hover:bg-red-200 text-red-600 text-xs font-black uppercase rounded-xl transition active:scale-[0.98]"
                >
                  Refuzo ✕
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { partnerApplications, updatePartnerStatus } from '../store/productStore'

const handleStatus = (id, status) => {
  const success = updatePartnerStatus(id, status)
  if (success) {
    // Store aktivizohet për përditësimin reaktiv të faqes
  }
}
</script>