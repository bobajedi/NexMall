<template>
  <div class="vendor-import">
    <h2>NexMall Excel / CSV Ürün Yükleme</h2>

    <input 
      type="file" 
      accept=".xlsx, .xls, .csv" 
      @change="handleFileUpload" 
      :disabled="loading" 
    />

    <p v-if="loading">Dosya okunuyor ve veriler işleniyor...</p>

    <div v-if="products.length > 0" class="table-container">
      <h3>İşlenen Ürün Listesi (Toplam: {{ products.length }})</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Ürün Adı (Emri)</th>
            <th>Fiyat (Çmimi)</th>
            <th>Stok (Stoku)</th>
            <th>Kategori (Kategoria)</th>
            <th>Açıklama (Përshkrimi)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.id }}</td>
            <td>{{ product.name }}</td>
            <td><strong>{{ product.price }} €</strong></td>
            <td>{{ product.stock }}</td>
            <td>{{ product.category }}</td>
            <td>{{ product.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { processVendorFile } from '../utils/vendorProcessor';

const products = ref([]);
const loading = ref(false);

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  loading.value = true;

  try {
    const cleanData = await processVendorFile(file);
    products.value = cleanData;
    console.log('Backend veya Pinia Store için hazır liste:', cleanData);

    // Backend'e topyekün kaydetmek için örnek Express/Axios çağrısı:
    // await axios.post('/api/products/bulk', cleanData);
  } catch (error) {
    console.error('Dosya okuma hatası:', error);
    alert('Dosya yüklenirken bir hata oluştu.');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.vendor-import {
  padding: 20px;
  font-family: sans-serif;
}

.table-container {
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th, td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}
</style>