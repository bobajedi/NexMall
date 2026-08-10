<template>
  <div class="min-h-screen bg-[#f4f6f9] py-8 px-4 md:px-8 text-gray-800">
    <div class="max-w-7xl mx-auto space-y-6">

      <div class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-xl font-black text-gray-900 uppercase tracking-tight">
            {{ lang === 'en' ? `Hello, ${currentUser?.name || 'Edi'}` : `Tung ${currentUser?.name || 'Edi'}` }}
          </h1>
          <p class="text-xs font-bold text-gray-400 mt-0.5">
            {{ lang === 'en' ? 'Thank you for being a part of NexMall' : 'Faleminderit që je pjesë e NexMall' }}
          </p>
        </div>
        <router-link to="/" class="px-4 py-2 bg-gray-900 hover:bg-[#d61f43] text-white text-xs font-black uppercase rounded-xl transition shadow-sm">
          {{ lang === 'en' ? '← Back to Home' : '← Kthehu te Kryefaqja' }}
        </router-link>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

        <div class="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm space-y-1">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition',
              activeTab === tab.id 
                ? 'bg-[#d61f43]/10 text-[#d61f43]' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            <div class="flex items-center gap-3">
              <span class="text-base">{{ tab.icon }}</span>
              <span>{{ lang === 'en' ? tab.en : tab.al }}</span>
            </div>
            <span v-if="tab.id === 'wishlist' && wishlist.length > 0" class="bg-[#d61f43] text-white text-[10px] px-2 py-0.5 rounded-full font-mono">
              {{ wishlist.length }}
            </span>
            <span v-if="tab.id === 'cards' && savedCards.length > 0" class="bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded-full font-mono">
              {{ savedCards.length }}
            </span>
          </button>
        </div>

        <div class="lg:col-span-3 bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">

          <div v-if="activeTab === 'personal'" class="space-y-6">
            <h2 class="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center justify-between">
              <span>{{ lang === 'en' ? 'Personal Information' : 'Të dhënat tuaja personale' }}</span>
              <span class="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono uppercase">{{ lang === 'en' ? 'Active Account' : 'Llogari Aktive' }}</span>
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-wider">{{ lang === 'en' ? 'First Name *' : 'Emri *' }}</label>
                <input v-model="profileForm.name" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-900 outline-none focus:border-[#d61f43] focus:bg-white transition" />
              </div>

              <div class="space-y-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-wider">{{ lang === 'en' ? 'Last Name *' : 'Mbiemri *' }}</label>
                <input v-model="profileForm.surname" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-900 outline-none focus:border-[#d61f43] focus:bg-white transition" />
              </div>

              <div class="space-y-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-wider">{{ lang === 'en' ? 'Email *' : 'Email *' }}</label>
                <input v-model="profileForm.email" type="email" disabled class="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-2xl text-xs font-bold text-gray-500 cursor-not-allowed" />
              </div>

              <div class="space-y-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-wider">{{ lang === 'en' ? 'Date of Birth' : 'Data e lindjes' }}</label>
                <input v-model="profileForm.birthDate" type="text" placeholder="DD/MM/YYYY" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-900 outline-none focus:border-[#d61f43] focus:bg-white transition" />
              </div>

              <div class="space-y-1.5 md:col-span-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-wider">{{ lang === 'en' ? 'Gender' : 'Gjinia' }}</label>
                <div class="flex items-center gap-6 pt-2">
                  <label class="flex items-center gap-2 cursor-pointer text-xs font-bold">
                    <input type="radio" v-model="profileForm.gender" value="Mashkull" class="accent-[#d61f43]" /> 
                    {{ lang === 'en' ? 'Male' : 'Mashkull' }}
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer text-xs font-bold">
                    <input type="radio" v-model="profileForm.gender" value="Femër" class="accent-[#d61f43]" /> 
                    {{ lang === 'en' ? 'Female' : 'Femër' }}
                  </label>
                </div>
              </div>
            </div>

            <div class="flex justify-end pt-4 border-t border-gray-100">
              <button @click="saveProfile" class="px-8 py-3 bg-[#d61f43] hover:bg-[#b51433] text-white font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-md active:scale-95 cursor-pointer">
                {{ lang === 'en' ? 'SAVE' : 'RUAJ' }}
              </button>
            </div>
          </div>

          <div v-if="activeTab === 'addresses'" class="space-y-6">
            <div class="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 class="text-sm font-black text-gray-900 uppercase tracking-wider">
                {{ lang === 'en' ? 'Delivery Addresses' : 'Adresat e Dërgesës' }}
              </h2>
              <button @click="showAddressModal = true" class="px-4 py-2 bg-gray-900 hover:bg-[#d61f43] text-white text-[11px] font-black uppercase rounded-xl transition shadow-sm cursor-pointer">
                + {{ lang === 'en' ? 'Add New Address' : 'Shto Adresë të Re' }}
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(addr, index) in savedAddresses" :key="index" class="p-5 bg-gray-50 border border-gray-200/80 rounded-2xl flex flex-col justify-between gap-4 relative group">
                <div class="space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-black bg-red-100 text-[#d61f43] px-2 py-0.5 rounded uppercase font-mono">{{ addr.title }}</span>
                    <button @click="deleteAddress(index)" class="text-gray-400 hover:text-red-600 text-xs font-black transition cursor-pointer">✕</button>
                  </div>
                  <h4 class="text-xs font-black text-gray-900 uppercase mt-2">{{ addr.city }}, {{ addr.country }}</h4>
                  <p class="text-xs text-gray-500 font-bold">{{ addr.street }}, {{ addr.postalCode }}</p>
                </div>
                <div class="flex items-center justify-between pt-2 border-t border-gray-200/50 text-[11px] font-bold text-gray-600">
                  <span>{{ lang === 'en' ? 'Phone' : 'Tel' }}: {{ addr.phone }}</span>
                  <span class="text-emerald-600 font-black">{{ lang === 'en' ? 'Main' : 'Kryesore' }}</span>
                </div>
              </div>
            </div>

            <div v-if="savedAddresses.length === 0" class="text-center py-12 text-xs font-bold text-gray-400 uppercase">
              {{ lang === 'en' ? 'No addresses added yet.' : 'Nuk keni shtuar ende asnjë adresë.' }}
            </div>
          </div>

          <div v-if="activeTab === 'orders'" class="space-y-6">
            <h2 class="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3">
              {{ lang === 'en' ? 'My Orders' : 'Porositë e Mia' }}
            </h2>

            <div v-if="userOrders.length > 0" class="space-y-4">
              <div v-for="(order, idx) in userOrders" :key="idx" class="p-5 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
                <div class="flex justify-between items-center border-b border-gray-200/60 pb-3">
                  <div>
                    <span class="text-[10px] font-mono font-bold text-gray-400">ID: #{{ order.id }}</span>
                    <span class="text-xs font-black text-gray-900 block">{{ order.date }}</span>
                  </div>
                  <span class="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase rounded-full">
                    {{ order.status }}
                  </span>
                </div>
                <div class="flex justify-between items-center text-xs font-bold">
                  <span class="text-gray-600">{{ order.itemsCount }} {{ lang === 'en' ? 'Products' : 'Produkte' }}</span>
                  <span class="font-mono font-black text-[#d61f43] text-sm">€{{ order.total.toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-12 text-xs font-bold text-gray-400 uppercase">
              {{ lang === 'en' ? 'No orders found yet.' : 'Nuk keni asnjë porosi aktive deri më tani.' }}
            </div>
          </div>

          <div v-if="activeTab === 'wishlist'" class="space-y-6">
            <h2 class="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3">
              {{ lang === 'en' ? 'Wishlist' : 'Lista e dëshirave' }}
            </h2>

            <div v-if="wishlist.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="item in wishlist" :key="item.id" class="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                  <img :src="item.image" class="w-12 h-12 object-cover rounded-xl bg-white border border-gray-200" />
                  <div>
                    <h4 class="text-xs font-black text-gray-900 line-clamp-1">{{ item.name }}</h4>
                    <span class="text-xs font-mono font-black text-[#d61f43]">€{{ item.price }}</span>
                  </div>
                </div>
                <button @click="removeFromWishlist(item.id)" class="p-2 text-red-500 hover:bg-red-50 rounded-xl transition font-bold text-xs cursor-pointer">
                  🗑️
                </button>
              </div>
            </div>

            <div v-else class="text-center py-12 text-xs font-bold text-gray-400 uppercase">
              {{ lang === 'en' ? 'Your wishlist is empty.' : 'Lista juaj e dëshirave është bosh.' }}
            </div>
          </div>

          <div v-if="activeTab === 'cards'" class="space-y-6">
            <div class="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 class="text-sm font-black text-gray-900 uppercase tracking-wider">
                {{ lang === 'en' ? 'Saved Cards' : 'Kartelat e ruajtura' }}
              </h2>
              <button @click="showCardModal = true" class="px-4 py-2 bg-gray-900 hover:bg-[#d61f43] text-white text-[11px] font-black uppercase rounded-xl transition shadow-sm cursor-pointer">
                + {{ lang === 'en' ? 'Add New Card' : 'Shto Kartelë' }}
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(card, index) in savedCards" :key="index" class="p-5 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl shadow-lg relative flex flex-col justify-between h-40">
                <div class="flex justify-between items-center">
                  <span class="text-[10px] font-mono tracking-widest opacity-80 uppercase">{{ card.holder }}</span>
                  <button @click="deleteCard(index)" class="text-white/60 hover:text-white text-xs font-black transition cursor-pointer">✕</button>
                </div>
                <div class="font-mono text-sm tracking-widest font-black">
                  •••• •••• •••• {{ card.number.slice(-4) }}
                </div>
                <div class="flex justify-between items-end text-[10px] font-mono opacity-80">
                  <span>Exp: {{ card.expiry }}</span>
                  <span class="bg-[#d61f43] text-white px-2 py-0.5 rounded font-black">SECURE</span>
                </div>
              </div>
            </div>

            <div v-if="savedCards.length === 0" class="text-center py-12 text-xs font-bold text-gray-400 uppercase">
              {{ lang === 'en' ? 'No saved credit cards.' : 'Nuk ka kartela të ruajtura.' }}
            </div>
          </div>

          <div v-if="activeTab === 'returns'" class="space-y-6">
            <h2 class="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3">
              {{ lang === 'en' ? 'Returned Products' : 'Produktet e kthyera në stok' }}
            </h2>
            <div class="text-center py-12 text-xs font-bold text-gray-400 uppercase">
              {{ lang === 'en' ? 'No returned products.' : 'Nuk ka produkte të kthyera.' }}
            </div>
          </div>

          <div v-if="activeTab === 'password'" class="space-y-6">
            <h2 class="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3">
              {{ lang === 'en' ? 'Change Password' : 'Ndrysho fjalëkalimin' }}
            </h2>
            <div class="space-y-4 max-w-md">
              <div class="space-y-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-wider">{{ lang === 'en' ? 'Current Password' : 'Fjalëkalimi Aktual' }}</label>
                <input v-model="passForm.current" type="password" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold outline-none focus:border-[#d61f43]" />
              </div>
              <div class="space-y-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-wider">{{ lang === 'en' ? 'New Password' : 'Fjalëkalimi i Ri' }}</label>
                <input v-model="passForm.newPass" type="password" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold outline-none focus:border-[#d61f43]" />
              </div>
              <button @click="changePassword" class="px-6 py-3 bg-[#d61f43] hover:bg-[#b51433] text-white font-black text-xs uppercase rounded-2xl shadow-md transition active:scale-95 cursor-pointer">
                {{ lang === 'en' ? 'Update Password' : 'Përditëso Fjalëkalimin' }}
              </button>
            </div>
          </div>

          <div v-if="activeTab === 'reviews'" class="space-y-6">
            <h2 class="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3">
              {{ lang === 'en' ? 'My Reviews' : 'Vlerësimet e mia' }}
            </h2>
            <div class="text-center py-12 text-xs font-bold text-gray-400 uppercase">
              {{ lang === 'en' ? 'You have not reviewed any product yet.' : 'Nuk keni bërë ende asnjë vlerësim.' }}
            </div>
          </div>

        </div>

      </div>

    </div>

    <div v-if="showAddressModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade">
        <div class="flex justify-between items-center border-b border-gray-100 pb-3">
          <h3 class="text-xs font-black uppercase text-gray-900">{{ lang === 'en' ? 'Add New Address' : 'Shto Adresë të Re' }}</h3>
          <button @click="showAddressModal = false" class="text-gray-400 hover:text-black font-bold cursor-pointer">✕</button>
        </div>
        <div class="space-y-3">
          <input v-model="newAddr.title" :placeholder="lang === 'en' ? 'Address Title (e.g. Home / Work)' : 'Titulli i Adresës (p.sh. Shtëpia / Puna)'" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold outline-none focus:border-[#d61f43]" />
          <input v-model="newAddr.city" :placeholder="lang === 'en' ? 'City (e.g. Prizren)' : 'Qyteti (p.sh. Prizren)'" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold outline-none focus:border-[#d61f43]" />
          <input v-model="newAddr.street" :placeholder="lang === 'en' ? 'Street / Neighborhood' : 'Rruga / Lagjja'" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold outline-none focus:border-[#d61f43]" />
          <input v-model="newAddr.postalCode" :placeholder="lang === 'en' ? 'Postal Code' : 'Kodi Postar'" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold outline-none focus:border-[#d61f43]" />
          <input v-model="newAddr.phone" :placeholder="lang === 'en' ? 'Phone Number (+383...)' : 'Numri i Telefonit (+383...)'" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold outline-none focus:border-[#d61f43]" />
        </div>
        <button @click="addAddress" class="w-full py-3 bg-[#d61f43] hover:bg-[#b51433] text-white text-xs font-black uppercase rounded-2xl transition shadow-md cursor-pointer">
          {{ lang === 'en' ? 'Save Address' : 'Ruaj Adresën' }}
        </button>
      </div>
    </div>

    <div v-if="showCardModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade">
        <div class="flex justify-between items-center border-b border-gray-100 pb-3">
          <h3 class="text-xs font-black uppercase text-gray-900">{{ lang === 'en' ? 'Add New Card' : 'Shto Kartelë të Re' }}</h3>
          <button @click="showCardModal = false" class="text-gray-400 hover:text-black font-bold cursor-pointer">✕</button>
        </div>
        <div class="space-y-3">
          <input v-model="newCard.holder" :placeholder="lang === 'en' ? 'Cardholder Name' : 'Emri Mbiemri në Kartelë'" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold outline-none focus:border-[#d61f43]" />
          <input v-model="newCard.number" :placeholder="lang === 'en' ? 'Card Number (16 Digits)' : 'Numri i Kartelës (16 Shifra)'" maxlength="16" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold outline-none focus:border-[#d61f43] font-mono" />
          <div class="grid grid-cols-2 gap-3">
            <input v-model="newCard.expiry" placeholder="MM/YY" maxlength="5" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold outline-none focus:border-[#d61f43] font-mono" />
            <input v-model="newCard.cvv" placeholder="CVV" maxlength="3" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold outline-none focus:border-[#d61f43] font-mono" />
          </div>
        </div>
        <button @click="addCard" class="w-full py-3 bg-[#d61f43] hover:bg-[#b51433] text-white text-xs font-black uppercase rounded-2xl transition shadow-md cursor-pointer">
          {{ lang === 'en' ? 'Save Card' : 'Ruaj Kartelën' }}
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, inject, computed } from 'vue'
import { currentUser, wishlist } from '../store/productStore'

const lang = inject('lang', ref('al'))
const activeTab = ref('personal')

const profileForm = ref({
  name: currentUser.value?.name || 'Edi',
  surname: currentUser.value?.surname || 'Bobaj',
  email: currentUser.value?.email || 'ebobaj65@gmail.com',
  birthDate: currentUser.value?.birthDate || '14/05/2009',
  gender: currentUser.value?.gender || 'Mashkull'
})

const passForm = ref({ current: '', newPass: '' })

const savedAddresses = ref(JSON.parse(localStorage.getItem('nexmall_addresses')) || [
  { title: 'Shtëpia', city: 'Prizren', country: 'Kosovë', street: 'Lagjja Ortakoll', postalCode: '20000', phone: '+383 44 123 456' }
])

const savedCards = ref(JSON.parse(localStorage.getItem('nexmall_cards')) || [
  { holder: 'EDI BOBAJ', number: '4532781290876543', expiry: '08/28', cvv: '123' }
])

const userOrders = ref([
  { id: 'NM-9821', date: '22 Korrik 2026', status: 'Në dërgesë', itemsCount: 2, total: 45.90 },
  { id: 'NM-8432', date: '15 Qershor 2026', status: 'Dërguar', itemsCount: 1, total: 19.99 }
])

const showAddressModal = ref(false)
const showCardModal = ref(false)

const newAddr = ref({ title: '', city: '', street: '', postalCode: '', phone: '' })
const newCard = ref({ holder: '', number: '', expiry: '', cvv: '' })

const tabs = computed(() => [
  { id: 'personal', icon: '👤', al: 'Të dhënat personale', en: 'Personal Information' },
  { id: 'addresses', icon: '📍', al: 'Adresat', en: 'Addresses' },
  { id: 'orders', icon: '📦', al: 'Porositë', en: 'Orders' },
  { id: 'wishlist', icon: '❤️', al: 'Lista e dëshirave', en: 'Wishlist' },
  { id: 'cards', icon: '💳', al: 'Kartelat', en: 'Cards' },
  { id: 'returns', icon: '🔄', al: 'Produktet e kthyera në stok', en: 'Returned Products' },
  { id: 'password', icon: '🔒', al: 'Ndrysho fjalëkalimin', en: 'Change Password' },
  { id: 'reviews', icon: '⭐', al: 'Vlerësimet', en: 'Reviews' }
])

const saveProfile = () => {
  if (currentUser.value) {
    currentUser.value.name = profileForm.value.name
    currentUser.value.surname = profileForm.value.surname
    localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
  }
  alert(lang.value === 'en' ? 'Profile updated successfully!' : 'Të dhënat u ruajtën me sukses!')
}

const addAddress = () => {
  if (!newAddr.value.city || !newAddr.value.street) {
    return alert(lang.value === 'en' ? 'Please fill in required fields!' : 'Ju lutemi plotësoni fushat e detyrueshme!')
  }
  savedAddresses.value.push({ ...newAddr.value, country: 'Kosovë' })
  localStorage.setItem('nexmall_addresses', JSON.stringify(savedAddresses.value))
  newAddr.value = { title: '', city: '', street: '', postalCode: '', phone: '' }
  showAddressModal.value = false
}

const deleteAddress = (index) => {
  savedAddresses.value.splice(index, 1)
  localStorage.setItem('nexmall_addresses', JSON.stringify(savedAddresses.value))
}

const addCard = () => {
  if (!newCard.value.number || newCard.value.number.length < 16) {
    return alert(lang.value === 'en' ? 'Please enter a valid 16-digit card number!' : 'Ju lutemi shkruani një numër të vlefshëm prej 16 shifrash!')
  }
  savedCards.value.push({ ...newCard.value })
  localStorage.setItem('nexmall_cards', JSON.stringify(savedCards.value))
  newCard.value = { holder: '', number: '', expiry: '', cvv: '' }
  showCardModal.value = false
}

const deleteCard = (index) => {
  savedCards.value.splice(index, 1)
  localStorage.setItem('nexmall_cards', JSON.stringify(savedCards.value))
}

const removeFromWishlist = (id) => {
  const index = wishlist.value.findIndex(item => item.id === id)
  if (index !== -1) wishlist.value.splice(index, 1)
}

const changePassword = () => {
  if (!passForm.value.current || !passForm.value.newPass) {
    return alert(lang.value === 'en' ? 'Please fill in all password fields!' : 'Ju lutemi plotësoni të gjitha fushat e fjalëkalimit!')
  }
  alert(lang.value === 'en' ? 'Password changed successfully!' : 'Fjalëkalimi u ndryshua me sukses!')
  passForm.value = { current: '', newPass: '' }
}
</script>

<style>
@keyframes fadeInMenu {
  from { opacity: 0; transform: scale(0.95) translateY(-8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-fade { animation: fadeInMenu 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>