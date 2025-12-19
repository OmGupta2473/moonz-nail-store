import React, { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react';
import { initializeApp, getApp } from 'firebase/app';
import { 
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc,
  setDoc, 
  addDoc, 
  deleteDoc, 
  onSnapshot, 
  collection, 
  query,
  writeBatch,
  getDocs,
  setLogLevel,
  updateDoc,
  where,
  orderBy
} from 'firebase/firestore';
import { 
  Home, 
  ShoppingBag, 
  User, 
  Calendar, 
  Sparkles, 
  X, 
  Trash2, 
  Menu,
  LogIn,
  LogOut,
  CreditCard,
  CheckCircle,
  Smartphone,
  Truck,
  ArrowRight, 
  ArrowLeft, 
  Check,
  Package, 
  MapPin, 
  ClipboardList,
  ChevronLeft, 
  Ticket, 
  Tag,
  Shield, 
  Edit,   
  Plus,     
  Save,     
  Search, 
  LayoutDashboard,
  Heart,
  Image as ImageIcon,
  MinusCircle,
  Video,
  PlayCircle,
  Eye,
  EyeOff,
  Star,
  Settings,
  ChevronRight
} from 'lucide-react';

// =================================================================
// 0. GLOBAL STYLES & ANIMATIONS
// =================================================================

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #F5F5F7; /* Apple's Light Grey Background */
      color: #1D1D1F;
      -webkit-font-smoothing: antialiased;
    }

    /* Smooth Scrolling */
    html {
      scroll-behavior: smooth;
    }

    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: #D1D1D6;
      border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #8E8E93;
    }

    /* Animations */
    @keyframes fade-in-up {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fade-in {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }

    @keyframes scale-in {
      0% { opacity: 0; transform: scale(0.95); }
      100% { opacity: 1; transform: scale(1); }
    }

    .animate-fade-in-up {
      animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    
    .animate-fade-in {
      animation: fade-in 0.5s ease-out forwards;
    }

    .animate-scale-in {
      animation: scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .delay-100 { animation-delay: 100ms; }
    .delay-200 { animation-delay: 200ms; }
    .delay-300 { animation-delay: 300ms; }

    /* Glassmorphism Utilities */
    .glass {
      background: rgba(255, 255, 255, 0.65);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.5);
    }
    
    .glass-dark {
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }
    .price-pink {
    color: #db2777; 
    font-weight: 700;
    }


    /* Interactive Elements */
    .btn-press:active {
      transform: scale(0.96);
    }
    
    .hover-lift {
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .hover-lift:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1);
    }
    
    .text-gradient-premium {
      background: linear-gradient(135deg, #db2777 0%, #e11d48 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .text-gradient-gold {
      background: linear-gradient(135deg, #B46B3E 0%, #D69E68 50%, #B46B3E 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .ios-card {
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 24px;
        box-shadow: 0 4px 24px -1px rgba(0, 0, 0, 0.05);
    }

    .ios-btn {
        transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .ios-btn:active {
        transform: scale(0.96);
    }
  `}</style>
);

// =================================================================
// 1. CONSTANTS AND DATA
// =================================================================

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyC00nyizDXtIf4-gOLmWPzxpGorQsLAo98",
  authDomain: "nail-store-3a798.firebaseapp.com",
  projectId: "nail-store-3a798",
  storageBucket: "nail-store-3a798.firebasestorage.app",
  messagingSenderId: "546074655006",
  appId: "1:546074655006:web:e9b6312202275e4c3f310f",
  measurementId: "G-EV5N2W4CN3"
};

const ADMIN_EMAILS = [
  "omgupta111k@gmail.com",
  "themoonbeauty76@gmail.com",
];


const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", 
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", 
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

// =================================================================
// 2. GEMINI API HELPER
// =================================================================

const callGeminiAPI = async (systemPrompt, userPrompt) => {
  const apiKey = import.meta.env.VITE_AI_API_KEY; 
  
  if (!apiKey) {
    throw new Error("API Key is missing. Please open the code and add your key to the 'apiKey' variable.");
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: userPrompt }] }],
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    }
  };

  let response;
  let delay = 1000;
  for (let i = 0; i < 3; i++) {
    try {
      response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) break;
      else if (response.status === 429 || response.status >= 500) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      } else {
        throw new Error(`API call failed with status: ${response.status}`);
      }
    } catch (error) {
      if (i === 2) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
  if (!response || !response.ok) throw new Error(`API call failed after retries.`);
  const result = await response.json();
  const candidate = result.candidates?.[0];
  if (candidate && candidate.content?.parts?.[0]?.text) {
    return candidate.content.parts[0].text;
  } else {
    throw new Error("No valid text response from API.");
  }
};

// =================================================================
// 3. REUSABLE HELPER COMPONENTS (Modernized)
// =================================================================

const StatusPill = ({ status, isBooking = false }) => {
    let colorClass = "bg-gray-100 text-gray-600";
    if (status === 'Delivered' || status === 'confirmed') colorClass = "bg-green-100 text-green-700";
    else if (status === 'Shipped') colorClass = "bg-blue-100 text-blue-700";
    else if (status === 'Pending' || status === 'pending') colorClass = "bg-amber-100 text-amber-700";
    else if (status === 'Cancelled' || status === 'rejected') colorClass = "bg-red-100 text-red-700";
  
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${colorClass}`}>
        {status}
      </span>
    );
};

const Modal = ({ message, onClose, isLoading = false, onConfirm }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity duration-300">
    <div className="bg-white/90 backdrop-blur-xl rounded-[28px] shadow-2xl p-8 w-11/12 max-w-sm text-center transform transition-all duration-300 animate-scale-in border border-white/40">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[150px]">
          <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium tracking-wide text-sm">Processing...</p>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">{message.title}</h3>
          <p className="text-[15px] text-gray-500 mb-8 whitespace-pre-wrap leading-relaxed">{message.body}</p>
          <div className={`flex flex-col gap-3`}>
            {onConfirm && (
              <button
                onClick={onConfirm}
                className="w-full bg-red-500 text-white py-3.5 rounded-2xl font-medium hover:bg-red-600 transition-all duration-300 btn-press shadow-sm"
              >
                Confirm
              </button>
            )}
            <button
              onClick={onClose}
              className={`w-full py-3.5 rounded-2xl font-medium transition-all duration-300 btn-press ${onConfirm ? 'bg-gray-100 text-gray-900 hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-200'}`}
            >
              {onConfirm ? 'Cancel' : 'Close'}
            </button>
          </div>
        </>
      )}
    </div>
  </div>
);

const SignInModal = ({ onClose, onSignInWithGoogle }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <div className="bg-white/95 backdrop-blur-xl rounded-[32px] shadow-2xl p-8 w-11/12 max-w-md text-center animate-scale-in border border-white/50">
      <div className="mx-auto w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
        <LogIn className="w-8 h-8 text-gray-900" strokeWidth={1.5} />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Welcome Back</h3>
      <p className="text-gray-500 mb-8 text-[15px] leading-relaxed">
        Sign in to manage your orders, bookings, and wishlist.
      </p>
      <button
        onClick={onSignInWithGoogle}
        className="w-full flex items-center justify-center py-4 px-6 rounded-2xl shadow-sm bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 btn-press group"
      >
        <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.2l7.15-7.15C35.8 2.15 30.2 0 24 0 14.61 0 6.37 5.96 2.63 14.31l7.64 5.9C11.83 13.01 17.5 9.5 24 9.5z"></path>
          <path fill="#34A853" d="M46.7 24.1c0-1.63-.14-3.2-.4-4.7H24v8.9h12.7c-.55 2.9-2.2 5.4-4.7 7.1v5.7h7.3c4.3-4 6.9-9.9 6.9-17z"></path>
          <path fill="#FBBC05" d="M11.83 28.3c-.37-.9-.58-1.85-.58-2.8s.21-1.9.58-2.8l-7.64-5.9C1.96 19.4 0 23.6 0 28.3c0 4.7.96 8.9 2.63 12.8l7.64-5.9c-.37-.9-.58-1.8-.58-2.8z"></path>
          <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.84-5.8l-7.3-5.7c-2.15 1.45-4.9 2.3-7.9 2.3-6.5 0-12.17-3.5-14.17-8.8l-7.64 5.9C6.37 42.04 14.61 48 24 48z"></path>
          <path fill="none" d="M0 0h48v48H0z"></path>
        </svg>
        Continue with Google
      </button>
      <button
        onClick={onClose}
        className="mt-6 text-sm text-gray-400 hover:text-gray-900 transition-colors font-medium"
      >
        Cancel
      </button>
    </div>
  </div>
);

const FormInput = ({ label, name, value, onChange, ...props }) => (
  <div className="group">
    <label htmlFor={name} className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">{label}</label>
    <input
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="block w-full bg-slate-50 border-0 rounded-2xl text-gray-900 py-3.5 px-4 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-500 sm:text-sm sm:leading-6 transition-all duration-200 ease-in-out hover:bg-white"
      {...props}
    />
  </div>
);

const FormSelect = ({ label, name, value, onChange, children, ...props }) => (
  <div className="group">
    <label htmlFor={name} className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">{label}</label>
    <div className="relative">
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="block w-full appearance-none bg-slate-50 border-0 rounded-2xl text-gray-900 py-3.5 px-4 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-pink-500 sm:text-sm sm:leading-6 transition-all duration-200 ease-in-out hover:bg-white"
        {...props}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
);

const OrderSummary = React.memo(({ 
  cartItems, 
  subtotal = 0, 
  discount = 0, 
  total = 0, 
  appliedCoupon,
  couponCode,
  setCouponCode,
  handleApplyCoupon,
  couponMsg,
  removeCoupon
}) => (
  <div className="bg-white/80 backdrop-blur-xl rounded-[32px] shadow-[0_8px_40px_rgb(0,0,0,0.06)] p-8 sticky top-32 border border-white/40">
    <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Order Summary</h2>
    
    {/* Cart Items Mini List (Scrollable) */}
    <ul className="divide-y divide-gray-100 mb-8 max-h-64 overflow-y-auto custom-scrollbar pr-2">
      {cartItems.map(item => (
        <li key={item.id} className="flex justify-between items-center py-3 first:pt-0">
          <div className="flex items-center gap-3 overflow-hidden">
             <div className="h-10 w-10 rounded-lg bg-gray-50 flex-shrink-0 overflow-hidden">
                <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
             </div>
             <span className="text-gray-600 truncate text-[14px] font-medium">{item.name}</span>
          </div>
          <span className="price-pink">₹{(item.price || 0).toFixed(2)}</span>
        </li>
      ))}
    </ul>

    {/* Integrated Coupon Section */}
    <div className="mb-8 pt-6 border-t border-gray-100/50">
        <div className="flex items-center mb-3">
            <Ticket className="w-4 h-4 text-pink-500 mr-2" />
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Promo Code</h3>
        </div>
        <div className="flex gap-2 relative">
            <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter code"
            className="flex-1 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm px-4 py-3 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
            disabled={appliedCoupon !== null}
            />
            {appliedCoupon ? (
            <button
                type="button"
                onClick={removeCoupon}
                className="absolute right-2 top-2 bottom-2 px-4 bg-red-50 text-red-500 rounded-xl font-semibold hover:bg-red-100 transition-colors text-xs"
            >
                Remove
            </button>
            ) : (
            <button
                type="button"
                onClick={handleApplyCoupon}
                className="absolute right-2 top-2 bottom-2 px-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-colors text-xs shadow-md"
            >
                Apply
            </button>
            )}
        </div>
        {couponMsg?.text && (
            <p className={`mt-3 text-xs font-medium pl-1 flex items-center ${couponMsg.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
             {couponMsg.type === 'success' && <CheckCircle className="w-3 h-3 mr-1"/>}
             {couponMsg.text}
            </p>
        )}
    </div>

    <div className="border-t border-gray-100/50 pt-6 space-y-4">
      <div className="flex justify-between items-center text-gray-500 text-[15px]">
        <span>Subtotal</span>
        <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
      </div>
        
      {discount > 0 && (
        <div className="flex justify-between items-center text-green-600 text-[15px]">
          <span className="flex items-center">
            <Tag className="w-3.5 h-3.5 mr-2" />
            Discount
          </span>
          <span className="font-medium">- ₹{discount.toFixed(2)}</span>
        </div>
      )}

      <div className="flex justify-between items-end pt-4 border-t border-gray-100 mt-2">
        <span className="text-lg font-medium text-gray-600 mb-1">Total</span>
        <span className="text-3xl font-bold text-gradient-premium tracking-tight">
          ₹{total.toFixed(2)}
        </span>
      </div>
    </div>
  </div>
));

// =================================================================
// 4. ADMIN COMPONENTS (Restored & Enhanced)
// =================================================================

const AdminDashboard = ({ db, user, setModal }) => {
  const [activeTab, setActiveTab] = useState('orders'); 
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [products, setProducts] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);

  useEffect(() => {
    if (!db) return;
    const ordersUnsubscribe = onSnapshot(query(collection(db, 'admin_orders')), (snapshot) => {
       const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
       data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
       setOrders(data);
    });
    const bookingsUnsubscribe = onSnapshot(query(collection(db, 'admin_bookings')), (snapshot) => {
       const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
       data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
       setBookings(data);
    });
    const productsUnsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
       const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
       setProducts(data);
    });
    const galleryUnsubscribe = onSnapshot(collection(db, 'bridal_gallery'), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setGalleryItems(data);
    });
    return () => {
      ordersUnsubscribe();
      bookingsUnsubscribe();
      productsUnsubscribe();
      galleryUnsubscribe();
    }
  }, [db]);

  const handleUpdateOrderStatus = async (orderId, userId, newStatus) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'admin_orders', orderId), { status: newStatus });
      if (userId) await updateDoc(doc(db, 'users', userId, 'orders', orderId), { status: newStatus });
      setModal({ title: "Success", body: `Order status updated.` });
    } catch (error) { setModal({ title: "Error", body: "Failed update." }); }
  };

  const handleUpdateBookingStatus = async (bookingId, userId, newStatus) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'admin_bookings', bookingId), { status: newStatus });
      if (userId) await updateDoc(doc(db, 'users', userId, 'bookings', bookingId), { status: newStatus });
      setModal({ title: "Success", body: `Booking updated.` });
    } catch (error) { setModal({ title: "Error", body: "Failed update." }); }
  };

  const handleProductSave = async (productData, isEdit, productId) => {
    if (!db) return;
    try {
      if (isEdit && productId) await setDoc(doc(db, 'products', productId), productData, { merge: true });
      else await setDoc(doc(db, 'products', productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')), productData);
      setModal({ title: "Success", body: "Product saved." });
    } catch (error) { setModal({ title: "Error", body: "Failed save." }); }
  };

  const handleDeleteProduct = async (productId) => {
    if (!db || !window.confirm("Delete?")) return;
    try { await deleteDoc(doc(db, 'products', productId)); setModal({ title: "Deleted", body: "Removed." }); }
    catch (error) { setModal({ title: "Error", body: "Failed delete." }); }
  };

  const handleGallerySave = async (galleryData, isEdit, itemId) => {
    if (!db) return;
    try {
        if (isEdit && itemId) await setDoc(doc(db, 'bridal_gallery', itemId), { ...galleryData }, { merge: true });
        else await addDoc(collection(db, 'bridal_gallery'), { ...galleryData, createdAt: new Date().toISOString() });
        setModal({ title: "Success", body: "Item saved." });
    } catch (error) { setModal({ title: "Error", body: "Failed save." }); }
  };

  const handleDeleteGalleryItem = async (itemId) => {
      if (!db || !window.confirm("Delete?")) return;
      try { await deleteDoc(doc(db, 'bridal_gallery', itemId)); setModal({ title: "Deleted", body: "Removed." }); }
      catch (error) { setModal({ title: "Error", body: "Failed delete." }); }
  };

  const handleToggleGalleryActive = async (item) => {
      if (!db) return;
      try { await updateDoc(doc(db, 'bridal_gallery', item.id), { isActive: !item.isActive }); } catch (error) {}
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 animate-fade-in-up pt-32">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center tracking-tight">
          <Shield className="w-8 h-8 text-pink-500 mr-3" strokeWidth={2} />
          Admin Dashboard
        </h1>
        <p className="text-gray-500 bg-white/50 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-gray-200 shadow-sm">
            {user.email}
        </p>
      </div>

      <div className="bg-white/60 backdrop-blur-md p-1.5 rounded-full inline-flex space-x-1 border border-white/40 shadow-sm mb-8 overflow-x-auto max-w-full">
        {['orders', 'bookings', 'products', 'gallery'].map(tab => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`py-2 px-6 rounded-full text-sm font-semibold capitalize whitespace-nowrap transition-all duration-300 ${
               activeTab === tab 
                 ? 'bg-white text-gray-900 shadow-md' 
                 : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
             }`}
           >
             {tab}
           </button>
        ))}
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 min-h-[400px] overflow-hidden">
        {activeTab === 'orders' && <AdminOrderList orders={orders} onUpdateStatus={handleUpdateOrderStatus} />}
        {activeTab === 'bookings' && <AdminBookingList bookings={bookings} onUpdateStatus={handleUpdateBookingStatus} />}
        {activeTab === 'products' && <AdminProductManager products={products} onSave={handleProductSave} onDelete={handleDeleteProduct} />}
        {activeTab === 'gallery' && <AdminGalleryManager items={galleryItems} onSave={handleGallerySave} onDelete={handleDeleteGalleryItem} onToggleActive={handleToggleGalleryActive} />}
      </div>
    </div>
  );
};

const AdminOrderList = ({ orders, onUpdateStatus }) => (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            {['ID', 'Customer', 'Total', 'Date', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50/80 transition-colors group">
              <td className="px-6 py-5 text-sm font-medium text-gray-900">#{order.id.substring(0,6)}</td>
              <td className="px-6 py-5 text-sm text-gray-600 font-medium">{order.customer?.name}</td>
              <td className="px-6 py-5 text-sm text-gray-900 font-bold">₹{order.total.toFixed(2)}</td>
              <td className="px-6 py-5 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-5"><StatusPill status={order.status} /></td>
              <td className="px-6 py-5">
                <div className="relative">
                    <select 
                        className="appearance-none bg-gray-50 hover:bg-white border border-gray-200 text-gray-700 text-sm rounded-xl py-2 pl-3 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-pink-500 transition-all cursor-pointer" 
                        value={order.status} 
                        onChange={(e) => onUpdateStatus(order.id, order.userId, e.target.value)}
                    >
                        {['Pending', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <ChevronRight className="w-4 h-4 rotate-90" />
                    </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
);

const AdminBookingList = ({ bookings, onUpdateStatus }) => (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            {['Service', 'Date', 'Client', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50/80 transition-colors">
              <td className="px-6 py-5 text-sm font-medium text-gray-900 capitalize">{booking.service?.replace('_', ' ')}</td>
              <td className="px-6 py-5 text-sm text-gray-500">{new Date(booking.date).toLocaleDateString()}</td>
              <td className="px-6 py-5 text-sm text-gray-600 font-medium">{booking.name}</td>
              <td className="px-6 py-5"><StatusPill status={booking.status} isBooking /></td>
              <td className="px-6 py-5 flex gap-2">
                 <button onClick={() => onUpdateStatus(booking.id, booking.customer.uid, 'confirmed')} className="text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border border-green-200 hover:border-green-300 transition-all">Accept</button>
                 <button onClick={() => onUpdateStatus(booking.id, booking.customer.uid, 'rejected')} className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border border-red-200 hover:border-red-300 transition-all">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
);

const AdminProductManager = ({ products, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', originalPrice: '', category: 'Press-Ons', imageUrl: '', description: '', images: [] });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, price: parseFloat(formData.price), originalPrice: parseFloat(formData.originalPrice) || null, images: formData.images.filter(x => x) }, isEditing, editId);
    setFormData({ name: '', price: '', originalPrice: '', category: 'Press-Ons', imageUrl: '', description: '', images: [] });
    setIsEditing(false); setEditId(null);
  };

  const handleEdit = (p) => { setFormData(p); setEditId(p.id); setIsEditing(true); window.scrollTo({top:0, behavior:'smooth'}); };

  return (
    <div className="p-8">
      <div className="bg-gray-50/50 p-8 rounded-[24px] mb-10 border border-gray-100 shadow-inner">
        <h3 className="text-xl font-bold text-gray-900 mb-6">{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="Name" name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <FormSelect label="Category" name="category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
               {['Press-Ons', 'Polish', 'Gel', 'Bridal', 'Polish Set'].map(o => <option key={o} value={o}>{o}</option>)}
            </FormSelect>
            <FormInput label="Price" name="price" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
            <FormInput label="Original Price" name="originalPrice" type="number" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} />
          </div>
          <FormInput label="Main Image URL" name="imageUrl" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} required />
          
          <div>
             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">Gallery Images</label>
             {formData.images.map((url, i) => (
               <div key={i} className="flex gap-2 mb-2">
                 <input className="flex-1 bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-pink-500 outline-none" value={url} onChange={e => {
                    const newImgs = [...formData.images]; newImgs[i] = e.target.value; setFormData({...formData, images: newImgs});
                 }} placeholder="Image URL" />
                 <button type="button" onClick={() => {
                    const newImgs = formData.images.filter((_, idx) => idx !== i); setFormData({...formData, images: newImgs});
                 }} className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors"><MinusCircle size={20}/></button>
               </div>
             ))}
             <button type="button" onClick={() => setFormData({...formData, images: [...formData.images, '']})} className="text-sm text-pink-600 font-semibold hover:text-pink-700 flex items-center mt-2 px-1"><Plus size={16} className="mr-1"/> Add Image</button>
          </div>

          <div className="group">
             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">Description</label>
             <textarea placeholder="Product description..." className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all hover:bg-white" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          
          <div className="flex gap-3 pt-2">
            <button type="submit" className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-black transition-all shadow-lg shadow-gray-200 active:scale-95">{isEditing ? 'Update Product' : 'Create Product'}</button>
            {isEditing && <button type="button" onClick={() => { setIsEditing(false); setFormData({ name: '', price: '', originalPrice: '', category: 'Press-Ons', imageUrl: '', description: '', images: [] }); }} className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 active:scale-95">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded-[24px] p-4 border border-gray-100 flex gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h4 className="font-semibold text-gray-900 truncate pr-2">{p.name}</h4>
              <p className="text-pink-600 font-bold text-sm">₹{p.price}</p>
              <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(p)} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"><Edit size={14} /></button>
                <button onClick={() => onDelete(p.id)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminGalleryManager = ({ items, onSave, onDelete, onToggleActive }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', mediaType: 'image', coverImage: '', mediaUrls: [], isActive: true });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, mediaUrls: formData.mediaUrls.filter(u => u.trim()) }, isEditing, editId);
        setFormData({ title: '', description: '', mediaType: 'image', coverImage: '', mediaUrls: [], isActive: true });
        setIsEditing(false); setEditId(null);
    };

    const handleEdit = (item) => { setFormData(item); setEditId(item.id); setIsEditing(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };

    return (
        <div className="p-8">
            <div className="bg-gray-50/50 p-8 rounded-[24px] mb-10 border border-gray-100 shadow-inner">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{isEditing ? 'Edit Gallery Item' : 'Add Gallery Item'}</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput label="Title" name="title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        <div className="flex gap-4">
                            <div className="flex-1"><FormSelect label="Type" name="mediaType" value={formData.mediaType} onChange={e => setFormData({ ...formData, mediaType: e.target.value })}><option value="image">Image</option><option value="video">Video</option></FormSelect></div>
                            <div className="flex items-center pt-6"><label className="flex items-center text-sm font-bold text-gray-700 cursor-pointer bg-white px-4 py-3 rounded-2xl border border-gray-200"><input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="mr-3 rounded text-pink-600 focus:ring-pink-500 w-5 h-5"/> Active</label></div>
                        </div>
                    </div>
                    <FormInput label="Cover Image" name="coverImage" value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} required />
                    
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">Media URLs</label>
                        {formData.mediaUrls.map((url, i) => (
                            <div key={i} className="flex gap-2 mb-2">
                                <input className="flex-1 bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-pink-500 outline-none" value={url} onChange={e => { const u = [...formData.mediaUrls]; u[i] = e.target.value; setFormData({...formData, mediaUrls: u}); }} placeholder="URL" />
                                <button type="button" onClick={() => { const u = formData.mediaUrls.filter((_, idx) => idx !== i); setFormData({...formData, mediaUrls: u}); }} className="text-red-500 p-2 hover:bg-red-50 rounded-xl"><MinusCircle size={20}/></button>
                            </div>
                        ))}
                        <button type="button" onClick={() => setFormData({...formData, mediaUrls: [...formData.mediaUrls, '']})} className="text-sm text-pink-600 font-semibold flex items-center mt-2 px-1 hover:text-pink-700"><Plus size={16} className="mr-1"/> Add Media</button>
                    </div>
                    <div className="group">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">Description</label>
                        <textarea placeholder="Description" className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all hover:bg-white" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    </div>
                    <button type="submit" className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-semibold shadow-lg shadow-gray-200 hover:bg-black transition-all active:scale-95">{isEditing ? 'Update Item' : 'Add Item'}</button>
                </form>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => (
                    <div key={item.id} className={`bg-white rounded-[24px] p-4 border border-gray-100 flex gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group ${!item.isActive ? 'opacity-60 grayscale' : ''}`}>
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                             <img src={item.coverImage} className="w-full h-full object-cover" alt="" />
                             {item.mediaType === 'video' && <div className="absolute inset-0 flex items-center justify-center bg-black/30"><PlayCircle className="text-white w-8 h-8"/></div>}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h4 className="font-semibold text-gray-900 truncate">{item.title || 'Untitled'}</h4>
                            <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(item)} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"><Edit size={14}/></button>
                                <button onClick={() => onToggleActive(item)} className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100">{item.isActive ? <Eye size={14}/> : <EyeOff size={14}/>}</button>
                                <button onClick={() => onDelete(item.id)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100"><Trash2 size={14}/></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// =================================================================
// 5. PAGE COMPONENTS (Updated Designs)
// =================================================================

const ProductDetailModal = ({ product, onClose, onAddToCart, onToggleWishlist, isWishlisted }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.imageUrl];

  const nextImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Swipe handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50) { // Swipe Left -> Next
      nextImage();
    } else if (diff < -50) { // Swipe Right -> Prev
      prevImage();
    }
    setTouchStart(null);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] animate-scale-in">
        
        {/* Image Section (Updated with Slider) */}
        <div 
          className="w-full md:w-1/2 bg-[#F5F5F7] relative flex items-center justify-center group overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
           <button onClick={onClose} className="md:hidden absolute top-4 right-4 bg-white/50 backdrop-blur-md rounded-full p-2.5 shadow-sm z-20 text-gray-800"><X className="w-5 h-5" /></button>
           
           <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
             {/* Sliding Track */}
             <div 
                className="flex h-full w-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
             >
                {images.map((img, idx) => (
                  <div key={idx} className="w-full h-full flex-shrink-0 flex items-center justify-center p-8">
                    <img 
                      src={img} 
                      alt={`${product.name} view ${idx + 1}`}
                      className="max-w-full max-h-[500px] object-contain drop-shadow-2xl"
                      onError={(e) => { e.target.src = 'https://placehold.co/600x600/E0E0E0/B0B0B0?text=Image+Error'; }}
                    />
                  </div>
                ))}
             </div>
             
             {/* Navigation Arrows (Desktop) */}
             {images.length > 1 && (
                <>
                    <button 
                        onClick={prevImage}
                        className={`hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full items-center justify-center shadow-md text-gray-800 transition-all duration-300 hover:scale-110 hover:bg-white active:scale-95 z-10 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button 
                        onClick={nextImage}
                        className={`hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full items-center justify-center shadow-md text-gray-800 transition-all duration-300 hover:scale-110 hover:bg-white active:scale-95 z-10 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <ChevronRight size={20} />
                    </button>
                </>
             )}

             {/* Pagination Dots */}
             {images.length > 1 && (
               <div className="absolute bottom-6 flex space-x-2 bg-white/30 backdrop-blur-xl p-1.5 rounded-full border border-white/20 z-10">
                 {images.map((_, idx) => (
                   <button
                     key={idx}
                     onClick={() => setCurrentImageIndex(idx)}
                     className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-black scale-110' : 'bg-black/20 hover:bg-black/40'}`}
                   />
                 ))}
               </div>
             )}
           </div>
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-10 overflow-y-auto relative bg-white">
          <button onClick={onClose} className="hidden md:block absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors bg-gray-50 p-2 rounded-full"><X className="w-6 h-6" /></button>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-[11px] font-bold tracking-widest text-pink-600 uppercase bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
              {product.category}
            </span>
            {isWishlisted && <span className="text-xs font-medium text-red-500 flex items-center"><Heart className="w-3 h-3 fill-current mr-1" /> Saved</span>}
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">{product.name}</h2>
          
          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-lg price-pink">₹{(product.price || 0).toFixed(2)}</span>
            {product.originalPrice && <span className="text-lg text-gray-400 line-through">₹{product.originalPrice.toFixed(2)}</span>}
          </div>

          <p className="text-gray-600 mb-10 leading-relaxed text-[15px]">{product.description || "Elegant, durable, and perfect for any occasion."}</p>

          <div className="space-y-4">
            <div className="flex gap-4">
                <button
                onClick={() => onAddToCart(product)}
                className="flex-1 py-4 bg-gray-900 text-white rounded-[20px] text-lg font-medium hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-gray-200 flex items-center justify-center gap-2"
                >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
                </button>
                <button 
                onClick={() => onToggleWishlist(product)}
                className={`p-4 rounded-[20px] border transition-all duration-300 hover:scale-105 active:scale-95 ${isWishlisted ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'}`}
                >
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
               <div className="text-center p-4 bg-gray-50 rounded-2xl">
                 <Truck className="w-6 h-6 text-gray-900 mx-auto mb-2" strokeWidth={1.5} />
                 <span className="text-xs font-semibold text-gray-600 block">Fast Delivery</span>
               </div>
               <div className="text-center p-4 bg-gray-50 rounded-2xl">
                 <CheckCircle className="w-6 h-6 text-gray-900 mx-auto mb-2" strokeWidth={1.5} />
                 <span className="text-xs font-semibold text-gray-600 block">Authentic</span>
               </div>
               <div className="text-center p-4 bg-gray-50 rounded-2xl">
                 <Sparkles className="w-6 h-6 text-gray-900 mx-auto mb-2" strokeWidth={1.5} />
                 <span className="text-xs font-semibold text-gray-600 block">Premium</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCard = React.memo(({ product, onAddToCart, onProductClick, isWishlisted, onToggleWishlist }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // Normalize images
  const images = useMemo(() => {
     return (Array.isArray(product.images) && product.images.length > 0) ? product.images : [product.imageUrl];
  }, [product]);

  const nextImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Swipe handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50) { // Swipe Left -> Next
      nextImage();
    } else if (diff < -50) { // Swipe Right -> Prev
      prevImage();
    }
    setTouchStart(null);
  };

  return (
    <div 
      onClick={() => onProductClick(product)}
      className="bg-white rounded-[24px] overflow-hidden group cursor-pointer border border-transparent hover:border-gray-200 hover-lift relative shadow-sm hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
       {/* Image Carousel Container */}
      <div 
        className="relative aspect-[4/5] overflow-hidden bg-[#F5F5F7]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
         {/* Sliding Track */}
        <div 
            className="flex h-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
            {images.map((img, idx) => (
                <div key={idx} className="w-full h-full flex-shrink-0 flex items-center justify-center p-4">
                    <img 
                        src={img} 
                        alt={`${product.name} view ${idx + 1}`}
                        loading="lazy"
                        className="w-full h-full object-contain drop-shadow-sm transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                        onError={(e) => { e.target.src = 'https://placehold.co/400x500/F5F5F7/D1D1D6?text=Image'; }}
                    />
                </div>
            ))}
        </div>

        {/* Overlay Gradients/Effects */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none" />

        {/* Navigation Arrows (Desktop) - Only show if multiple images */}
        {images.length > 1 && (
            <>
                <button 
                    onClick={prevImage}
                    className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm text-gray-800 transition-all duration-300 hover:scale-110 hover:bg-white active:scale-95 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                >
                    <ChevronLeft size={16} />
                </button>
                <button 
                    onClick={nextImage}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm text-gray-800 transition-all duration-300 hover:scale-110 hover:bg-white active:scale-95 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                >
                    <ChevronRight size={16} />
                </button>
            </>
        )}
        
        {/* Pagination Dots */}
        {images.length > 1 && (
            <div className="absolute bottom-16 left-0 right-0 flex justify-center space-x-1.5 z-10 pointer-events-none">
                {images.map((_, idx) => (
                    <div 
                        key={idx}
                        className={`h-1.5 rounded-full shadow-sm transition-all duration-300 ${idx === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                    />
                ))}
            </div>
        )}

        {/* Wishlist Button (Existing) */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }}
          className={`absolute top-3 right-3 p-2.5 rounded-full bg-white/80 backdrop-blur-md shadow-sm transition-all duration-300 hover:scale-110 z-20 ${isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-pink-500'}`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Add to Cart (Existing) - Adjusted bottom position to not conflict with dots */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out z-20">
            <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="w-full bg-white/90 backdrop-blur-xl text-gray-900 py-3 rounded-xl font-semibold shadow-lg hover:bg-white transition-colors flex items-center justify-center text-sm"
            >
            <ShoppingBag className="w-4 h-4 mr-2" /> Add
            </button>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-[17px] font-semibold text-gray-900 leading-snug mb-1 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-3">{product.category}</p>
        <div className="flex items-center gap-2">
          <span className="text-lg price-pink">₹{(product.price || 0).toFixed(2)}</span>
          {product.originalPrice && <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>}
        </div>
      </div>
    </div>
  );
});

// ... (Header, Footer, HomePage updated below)

const Header = ({ setPage, cartCount, user, isMobileMenuOpen, setMobileMenuMenuOpen, onSignInClick, onSignOut, isAdmin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle body scroll locking when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const NavLink = ({ page, label, mobile = false }) => (
    <button 
      onClick={() => { setPage(page); setMobileMenuMenuOpen(false); }} 
      className={mobile 
        ? "w-full text-left py-4 text-lg font-semibold text-gray-900 border-b border-gray-100 hover:text-pink-600 transition-colors flex justify-between items-center group"
        : "text-[13px] font-medium text-gray-600 hover:text-black transition-colors px-4 py-2 tracking-wide uppercase"
      }
    >
      {label}
      {mobile && <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-pink-500 transition-colors" />}
    </button>
  );

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? 'bg-white/80 backdrop-blur-2xl border-b border-white/20 shadow-[0_2px_20px_rgba(0,0,0,0.02)] py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <div className="flex-1">
              <button onClick={() => setPage('home')} className="flex items-center text-xl font-bold text-gray-900 tracking-tight z-50 relative">
                <Sparkles className="w-5 h-5 text-pink-500 mr-2" strokeWidth={2.5} />
                MOONZBEAUTY
              </button>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-1 justify-center space-x-2 bg-white/50 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/40 shadow-sm">
              <NavLink page="home" label="Home" />
              <NavLink page="products" label="Shop" />
              <NavLink page="bridal" label="Bridal" />
            </div>

            {/* Right Icons & Mobile Toggle */}
            <div className="flex-1 flex justify-end items-center space-x-3">
              {isAdmin && <button onClick={() => setPage('admin')} className="hidden md:flex p-2 text-gray-600 hover:text-black hover:bg-black/5 rounded-full transition-all"><LayoutDashboard className="w-5 h-5" /></button>}
              <button onClick={() => setPage('wishlist')} className="p-2 text-gray-600 hover:text-pink-500 hover:bg-pink-50 rounded-full transition-all"><Heart className="w-5 h-5" /></button>
              <button onClick={() => setPage('cart')} className="relative p-2 text-gray-600 hover:text-black hover:bg-black/5 rounded-full transition-all">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && <span className="absolute top-0 right-0 h-4 w-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">{cartCount}</span>}
              </button>
              
              {user ? (
                 <button onClick={() => setPage('account')} className="hidden md:flex p-2 text-gray-600 hover:text-black hover:bg-black/5 rounded-full transition-all"><User className="w-5 h-5" /></button>
              ) : (
                 <button onClick={onSignInClick} className="hidden md:flex px-4 py-2 bg-black text-white text-xs font-semibold rounded-full hover:bg-gray-800 transition-all shadow-md hover:shadow-lg">Sign In</button>
              )}

              {/* Hamburger Button */}
              <button 
                onClick={() => setMobileMenuMenuOpen(true)} 
                className="md:hidden p-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
                aria-label="Open Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[60] md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Blurred Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/20 backdrop-blur-md transition-opacity duration-500 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => setMobileMenuMenuOpen(false)}
      />

        
        {/* Sliding Menu Panel */}
        <div 
          className={`absolute top-0 right-0 w-[85%] max-w-[320px] h-full bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] transform ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full p-6">
            <div className="flex justify-between items-center mb-8 pt-2">
              <span className="text-xl font-bold text-gray-900 tracking-tight">Menu</span>
              <button 
                onClick={() => setMobileMenuMenuOpen(false)} 
                className="p-2 bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100 hover:text-black transition-colors active:scale-95"
              >
                <X className="w-5 h-5"/>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-1">
                <NavLink page="home" label="Home" mobile />
                <NavLink page="products" label="Shop Collection" mobile />
                <NavLink page="bridal" label="Bridal Services" mobile />
                <NavLink page="wishlist" label="My Wishlist" mobile />
                <NavLink page="cart" label="Shopping Bag" mobile />
                {user && <NavLink page="account" label="My Account" mobile />}
                {isAdmin && <NavLink page="admin" label="Admin Dashboard" mobile />}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 mt-auto">
              {user ? (
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 font-bold shadow-sm">
                      {user.displayName ? user.displayName.charAt(0) : <User size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 truncate max-w-[150px]">{user.displayName || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[150px]">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { onSignOut(); setMobileMenuMenuOpen(false); }} 
                    className="w-full py-3 bg-white text-red-500 border border-gray-200 rounded-xl font-semibold text-sm hover:bg-red-50 hover:border-red-100 transition-all shadow-sm"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-gray-400 text-center font-medium uppercase tracking-wide">Account</p>
                  <button 
                    onClick={() => { onSignInClick(); setMobileMenuMenuOpen(false); }} 
                    className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Sign In / Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ... (HomePage, ProductListPage, WishlistPage, CartPage, CheckoutPage - Keep Existing Logic but ensure consistent Apple styling if touched, mostly fine as is from provided code, focusing on Account & Admin) ...
// Re-inserting core pages for completeness

const HomePage = ({ products, setPage, onAddToCart, onProductClick, wishlist, onToggleWishlist }) => (
  <div className="animate-fade-in">
    <div className="relative h-[85vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://res.cloudinary.com/dzxxtkn16/image/upload/v1766018071/ChatGPT_Image_Dec_18_2025_06_03_58_AM_bpwknn.png"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center text-center px-4">
        <div className="max-w-3xl space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
            <button onClick={() => setPage('products')} className="px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-xl">
              Shop Collection
            </button>
            <button onClick={() => setPage('bridal')} className="px-8 py-4 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full font-semibold text-lg hover:bg-white/30 transition-all hover:scale-105">
              Book Bridal
            </button>
          </div>
        </div>
      </div>
    </div>

    <div className="max-w-[1400px] mx-auto py-24 px-6 lg:px-8">
      <div className="flex justify-between items-end mb-12">
        <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Latest Arrivals</h2>
            <p className="text-gray-500 mt-2">Curated selection for the season.</p>
        </div>
        <button onClick={() => setPage('products')} className="text-sm font-semibold text-pink-600 hover:text-pink-700 flex items-center group">
            View all <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      
      {products.length === 0 ? (
         <div className="text-center py-20 bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
           <p className="text-gray-400">New collections coming soon.</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart}
              onProductClick={onProductClick}
              isWishlisted={wishlist.some(item => item.id === product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      )}
    </div>
  </div>
);

const ProductListPage = ({ products, onAddToCart, onProductClick, wishlist, onToggleWishlist }) => (
  <div className="max-w-7xl mx-auto pt-24 pb-16 px-4 sm:px-6 lg:px-8 animate-fadeIn">
    <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
      Shop All Nail Products
    </h1>
    {products.length === 0 ? (
       <p className="text-center text-gray-500">
         No products found. Use the Admin Dashboard to add products.
       </p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={onAddToCart} 
            onProductClick={onProductClick}
            isWishlisted={wishlist.some(item => item.id === product.id)}
            onToggleWishlist={onToggleWishlist}
          />
        ))}
      </div>
    )}
  </div>
);

const WishlistPage = ({ wishlist, onAddToCart, onProductClick, onToggleWishlist, setPage, user }) => {
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto pt-24 pb-16 px-4 sm:px-6 lg:px-8 animate-fadeIn text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Your Wishlist</h1>
        <p className="text-lg text-gray-600 mb-8">Please sign in to save your favorite items.</p>
        <Heart className="w-20 h-20 text-gray-200 mx-auto mb-6" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pt-24 pb-16 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
        My Wishlist
      </h1>
      {wishlist.length === 0 ? (
        <div className="text-center">
          <Heart className="w-20 h-20 text-gray-200 mx-auto mb-6" />
          <p className="text-gray-500 text-lg mb-6">Your wishlist is empty.</p>
          <button 
            onClick={() => setPage('products')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
          {wishlist.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart} 
              onProductClick={onProductClick}
              isWishlisted={true}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CartPage = ({ cartItems, onRemoveFromCart, onCheckout, onGenerateIdeas, user }) => {
  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
  }, [cartItems]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto pt-32 pb-16 px-6 lg:px-8 animate-fade-in-up text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
          Your Bag is Loading...
        </h1>
        <div className="flex justify-center">
           <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pt-32 pb-24 px-6 lg:px-8 animate-fade-in-up">
      <h1 className="text-5xl font-bold text-gray-900 mb-16 tracking-tight text-center md:text-left">
        Review your bag.
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-24 bg-white/50 rounded-[32px] border border-dashed border-gray-200 backdrop-blur-sm">
          <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-6" strokeWidth={1} />
          <p className="text-gray-500 text-xl font-medium">Your bag is empty.</p>
          {/* <p className="text-gray-400 mt-2">Free delivery and returns on all orders.</p> */}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            <ul className="space-y-6">
              {cartItems.map((item, index) => (
                <li 
                  key={item.id} 
                  className="group flex flex-col sm:flex-row items-center p-6 bg-white/70 backdrop-blur-xl rounded-[24px] shadow-sm border border-white/50 hover:shadow-lg transition-all duration-300 ease-out"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-2xl shadow-sm bg-gray-100 group-hover:scale-[1.02] transition-transform duration-500">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://placehold.co/150x150/F5F5F7/D1D1D6?text=Image'; }}
                    />
                  </div>
                  
                  <div className="flex-1 mt-6 sm:mt-0 sm:ml-8 text-center sm:text-left w-full">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 tracking-tight">{item.name}</h3>
                        <p className="text-2xl font-bold text-gradient-premium tracking-tight mt-2 sm:mt-0">
                          ₹{(item.price || 0).toFixed(2)}
                        </p>
                    </div>
                    <p className="text-gray-500 text-sm font-medium bg-gray-100/80 px-3 py-1 rounded-full inline-block mb-4">{item.category}</p>
                    
                    <div className="flex items-center justify-center sm:justify-start">
                      <button
                        onClick={() => onRemoveFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors flex items-center text-sm font-medium group/btn"
                      >
                        <Trash2 className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 sticky top-32">
              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-semibold text-gray-900">Total</span>
                <span className="text-4xl font-bold text-gray-900 tracking-tighter">
                  ₹{total.toFixed(2)}
                </span>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={() => onGenerateIdeas(cartItems)}
                  className="w-full flex items-center justify-center py-4 px-6 rounded-[20px] text-[15px] font-semibold text-pink-600 bg-pink-50/50 border border-pink-100 hover:bg-pink-100 hover:border-pink-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
                >
                  <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                  Personalized Ideas
                </button>
                
                <button
                  onClick={onCheckout}
                  className="w-full flex items-center justify-center py-4 px-6 rounded-[20px] text-[15px] font-semibold text-white bg-gray-900 shadow-lg shadow-gray-200 hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" strokeWidth={2.5} />
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200/50 text-center">
                 <p className="text-xs text-gray-400 font-medium flex items-center justify-center gap-2">
                   <Shield className="w-3 h-3" /> Secure Checkout
                 </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckoutPage = ({ cartItems, onConfirmOrder, user, setModal, userOrders }) => {
  const [step, setStep] = useState(1); 
  const [paymentMethod, setPaymentMethod] = useState('COD'); 
   
  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMsg, setCouponMsg] = useState({ type: '', text: '' });

  const [customerDetails, setCustomerDetails] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: '',
  });

  const [addressDetails, setAddressDetails] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
  });
   
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
  }, [cartItems]);
   
  const total = useMemo(() => {
    return Math.max(0, subtotal - discount);
  }, [subtotal, discount]);

  // ... (Coupon and Form Handlers remain exactly the same)
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toLowerCase();
    setCouponMsg({ type: '', text: '' });
    setDiscount(0);
    setAppliedCoupon(null);
    if (!code) return;

    if (code === 'moon200') {
      if (subtotal > 1000) {
        setAppliedCoupon('moon200');
        setDiscount(200);
        setCouponMsg({ type: 'success', text: 'Success! ₹200 off applied.' });
      } else {
        setCouponMsg({ type: 'error', text: 'Coupon "moon200" is only valid for orders above ₹1000.' });
      }
    } else if (code === 'new100') {
      if (!userOrders || userOrders.length === 0) {
        setAppliedCoupon('new100');
        setDiscount(100);
        setCouponMsg({ type: 'success', text: 'Welcome! ₹100 off your first order applied.' });
      } else {
        setCouponMsg({ type: 'error', text: 'Coupon "new100" is only valid for your first order.' });
      }
    } else {
      setCouponMsg({ type: 'error', text: 'Invalid coupon code.' });
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode('');
    setCouponMsg({ type: '', text: '' });
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setCustomerDetails(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setCustomerDetails(prev => ({ ...prev, [name]: value }));
    }
  };
   
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    if (name === 'pincode') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setAddressDetails(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setAddressDetails(prev => ({ ...prev, [name]: value }));
    }
    if (name === 'state') {
      setAddressDetails(prev => ({ ...prev, city: '', pincode: '', [name]: value }));
    }
  };

  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    if (customerDetails.name && customerDetails.email && customerDetails.phone.length === 10) {
      setStep(2); 
    } else {
      alert("Please fill in all customer details correctly (Phone number must be 10 digits)."); 
    }
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (addressDetails.street && addressDetails.city && addressDetails.state && addressDetails.pincode.length === 6) {
      setStep(3); 
    } else {
      alert("Please fill in all required address fields correctly (Pincode must be 6 digits)."); 
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod !== 'COD') {
       setModal({
         title: "Payment Unavailable",
         body: "This feature is currently unavailable. Please choose Cash on Delivery (COD) to place your order."
       });
       return;
    }
    const orderDetails = {
      customer: customerDetails,
      address: addressDetails,
      paymentMethod: paymentMethod,
      subtotal: subtotal,
      discount: discount,
      couponCode: appliedCoupon,
      total: total,
      status: "Pending" 
    };
    onConfirmOrder(orderDetails);
  };

  const PaymentOption = ({ value, label, icon: Icon }) => (
    <label 
      htmlFor={value}
      className={`group flex items-center p-5 border rounded-2xl cursor-pointer transition-all duration-300 ${
        paymentMethod === value 
          ? 'bg-pink-50/50 border-pink-500 shadow-sm' 
          : 'bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-300'
      }`}
    >
      <div className="relative flex items-center justify-center">
        <input
          type="radio"
          id={value}
          name="paymentMethod"
          value={value}
          checked={paymentMethod === value}
          onChange={() => setPaymentMethod(value)}
          className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-pink-500 checked:bg-pink-500 transition-all"
        />
        <div className="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"></div>
      </div>
      <div className="ml-4 flex items-center flex-1">
        <div className={`p-2 rounded-xl mr-4 transition-colors ${paymentMethod === value ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}`}>
           <Icon className="w-6 h-6" />
        </div>
        <span className={`text-[15px] font-semibold transition-colors ${paymentMethod === value ? 'text-gray-900' : 'text-gray-600'}`}>{label}</span>
      </div>
    </label>
  );

  const NextButton = ({ text, icon: Icon = ArrowRight }) => (
    <button
      type="submit"
      className="w-full flex justify-center items-center py-4 px-6 rounded-2xl shadow-lg shadow-pink-200 text-[16px] font-semibold text-white bg-pink-600 hover:bg-pink-700 hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300"
    >
      {text}
      <Icon className="w-5 h-5 ml-2" />
    </button>
  );

  const BackButton = ({ onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex justify-center items-center py-4 px-6 border border-gray-200 rounded-2xl text-[16px] font-semibold text-gray-600 bg-white hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 focus:outline-none transition-all duration-300"
    >
      <ArrowLeft className="w-5 h-5 mr-2" />
      Back
    </button>
  );

  const Stepper = ({ step }) => {
    const steps = ["Details", "Address", "Payment"];
    return (
      <nav className="flex items-center justify-between mb-10 px-4" aria-label="Progress">
        {steps.map((stepName, index) => {
           const isActive = step === index + 1;
           const isCompleted = step > index + 1;
           return (
          <React.Fragment key={stepName}>
            <div className="flex flex-col items-center relative z-10">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                  isCompleted ? 'bg-green-500 border-green-500 scale-100' : 
                  isActive ? 'bg-gray-900 border-gray-900 scale-110 shadow-lg' : 
                  'bg-white border-gray-200'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <span className={`font-bold text-sm ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {index + 1}
                  </span>
                )}
              </div>
              <p className={`absolute -bottom-8 text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                {stepName}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-[2px] mx-2 bg-gray-100 relative overflow-hidden rounded-full">
                  <div className={`absolute top-0 left-0 h-full bg-green-500 transition-all duration-700 ease-out ${isCompleted ? 'w-full' : 'w-0'}`}></div>
              </div>
            )}
          </React.Fragment>
        )})}
      </nav>
    );
  };
  
  return (
    <div className="max-w-7xl mx-auto pt-32 pb-24 px-6 lg:px-8 animate-fade-in-up">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-16 tracking-tight">
        Secure Checkout
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        
        {/* Left Column: Forms */}
        <div className="lg:col-span-8">
          <div className="bg-white/70 backdrop-blur-xl rounded-[32px] shadow-sm border border-white/50 p-8 sm:p-10">
            <Stepper step={step} />
            <div className="mt-12">
            {step === 1 && (
                <form onSubmit={handleCustomerSubmit} className="space-y-8 animate-fade-in">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Info</h2>
                    <div className="space-y-6">
                        <FormInput label="Full Name" name="name" value={customerDetails.name} onChange={handleCustomerChange} required placeholder="Jane Doe" />
                        <FormInput label="Email Address" name="email" type="email" value={customerDetails.email} onChange={handleCustomerChange} required placeholder="jane@example.com" />
                        <FormInput 
                            label="Phone Number" 
                            name="phone" 
                            type="text" 
                            inputMode="numeric"
                            pattern="[0-9]{10}" 
                            value={customerDetails.phone} 
                            onChange={handleCustomerChange} 
                            required 
                            placeholder="10 digit mobile number" 
                            maxLength={10} 
                        />
                    </div>
                </div>
                <div className="pt-4">
                    <NextButton text="Continue to Address" />
                </div>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleAddressSubmit} className="space-y-8 animate-fade-in">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h2>
                    <div className="space-y-6">
                        <FormInput label="Street Address" name="street" value={addressDetails.street} onChange={handleAddressChange} required placeholder="123 Main St" />
                        <FormInput label="Landmark (Optional)" name="landmark" value={addressDetails.landmark} onChange={handleAddressChange} placeholder="Apt, Suite, Unit, etc." />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormSelect label="State" name="state" value={addressDetails.state} onChange={handleAddressChange} required>
                            <option value="">Select State</option>
                            {INDIAN_STATES.map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                            </FormSelect>
                            
                            <FormInput 
                            label="City" 
                            name="city" 
                            value={addressDetails.city} 
                            onChange={handleAddressChange} 
                            required 
                            placeholder="City" 
                            disabled={!addressDetails.state} 
                            />
                        </div>
                        
                        <FormInput 
                            label="Pincode" 
                            name="pincode" 
                            type="text"
                            value={addressDetails.pincode} 
                            onChange={handleAddressChange} 
                            required 
                            placeholder="123456" 
                            disabled={!addressDetails.state}
                            maxLength={6}
                            inputMode="numeric"
                            pattern="[0-9]{6}" 
                        />
                    </div>
                </div>
                <div className="pt-4 flex flex-col-reverse sm:flex-row gap-4">
                    <div className="sm:w-1/3">
                    <BackButton onClick={() => setStep(1)} />
                    </div>
                    <div className="sm:w-2/3">
                    <NextButton text="Continue to Payment" />
                    </div>
                </div>
                </form>
            )}

            {step === 3 && (
                <form onSubmit={handlePaymentSubmit} className="space-y-8 animate-fade-in">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
                    
                    <div className="space-y-4">
                        <PaymentOption value="COD" label="Cash on Delivery (COD)" icon={Truck} />
                        <PaymentOption value="UPI" label="UPI / GPay / PhonePe" icon={Smartphone} />
                        <PaymentOption value="CARD" label="Credit / Debit Card" icon={CreditCard} />
                    </div>

                    {(paymentMethod === 'UPI' || paymentMethod === 'CARD') && (
                        <div className="mt-6 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl text-center">
                        <p className="text-sm text-blue-600 font-medium">
                            You will be redirected to a secure payment gateway.
                        </p>
                        </div>
                    )}
                </div>
                
                <div className="pt-4 flex flex-col-reverse sm:flex-row gap-4">
                    <div className="sm:w-1/3">
                    <BackButton onClick={() => setStep(2)} />
                    </div>
                    <div className="sm:w-2/3">
                    <button
                        type="submit"
                        className="w-full flex justify-center items-center py-4 px-6 rounded-2xl shadow-lg shadow-green-200 text-[16px] font-semibold text-white bg-green-600 hover:bg-green-700 hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
                    >
                        {paymentMethod === 'COD' ? 'Place Order' : 'Pay Now'}
                        {paymentMethod === 'COD' ? <Truck className="w-5 h-5 ml-2" /> : <CheckCircle className="w-5 h-5 ml-2" />}
                    </button>
                    </div>
                </div>
                </form>
            )}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4">
          <OrderSummary 
            cartItems={cartItems} 
            subtotal={subtotal} 
            discount={discount} 
            total={total}
            appliedCoupon={appliedCoupon}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            handleApplyCoupon={handleApplyCoupon}
            couponMsg={couponMsg}
            removeCoupon={removeCoupon}
          />
        </div>

      </div>
    </div>
  );
};

const OrderDetailView = ({ order, onBack, onCancelOrder, setModal }) => {
  const isCancellable = order.status === 'Pending'; 

  const formattedDate = new Date(order.createdAt).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <button 
        onClick={onBack} 
        className="text-pink-600 hover:text-pink-800 flex items-center mb-6 font-medium transition-colors"
      >
        <ChevronLeft className="w-5 h-5 mr-1" /> Back to Orders
      </button>

      <div className="flex justify-between items-start border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Order #{order.id.substring(0, 8)}</h2>
          <p className="text-sm text-gray-500 mt-1">Placed on: {formattedDate}</p>
        </div>
        <StatusPill status={order.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-6 border border-gray-100 rounded-2xl bg-gray-50/50 space-y-3">
          <h3 className="text-lg font-bold text-gray-800 flex items-center"><MapPin size={18} className="mr-2 text-pink-500"/>Delivery Address</h3>
          <div className="text-sm text-gray-600 space-y-1 pl-6">
            <p className="font-semibold text-gray-900">{order.customer.name}</p>
            <p>{order.address.street}, {order.address.landmark}</p>
            <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
            <p className="text-gray-500 pt-1">Phone: {order.customer.phone}</p>
          </div>
        </div>
        
        <div className="md:col-span-1 space-y-4">
          <div className="p-6 border border-pink-100 rounded-2xl bg-pink-50/50">
            <h3 className="text-lg font-bold text-pink-900">Total: ₹{order.total.toFixed(2)}</h3>
            {order.discount > 0 && (
              <p className="text-xs text-green-600 font-bold uppercase tracking-wide mt-1">Savings: ₹{order.discount}</p>
            )}
            <p className="text-sm text-pink-700 mt-2 flex items-center"><CreditCard size={14} className="mr-2"/> {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}</p>
          </div>
          
          {isCancellable ? (
            <button
              onClick={() => {
                setModal({
                    title: "Confirm Cancellation",
                    body: `Are you sure you want to cancel order #${order.id.substring(0, 8)}?`,
                    onClose: () => onCancelOrder(order.id) 
                });
              }}
              className="w-full flex items-center justify-center py-3 px-4 border border-red-200 rounded-xl shadow-sm text-sm font-semibold text-red-600 bg-white hover:bg-red-50 hover:border-red-300 transition-all"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel Order
            </button>
          ) : (
            <div className="w-full text-center text-xs font-medium text-gray-400 p-3 border border-gray-100 rounded-xl bg-gray-50">
              Cancellation window closed
            </div>
          )}
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 pt-6">Items ({order.items.length})</h3>
      <ul className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden bg-white">
        {order.items.map((item, index) => (
          <li key={index} className="flex justify-between items-center p-5 hover:bg-gray-50 transition-colors">
            <div className="flex items-center">
              <div className="p-2 bg-pink-50 rounded-lg mr-4 text-pink-500"><Package className="w-5 h-5" /></div>
              <span className="font-semibold text-gray-800">{item.name}</span>
            </div>
            <span className="font-bold text-gray-900">₹{item.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const BookingsListView = ({ userOrders, setPage }) => {
    return (
      <div className="space-y-4 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bridal Bookings</h2>
        {userOrders.length === 0 ? (
          <div className="text-center p-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <Calendar className="w-12 h-12 text-pink-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">You have no pending booking inquiries.</p>
            <button onClick={() => setPage('bridal')} className="mt-6 text-pink-600 hover:text-pink-700 font-semibold text-sm hover:underline">Book a Service</button>
          </div>
        ) : (
          userOrders.map(booking => (
            <div key={booking.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="text-left">
                  <p className="text-lg font-bold text-gray-900">{booking.service.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</p>
                  <p className="text-sm text-gray-500 font-medium mt-1 flex items-center"><Calendar size={14} className="mr-1.5"/>{new Date(booking.date).toLocaleDateString()}</p>
                </div>
                <StatusPill status={booking.status} isBooking={true} />
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-600 space-y-1.5">
                <p><span className="font-semibold text-gray-900">Client:</span> {booking.name}</p> 
                <p><span className="font-semibold text-gray-900">Contact:</span> {booking.phone}</p>
                <p><span className="font-semibold text-gray-900">Email:</span> {booking.email}</p>
                {booking.message && <p className="pt-2 text-gray-500 italic">"{booking.message}"</p>}
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

const AccountPage = ({ user, userOrders, userBookings, onSignOut, setPage, onCancelOrder, setModal }) => {
  const [view, setView] = useState('orders'); 
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setView('detail');
  };

  const NavButton = ({ targetView, icon: Icon, label }) => (
    <button
      onClick={() => { setView(targetView); setSelectedOrder(null); }}
      className={`w-full text-left flex items-center p-4 rounded-2xl transition-all duration-200 font-medium ${
        view === targetView 
          ? 'bg-gray-900 text-white shadow-md transform scale-[1.02]' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon className={`w-5 h-5 mr-3 ${view === targetView ? 'text-pink-400' : 'text-gray-400'}`} />
      {label}
      {view === targetView && <ChevronRight className="ml-auto w-4 h-4 text-gray-500" />}
    </button>
  );

  const OrderCard = ({ order }) => {
    return (
      <button 
        onClick={() => handleOrderClick(order)} 
        className="w-full text-left bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 mb-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Order ID</p>
            <p className="text-base font-bold text-gray-900">#{order.id.substring(0, 8)}</p>
          </div>
          <div className="text-right">
             <StatusPill status={order.status} />
          </div>
        </div>
        
        <div className="flex justify-between items-end border-t border-gray-50 pt-4">
          <div>
             <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
             <p className="text-sm font-medium text-gray-700 mt-1">{order.items.length} item(s)</p>
          </div>
          <span className="text-xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors">₹{order.total.toFixed(2)}</span>
        </div>
      </button>
    );
  };
  
  const renderContent = () => {
    if (view === 'detail' && selectedOrder) {
      return <OrderDetailView 
                 order={selectedOrder} 
                 onBack={() => setView('orders')} 
                 onCancelOrder={onCancelOrder}
                 setModal={setModal}
               />;
    }

    switch (view) {
      case 'orders':
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">My Orders</h2>
            {userOrders.length === 0 ? (
              <div className="text-center p-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <ShoppingBag className="w-12 h-12 text-pink-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">You haven't placed any orders yet.</p>
                <button onClick={() => setPage('products')} className="mt-6 px-6 py-2 bg-pink-600 text-white rounded-full text-sm font-semibold hover:bg-pink-700 transition-colors shadow-sm">Start Shopping</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                 {userOrders.map(order => <OrderCard key={order.id} order={order} />)}
              </div>
            )}
          </div>
        );
      case 'bookings': 
        return <BookingsListView userOrders={userBookings} setPage={setPage} />; 
      case 'address':
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Saved Address</h2>
            <div className="p-8 bg-white border border-gray-100 rounded-[32px] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><MapPin size={100}/></div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Default Shipping Address</p>
              {userOrders.length > 0 ? (
                <div className="text-base text-gray-600 space-y-2 relative z-10">
                  <p className="text-xl font-bold text-gray-900 mb-2">{userOrders[0].customer.name}</p>
                  <p>{userOrders[0].address.street}, {userOrders[0].address.landmark}</p>
                  <p>{userOrders[0].address.city}, {userOrders[0].address.state} - {userOrders[0].address.pincode}</p>
                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center text-gray-500">
                     <Smartphone size={16} className="mr-2"/> {userOrders[0].customer.phone}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                   <p className="text-gray-500">No saved address found. Place an order to save your details.</p>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 text-center">Your address is automatically updated when you place a new order.</p>
          </div>
        );
      case 'details':
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Details</h2>
            <div className="p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm space-y-6">
               <div className="flex items-center space-x-4 pb-6 border-b border-gray-50">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold text-gray-400">
                     {user.displayName ? user.displayName.charAt(0) : <User/>}
                  </div>
                  <div>
                     <p className="text-sm text-gray-400 font-bold uppercase">Profile</p>
                     <p className="text-xl font-bold text-gray-900">{user.displayName || 'User'}</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <p className="text-sm text-gray-400 font-bold uppercase mb-1">Email</p>
                     <p className="text-gray-700 font-medium">{user.email}</p>
                  </div>
                  <div>
                     <p className="text-sm text-gray-400 font-bold uppercase mb-1">Phone</p>
                     <p className="text-gray-700 font-medium">{userOrders[0]?.customer?.phone || 'Not Saved'}</p>
                  </div>
                  <div>
                     <p className="text-sm text-gray-400 font-bold uppercase mb-1">Member Since</p>
                     <p className="text-gray-700 font-medium">{new Date(user.metadata.creationTime).toLocaleDateString()}</p>
                  </div>
                  <div>
                     <p className="text-sm text-gray-400 font-bold uppercase mb-1">User ID</p>
                     <p className="text-gray-500 text-xs font-mono truncate">{user.uid}</p>
                  </div>
               </div>
            </div>
            
            <button
              onClick={onSignOut}
              className="w-full flex items-center justify-center py-4 px-6 border border-red-100 rounded-2xl shadow-sm text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 hover:border-red-200 transition-all duration-200 active:scale-95"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto pt-24 pb-16 px-4 sm:px-6 lg:px-8 animate-fadeIn text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Account Access Required</h1>
        <p className="text-lg text-gray-600">Please sign in to view your account details and orders.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pt-24 pb-16 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-12">My Account</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Nav */}
        <div className="lg:col-span-4 lg:col-start-1">
            <div className="bg-white/80 backdrop-blur-xl p-4 rounded-[32px] shadow-sm border border-white/40 sticky top-32">
                <div className="space-y-2">
                    <NavButton targetView="orders" icon={Package} label="My Orders" />
                    <NavButton targetView="bookings" icon={Calendar} label="My Bookings" /> 
                    <NavButton targetView="address" icon={MapPin} label="Saved Address" />
                    <NavButton targetView="details" icon={Settings} label="Account Settings" />
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-100 px-2 lg:hidden">
                    <button
                    onClick={onSignOut}
                    className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                    >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                    </button>
                </div>
            </div>
        </div>
        
        {/* Content Area */}
        <div className="lg:col-span-8 bg-white/60 backdrop-blur-md p-8 rounded-[40px] shadow-sm border border-white/40 min-h-[600px]">
          {renderContent()}
        </div>
        
      </div>
    </div>
  );
};

// ... (OurWorksSection, PostDetailModal, BridalBookingPage - Kept largely same structure but inherited global styles) ...

const OurWorksSection = ({ onPostClick, galleryItems }) => {
  const activeItems = galleryItems ? galleryItems.filter(item => item.isActive) : [];

  return (
    <div className="max-w-7xl mx-auto pt-4 pb-16 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
        Our Works: Inspiration Gallery
      </h2>
      
      {activeItems.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">No gallery items available at the moment.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {activeItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => onPostClick(item)} 
              className="bg-white rounded-2xl shadow-sm overflow-hidden group text-left transition-all hover:shadow-xl hover:-translate-y-1 relative aspect-square"
            >
              <div className="absolute inset-0">
                <img 
                  src={item.coverImage} 
                  alt={item.title || "Gallery Item"} 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { e.target.src = 'https://placehold.co/400x400/E0E0E0/B0B0B0?text=Work+Image'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {item.mediaType === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <PlayCircle className="w-12 h-12 text-white opacity-80 drop-shadow-lg" />
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                {item.title && <p className="text-sm font-bold text-white mb-0.5 truncate">{item.title}</p>}
                <p className="text-xs text-gray-200 truncate">{item.description || "View details"}</p>
              </div>
            </button>
          ))}
        </div>
      )}
      <p className="text-center text-sm text-gray-500 mt-8">Scroll down to book your personalized bridal service!</p>
    </div>
  );
};

const PostDetailModal = ({ post, onClose, setPage }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const mediaList = post.mediaUrls && post.mediaUrls.length > 0 
    ? post.mediaUrls 
    : [post.coverImage];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % mediaList.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex - 1 + mediaList.length) % mediaList.length
    );
  };
  
  const handleBookNowClick = () => {
    onClose(); 
    setPage('bridal'); 
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderMedia = (url) => {
    if (post.mediaType === 'video') {
      const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
      const isInstagram = url.includes('instagram.com');
      
      if (isYoutube) {
        let embedUrl = url;
        if (url.includes('watch?v=')) embedUrl = url.replace('watch?v=', 'embed/');
        if (url.includes('youtu.be/')) embedUrl = url.replace('youtu.be/', 'www.youtube.com/embed/');
        
        return (
          <iframe 
            src={embedUrl} 
            className="w-full h-full aspect-video rounded-2xl" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            title="Video"
          ></iframe>
        );
      } else if (isInstagram) {
         return (
           <div className="flex flex-col items-center justify-center h-full bg-gray-100 text-gray-500 p-4 text-center rounded-2xl">
             <Video className="w-12 h-12 mb-2" />
             <p className="text-sm mb-2">View this video on Instagram</p>
             <a href={url} target="_blank" rel="noopener noreferrer" className="text-pink-600 underline text-sm">Open Link</a>
           </div>
         );
      } else {
        return (
          <video src={url} controls className="w-full h-full max-h-[70vh] object-contain bg-black rounded-2xl">
            Your browser does not support the video tag.
          </video>
        );
      }
    } else {
      return (
        <img
          src={url}
          alt={`Gallery item ${currentImageIndex + 1}`}
          className="w-full h-full object-contain max-h-[70vh] rounded-2xl"
          loading="lazy"
          onError={(e) => { e.target.src = 'https://placehold.co/600x450/D0D0D0/808080?text=Error'; }}
        />
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-lg transition-opacity duration-300 p-4 animate-fade-in">
      <div className="w-full max-w-6xl max-h-full flex flex-col md:flex-row gap-6">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-50"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Media Container */}
        <div className="flex-1 relative flex items-center justify-center bg-black/50 rounded-3xl overflow-hidden min-h-[300px]">
           {renderMedia(mediaList[currentImageIndex])}
           
           {mediaList.length > 1 && (
             <>
               <button onClick={prevImage} className="absolute left-4 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full transition-colors z-10"><ChevronLeft className="w-6 h-6" /></button>
               <button onClick={nextImage} className="absolute right-4 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full transition-colors z-10"><ArrowRight className="w-6 h-6" /></button>
               <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
                 {mediaList.map((_, index) => (
                   <button
                     key={index}
                     onClick={() => setCurrentImageIndex(index)}
                     className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/30'}`}
                   />
                 ))}
               </div>
             </>
           )}
        </div>

        {/* Info Container */}
        <div className="w-full md:w-[350px] bg-white rounded-3xl p-8 flex flex-col h-fit">
           <h2 className="text-sm font-bold text-pink-500 uppercase tracking-widest mb-2">Inspiration</h2>
           {post.title && <h3 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h3>}
           <p className="text-gray-600 leading-relaxed mb-8">{post.description || post.caption}</p>
           
           <div className="mt-auto pt-6 border-t border-gray-100">
             <p className="text-xs text-gray-400 font-medium uppercase mb-4">Want this look?</p>
             <button
                onClick={handleBookNowClick} 
                className="w-full bg-gray-900 text-white py-4 px-6 rounded-2xl hover:bg-black transition-all shadow-lg hover:shadow-xl font-bold flex items-center justify-center"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book This Look
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

const BridalBookingPage = ({ onBookingSubmit, setIsLoading, setModal, isLoading, setPage, galleryItems }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '', 
    date: '',
    service: 'full_bridal',
    message: ''
  });
  
  const [selectedPost, setSelectedPost] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingDate = formData.date;
    if (!formData.name || !formData.email || !formData.phone || !bookingDate) {
      setModal({ title: "Missing Information", body: "Please fill in Name, Email, Phone, and Date before submitting." });
      return;
    }
    if (new Date(bookingDate) < new Date(today)) {
      setModal({ title: "Invalid Date", body: "Booking date cannot be in the past." });
      return;
    }
    if (formData.phone.length !== 10) {
      setModal({ title: "Invalid Phone Number", body: "Please enter a valid 10-digit phone number." });
      return;
    }
    onBookingSubmit(formData);
    setFormData({ name: '', email: '', phone: '', date: '', service: 'full_bridal', message: '' });
  };

  const handleGenerateClick = async () => {
    setIsLoading(true);
    setModal(null);
    const serviceName = {
      'full_bridal': 'Full Bridal Makeup',
      'bridal_party': 'Bridal Party Makeup',
      'engagement': 'Engagement Shoot Makeup',
      'consultation': 'Consultation'
    }[formData.service] || 'my makeup service';
    
    const systemPrompt = "You are a friendly and creative bridal assistant. Help the user write a short, enthusiastic, and descriptive message (2-3 sentences) for their makeup artist inquiry.";
    const userPrompt = `I'm booking a "${serviceName}" service for my wedding date ${formData.date}. Help me write a starter message.`;

    try {
      const responseText = await callGeminiAPI(systemPrompt, userPrompt);
      setFormData(prev => ({ ...prev, message: responseText }));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setModal({ title: "Error", body: `Could not generate message: ${error.message}` });
    }
  };

  useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
  }, []); 

  return (
    <div className="max-w-7xl mx-auto pt-24 pb-16 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      
      <OurWorksSection onPostClick={setSelectedPost} galleryItems={galleryItems} />
      
      {selectedPost && (
        <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} setPage={setPage} />
      )}
      
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Book Your Bridal Makeup
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Let's make your special day unforgettable. Fill out the form below to inquire.
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-[40px] shadow-xl overflow-hidden border border-white/50">
          <div className="p-8 sm:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                 <FormInput label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required />
                    <FormInput label="Contact Number" name="phone" value={formData.phone} onChange={handleChange} required placeholder="10-digit mobile" maxLength={10} inputMode="numeric" />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="Wedding Date" name="date" type="date" value={formData.date} onChange={handleChange} required min={today} />
                    <FormSelect label="Service Type" name="service" value={formData.service} onChange={handleChange}>
                        <option value="full_bridal">Full Bridal Makeup</option>
                        <option value="bridal_party">Bridal Party Makeup</option>
                        <option value="engagement">Engagement Shoot Makeup</option>
                        <option value="consultation">Consultation Only</option>
                    </FormSelect>
                 </div>
                 <div>
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="message" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Message (Optional)</label>
                      <button type="button" onClick={handleGenerateClick} disabled={isLoading} className="flex items-center text-xs text-pink-600 hover:text-pink-800 font-bold disabled:opacity-50">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Helper
                      </button>
                    </div>
                    <textarea id="message" name="message" rows="4" value={formData.message} onChange={handleChange} className="block w-full bg-slate-50 border-0 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all hover:bg-white"></textarea>
                 </div>
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full flex justify-center py-4 px-6 border border-transparent rounded-2xl shadow-lg text-lg font-bold text-white bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all">
                  Send Booking Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 mt-24">
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
      <div className="flex justify-center space-x-6 mb-6">
        <Sparkles className="w-8 h-8 text-pink-500" />
      </div>
      <p className="text-lg font-bold text-white mb-2">MOONZBEAUTY</p>
      <p className="text-base text-gray-400">
        &copy; {new Date().getFullYear()} All Rights Reserved.
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Crafting beautiful moments, one detail at a time.
      </p>
    </div>
  </footer>
);

// =================================================================
// MAIN APP COMPONENT
// =================================================================

export default function App() {
  const [page, setPage] = useState('home'); 
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]); 
  const [orders, setOrders] = useState([]); 
  const [bookings, setBookings] = useState([]);
  const [bridalGallery, setBridalGallery] = useState([]); 
  const [modal, setModal] =useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignInModalOpen, setSignInModalOpen] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null); 
  const [isAuthReady, setIsAuthReady] = useState(false);
  
  // ADMIN CHECK
  const isAdmin = user && user.email === ADMIN_EMAIL;

  const [isMobileMenuOpen, setMobileMenuMenuOpen] = useState(false);
  
  const userId = user?.uid; 

  // --- [ Firebase Collections References ] ---
  const productsColRef = useMemo(() => {
    if (!db) return null;
    return collection(db, 'products');
  }, [db]);
  
  const userCartColRef = useMemo(() => {
    if (!db || !userId) return null;
    return collection(db, 'users', userId, 'cart');
  }, [db, userId]);

  // New Wishlist Collection Ref
  const userWishlistColRef = useMemo(() => {
    if (!db || !userId) return null;
    return collection(db, 'users', userId, 'wishlist');
  }, [db, userId]);

  const userBookingsColRef = useMemo(() => {
    if (!db || !userId) return null;
    return collection(db, 'users', userId, 'bookings');
  }, [db, userId]);

  const userOrdersColRef = useMemo(() => {
    if (!db || !userId) return null;
    return collection(db, 'users', userId, 'orders');
  }, [db, userId]);

  const adminBookingsColRef = useMemo(() => {
    if (!db) return null;
    return collection(db, 'admin_bookings');
  }, [db]);

  const adminOrdersColRef = useMemo(() => {
    if (!db) return null;
    return collection(db, 'admin_orders');
  }, [db]);

  // --- [ Effects ] ---

  useEffect(() => {
    if (Object.keys(FIREBASE_CONFIG).length === 0) {
      console.error("Firebase config is empty. App cannot initialize.");
      setModal({ title: "Error", body: "Firebase configuration is missing." });
      return;
    }
    
    try {
      let app;
      try {
        app = getApp(); 
      } catch (e) {
        app = initializeApp(FIREBASE_CONFIG); 
      }
      
      const authInstance = getAuth(app);
      const dbInstance = getFirestore(app);
      setLogLevel('silent');
      
      setAuth(authInstance);
      setDb(dbInstance);

      const unsubscribe = onAuthStateChanged(authInstance, (user) => {
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }
        setIsAuthReady(true);
      });

      return () => unsubscribe();
      
    } catch (e) {
      console.error("Error initializing Firebase:", e);
      setModal({ title: "Initialization Error", body: "Failed to initialize Firebase." });
    }
  }, []);

  useEffect(() => {
    if (!productsColRef) return;

    const q = query(productsColRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productsData = [];
      querySnapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() });
      });
      setProducts(productsData);
    }, (error) => {
      console.error("Error fetching products:", error);
    });

    return () => unsubscribe();
  }, [productsColRef]); 

  // Wishlist Sync Effect
  useEffect(() => {
    if (!userWishlistColRef) {
      setWishlist([]);
      return;
    }

    const q = query(userWishlistColRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const wishlistData = [];
      querySnapshot.forEach((doc) => {
        wishlistData.push({ id: doc.id, ...doc.data() });
      });
      setWishlist(wishlistData);
    }, (error) => {
      console.error("Error fetching wishlist:", error);
    });

    return () => unsubscribe();
  }, [userWishlistColRef]);

  // Gallery Sync Effect
  useEffect(() => {
      if(!db) return;
      const galleryRef = collection(db, 'bridal_gallery');
      const q = collection(db, 'bridal_gallery');

      const unsubscribe = onSnapshot(q, (snapshot) => {
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          items.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
          setBridalGallery(items);
      }, (error) => console.error("Gallery Fetch Error", error));

      return () => unsubscribe();
  }, [db]);

  useEffect(() => {
    if (!userCartColRef) {
      setCart([]);
      return;
    }

    const q = query(userCartColRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cartData = [];
      querySnapshot.forEach((doc) => {
        cartData.push({ id: doc.id, ...doc.data() });
      });
      setCart(cartData);
    }, (error) => {
      console.error("Error fetching cart:", error);
    });

    return () => unsubscribe();
  }, [userCartColRef]); 

  useEffect(() => {
    if (!userOrdersColRef) {
      setOrders([]);
      return;
    }
    
    const q = query(userOrdersColRef); 
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersData = [];
      querySnapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() });
      });
      ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(ordersData);
    }, (error) => {
      console.error("Error fetching orders:", error);
    });
    
    return () => unsubscribe();
  }, [userOrdersColRef]);

  useEffect(() => {
    if (!userBookingsColRef) {
      setBookings([]);
      return;
    }
    
    const q = query(userBookingsColRef); 
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const bookingsData = [];
      querySnapshot.forEach((doc) => {
        bookingsData.push({ id: doc.id, ...doc.data() });
      });
      bookingsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBookings(bookingsData);
    }, (error) => {
      console.error("Error fetching bookings:", error);
    });
    
    return () => unsubscribe();
  }, [userBookingsColRef]);


  // --- [ Event Handlers ] ---
  
  const handleSignInWithGoogle = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setSignInModalOpen(false); 
    } catch (error) {
      console.error("Error signing in with Google:", error);
      if (error.code === 'auth/unauthorized-domain') {
        setModal({ 
          title: "Firebase Setup Error", 
          body: `Google Sign-In is blocked by Firebase because this domain is not authorized.`
        });
      } else {
        setModal({ title: "Sign-In Error", body: `Could not sign in: ${error.message}` });
      }
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      setPage('home'); 
      setMobileMenuMenuOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
      setModal({ title: "Error", body: "Could not sign out." });
    }
  };
  
  const handleToggleWishlist = useCallback(async (product) => {
    if (!user) {
      setSignInModalOpen(true);
      return;
    }

    if (!userWishlistColRef) return;

    const isWishlisted = wishlist.some(item => item.id === product.id);

    try {
      if (isWishlisted) {
        await deleteDoc(doc(userWishlistColRef, product.id));
      } else {
        const { id, ...productData } = product;
        await setDoc(doc(userWishlistColRef, product.id), productData);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      setModal({ title: "Error", body: "Could not update wishlist." });
    }
  }, [user, userWishlistColRef, wishlist]);

  const handleAddToCart = useCallback(async (product) => {
    if (!user) {
      setSignInModalOpen(true);
      return;
    }
    
    const { id, ...productData } = product; 
    
    try {
      await addDoc(userCartColRef, productData);
      setModal({
        title: "Success!",
        body: `${product.name} has been added to your cart.`
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      setModal({ title: "Error", body: "Could not add item to cart." });
    }
  }, [user, userCartColRef]); 
  
  const handleRemoveFromCart = useCallback(async (cartItemId) => {
    if (!userCartColRef) return;
    
    try {
      const docRef = doc(userCartColRef, cartItemId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error removing from cart:", error);
      setModal({ title: "Error", body: "Could not remove item from cart." });
    }
  }, [userCartColRef]);

  const handleCheckout = () => {
    if (!user) {
      setSignInModalOpen(true);
      return;
    }
    
    if (cart.length === 0) {
      setModal({ title: "Empty Cart", body: "Please add items to your cart before checking out."});
      setPage('products');
      return;
    }
    
    setPage('checkout');
  };

  const handleConfirmOrder = useCallback(async (orderDetails) => {
    if (!userCartColRef || !userOrdersColRef || !adminOrdersColRef) return; 

    if (orderDetails.paymentMethod !== 'COD') {
       setModal({
         title: "Payment Unavailable",
         body: "Online payments (UPI/Card) are currently unavailable. Please use Cash on Delivery."
       });
       return;
    }

    setModal({
      title: "Order Placed!",
      body: "Thank you for your purchase. Your order is confirmed."
    });

    const cartItemsData = cart.map(item => ({ 
      id: item.id, 
      name: item.name, 
      price: item.price,
      category: item.category,
    }));
    
    const orderData = {
      ...orderDetails,
      items: cartItemsData, 
      createdAt: new Date().toISOString(),
      userId: user.uid,
      userName: user.displayName || orderDetails.customer.name,
      status: "Pending" 
    };

    try {
      const userOrderRef = await addDoc(userOrdersColRef, orderData);
      await setDoc(doc(adminOrdersColRef, userOrderRef.id), orderData);
    } catch (error) {
      console.error("Error saving order:", error);
    }

    try {
      const q = query(userCartColRef);
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    } catch (error) {
      console.error("Error clearing cart: ", error);
    }
    
    setPage('home'); 
  }, [userCartColRef, userOrdersColRef, adminOrdersColRef, db, cart, user]);
  
  const handleCancelOrder = useCallback(async (orderId) => {
    if (!userOrdersColRef || !adminOrdersColRef) return;

    try {
      const orderDocRef = doc(userOrdersColRef, orderId);
      const adminOrderDocRef = doc(adminOrdersColRef, orderId); 
      
      const updatePayload = {
        status: 'Cancelled',
        cancelledAt: new Date().toISOString()
      };
      
      await updateDoc(orderDocRef, updatePayload);
      await updateDoc(adminOrderDocRef, updatePayload);
      
      setModal({ title: "Order Cancelled", body: "Your order status has been successfully updated to 'Cancelled'." });
    } catch (error) {
      console.error("Error cancelling order:", error);
      setModal({ title: "Error", body: "Order could not be cancelled. Please try again." });
    }
  }, [userOrdersColRef, adminOrdersColRef]);

  const handleBookingSubmit = useCallback(async (bookingData) => {
    if (!user || !userBookingsColRef || !adminBookingsColRef) {
      setSignInModalOpen(true);
      return;
    }
    
    const bookingDetails = {
        ...bookingData,
        createdAt: new Date().toISOString(),
        status: "pending",
        customer: { 
          name: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone,
          uid: user.uid
        },
        user: { 
          name: user.displayName,
          email: user.email,
          uid: user.uid
        }
    };

    try {
      const userBookingRef = await addDoc(userBookingsColRef, bookingDetails);
      await setDoc(doc(adminBookingsColRef, userBookingRef.id), bookingDetails);

      setModal({
        title: "Booking Inquiry Sent!",
        body: "Our team will contact you shortly regarding the details of your booking."
      });
      setPage('account'); 
    } catch (error) {
      console.error("Error submitting booking:", error);
      setModal({ title: "Error", body: "Could not submit your booking inquiry." });
    }
  }, [user, userBookingsColRef, adminBookingsColRef, setPage]);
  
  
  const handleGenerateCartIdeas = async (currentCartItems) => { 
    if (currentCartItems.length === 0) {
      setModal({ title: "Empty Cart", body: "Add items to your cart to get recommendations!" });
      return;
    }
    
    setIsLoading(true);
    setModal(null);
    
    const cartItemNames = currentCartItems.map(item => item.name).join(', ');
    const cartItemNameSet = new Set(currentCartItems.map(item => item.name));
    const availableProductNames = products
      .filter(p => !cartItemNameSet.has(p.name))
      .map(p => p.name)
      .join(', ');

    if (availableProductNames.length === 0) {
        setIsLoading(false);
        setModal({ title: "Great!", body: "You've already got everything we sell! We can't recommend anything else." });
        return;
    }

    const systemPrompt = "You are a friendly e-commerce assistant for 'MOONZBEAUTY'. Your goal is to suggest 3 relevant products that are NOT already in the cart. Format the output as a bulleted list with bolded product names, followed by a brief reason. Be friendly and concise. If no products are available, say so.";
    const userPrompt = `Here are the products available to suggest: [${availableProductNames}].
My cart currently contains: [${cartItemNames}].
Based on my cart, suggest 3 other products I might love from the available list.`;

    try {
      const responseText = await callGeminiAPI(systemPrompt, userPrompt);
      setIsLoading(false);
      setModal({
        title: "✨ Here are some ideas for you!",
        body: responseText
      });
    } catch (error) {
      console.error("Error generating recommendations:", error);
      setIsLoading(false);
      setModal({ title: "Error", body: `Could not generate recommendations: ${error.message}` });
    }
  };

  const renderPage = () => {
    switch (page) {
      case 'products':
        return <ProductListPage 
                  products={products} 
                  onAddToCart={handleAddToCart}
                  onProductClick={setSelectedProduct} 
                  wishlist={wishlist}
                  onToggleWishlist={handleToggleWishlist}
                />;
      case 'bridal':
        return <BridalBookingPage 
                  onBookingSubmit={handleBookingSubmit} 
                  setIsLoading={setIsLoading}
                  setModal={setModal}
                  isLoading={isLoading} 
                  setPage={setPage} 
                  galleryItems={bridalGallery}
                />;
      case 'cart':
        return <CartPage 
                  cartItems={cart} 
                  onRemoveFromCart={handleRemoveFromCart} 
                  onCheckout={handleCheckout}
                  onGenerateIdeas={handleGenerateCartIdeas}
                  user={user} 
                />;
      case 'wishlist':
        return <WishlistPage 
                  wishlist={wishlist}
                  onAddToCart={handleAddToCart} 
                  onProductClick={setSelectedProduct}
                  onToggleWishlist={handleToggleWishlist}
                  setPage={setPage}
                  user={user}
                />;
      case 'checkout':
        if (cart.length === 0) {
          setPage('products'); 
          return <ProductListPage 
                    products={products} 
                    onAddToCart={handleAddToCart} 
                    onProductClick={setSelectedProduct}
                    wishlist={wishlist}
                    onToggleWishlist={handleToggleWishlist}
                   />;
        }
        return <CheckoutPage
                  cartItems={cart}
                  onConfirmOrder={handleConfirmOrder}
                  user={user} 
                  setModal={setModal}
                  userOrders={orders} 
                />;
      case 'account':
        if (!user) {
          setSignInModalOpen(true);
          setPage('home'); 
          return <HomePage 
                    products={products} 
                    setPage={setPage} 
                    onAddToCart={handleAddToCart} 
                    onProductClick={setSelectedProduct}
                    wishlist={wishlist}
                    onToggleWishlist={handleToggleWishlist}
                   />;
        }
        return <AccountPage 
                  user={user} 
                  userOrders={orders} 
                  userBookings={bookings} 
                  onSignOut={handleSignOut} 
                  setPage={setPage}
                  onCancelOrder={handleCancelOrder}
                  setModal={setModal} 
                />;
      case 'admin':
        if (!isAdmin) {
          setPage('home');
          return <HomePage products={products} setPage={setPage} onAddToCart={handleAddToCart} onProductClick={setSelectedProduct} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} />;
        }
        return <AdminDashboard db={db} user={user} setModal={setModal} />;
      case 'home':
      default:
        return <HomePage 
                  products={products} 
                  setPage={setPage} 
                  onAddToCart={handleAddToCart}
                  onProductClick={setSelectedProduct} 
                  wishlist={wishlist}
                  onToggleWishlist={handleToggleWishlist}
               />;
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-inter">
      <GlobalStyles />
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={handleAddToCart}
          isWishlisted={wishlist.some(item => item.id === selectedProduct.id)}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      {(isLoading || modal) && (
        <Modal 
          message={modal} 
          onClose={() => {
            setModal(null);
            if (isLoading) setIsLoading(false);
          }} 
          onConfirm={
            modal && modal.title === "Confirm Cancellation" && modal.onClose 
              ? () => {
                  const originalOnClose = modal.onClose;
                  setModal(null); 
                  originalOnClose(); 
              }
              : undefined
          }
          isLoading={isLoading} 
        />
      )}
      
      {isSignInModalOpen && (
        <SignInModal
          onClose={() => setSignInModalOpen(false)}
          onSignInWithGoogle={handleSignInWithGoogle}
        />
      )}
      
      <Header 
        setPage={setPage} 
        cartCount={cart.length} 
        user={user} 
        isMobileMenuOpen={isMobileMenuOpen}
        setMobileMenuMenuOpen={setMobileMenuMenuOpen}
        onSignInClick={() => setSignInModalOpen(true)} 
        onSignOut={handleSignOut}
        isAdmin={isAdmin}
      />

      <main className="flex-grow">
        {isAuthReady ? (
          renderPage()
        ) : (
          <div className="flex justify-center items-center h-64">
             <div className="flex flex-col items-center justify-center">
              <svg className="animate-spin h-10 w-10 text-pink-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-lg text-gray-500">Loading Your Shop...</p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
