import { create } from 'zustand';
import { Product, CartItem, Invoice, Worker, Agency, products as initialProducts, workers as initialWorkers, agencies as initialAgencies } from '@/data/mockData';

interface AppState {
  // Auth
  role: 'none' | 'customer' | 'admin';
  setRole: (role: 'none' | 'customer' | 'admin') => void;

  // Products
  products: Product[];
  updateProductStock: (productId: string, quantitySold: number) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Invoices
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;

  // Workers
  workers: Worker[];
  addWorker: (worker: Worker) => void;
  updateWorker: (id: string, worker: Partial<Worker>) => void;
  deleteWorker: (id: string) => void;

  // Agencies
  agencies: Agency[];
  addAgency: (agency: Agency) => void;
  updateAgency: (id: string, agency: Partial<Agency>) => void;
  deleteAgency: (id: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  role: 'none',
  setRole: (role) => set({ role }),

  products: initialProducts,
  updateProductStock: (productId, quantitySold) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, stock: Math.max(0, p.stock - quantitySold) } : p
      ),
    })),

  cart: [],
  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((c) => c.product.id === product.id);
      if (existing) {
        return {
          cart: state.cart.map((c) =>
            c.product.id === product.id ? { ...c, quantity: c.quantity + 1 } : c
          ),
        };
      }
      return { cart: [...state.cart, { product, quantity: 1 }] };
    }),
  removeFromCart: (productId) =>
    set((state) => ({ cart: state.cart.filter((c) => c.product.id !== productId) })),
  updateCartQuantity: (productId, quantity) =>
    set((state) => ({
      cart: state.cart.map((c) =>
        c.product.id === productId ? { ...c, quantity: Math.max(1, quantity) } : c
      ),
    })),
  clearCart: () => set({ cart: [] }),

  invoices: [],
  addInvoice: (invoice) => set((state) => ({ invoices: [invoice, ...state.invoices] })),

  workers: initialWorkers,
  addWorker: (worker) => set((state) => ({ workers: [...state.workers, worker] })),
  updateWorker: (id, data) =>
    set((state) => ({
      workers: state.workers.map((w) => (w.id === id ? { ...w, ...data } : w)),
    })),
  deleteWorker: (id) => set((state) => ({ workers: state.workers.filter((w) => w.id !== id) })),

  agencies: initialAgencies,
  addAgency: (agency) => set((state) => ({ agencies: [...state.agencies, agency] })),
  updateAgency: (id, data) =>
    set((state) => ({
      agencies: state.agencies.map((a) => (a.id === id ? { ...a, ...data } : a)),
    })),
  deleteAgency: (id) => set((state) => ({ agencies: state.agencies.filter((a) => a.id !== id) })),
}));
