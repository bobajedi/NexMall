import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import VendorDashboard from '../views/VendorDashboard.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import WishlistView from '../views/WishlistView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import AdminVendorDetailView from '../views/AdminVendorDetailView.vue'
import SellerSettings from '../views/SellerSettings.vue'
import VendorProfileView from '../views/VendorProfileView.vue' // YENİ IMPORT

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/checkout', name: 'checkout', component: CheckoutView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/vendor', name: 'vendor-dashboard', component: VendorDashboard },
  { path: '/dashboard', name: 'dashboard', component: VendorDashboard },
  { path: '/vendor/settings', name: 'vendor-settings', component: SellerSettings },
  { path: '/admin/vendor/:email', name: 'admin-vendor-detail', component: AdminVendorDetailView },
  { path: '/wishlist', name: 'wishlist', component: WishlistView },
  { path: '/product/:id', name: 'product-detail', component: ProductDetailView },
  { path: '/vendor-profile/:shopName', name: 'vendor-profile', component: VendorProfileView } // YENİ ROTA
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router