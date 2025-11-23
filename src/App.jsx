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
  Heart
} from 'lucide-react';

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

const ADMIN_EMAIL = "omgupta111k@gmail.com";

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", 
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", 
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const DUMMY_PRODUCTS = [
  {
    name: "Classic Nude Press-Ons",
    price: 600.00,
    originalPrice: 999.00,
    category: "Press-Ons",
    imageUrl: "https://placehold.co/600x600/F7D9D9/8B5E5E?text=Classic+Nude+Cover",
    description: "Elegant and timeless nude press-on nails suitable for any occasion. These nails are durable, reusable, and give a salon-quality finish in minutes.",
    images: [
      "https://placehold.co/600x600/F7D9D9/8B5E5E?text=Classic+Nude+1",
      "https://placehold.co/600x600/EED0D0/8B5E5E?text=Classic+Nude+2",
      "https://placehold.co/600x600/FFE0E0/8B5E5E?text=Classic+Nude+3",
      "https://placehold.co/600x600/F0C0C0/8B5E5E?text=Classic+Nude+4"
    ]
  },
  {
    name: "Holographic Shimmer Polish",
    price: 450.00,
    originalPrice: 999.00,
    category: "Polish",
    imageUrl: "https://placehold.co/600x600/E0BBE4/6C4B7C?text=Holo+Polish+Cover",
    description: "Dazzle with this holographic shimmer nail polish that changes color in different lights. Long-lasting formula that resists chipping.",
    images: [
      "https://placehold.co/600x600/E0BBE4/6C4B7C?text=Holo+Polish+1",
      "https://placehold.co/600x600/D0AADD/6C4B7C?text=Holo+Polish+2",
      "https://placehold.co/600x600/C099CC/6C4B7C?text=Holo+Polish+3"
    ]
  },
  {
    name: "Bridal French Tip Set",
    price: 750.00,
    originalPrice: 1200.00,
    category: "Bridal",
    imageUrl: "https://placehold.co/600x600/FFFFFF/A0A0A0?text=French+Tip+Cover",
    description: "The perfect French tip set for your special day. Features delicate white tips with a subtle pink base, accented with tiny rhinestones.",
    images: [
      "https://placehold.co/600x600/FFFFFF/A0A0A0?text=French+Tip+1",
      "https://placehold.co/600x600/F5F5F5/A0A0A0?text=French+Tip+2",
      "https://placehold.co/600x600/EAEAEA/A0A0A0?text=French+Tip+3"
    ]
  },
  {
    name: "Ruby Red Gel Polish",
    price: 550.00,
    originalPrice: 850.00,
    category: "Gel",
    imageUrl: "https://placehold.co/600x600/BF0A30/FFFFFF?text=Ruby+Red+Cover",
    description: "A stunning, long-lasting ruby red gel that provides high gloss shine. Requires UV/LED lamp for curing.",
    images: [
      "https://placehold.co/600x600/BF0A30/FFFFFF?text=Ruby+Red+1",
      "https://placehold.co/600x600/A00828/FFFFFF?text=Ruby+Red+2",
      "https://placehold.co/600x600/800620/FFFFFF?text=Ruby+Red+3"
    ]
  },
  {
    name: "Midnight Matte Stiletto",
    price: 650.00,
    originalPrice: 1100.00,
    category: "Press-Ons",
    imageUrl: "https://placehold.co/600x600/1A1A1A/FFFFFF?text=Midnight+Matte",
    description: "Fierce and fashionable matte black stiletto nails. Perfect for a bold, edgy look.",
    images: [
      "https://placehold.co/600x600/1A1A1A/FFFFFF?text=Matte+Black+1",
      "https://placehold.co/600x600/2A2A2A/FFFFFF?text=Matte+Black+2",
      "https://placehold.co/600x600/000000/FFFFFF?text=Matte+Black+3"
    ]
  },
  {
    name: "Rose Gold Chrome",
    price: 800.00,
    originalPrice: 1500.00,
    category: "Press-Ons",
    imageUrl: "https://placehold.co/600x600/B76E79/FFFFFF?text=Rose+Gold+Chrome",
    description: "Mirror-finish rose gold nails that catch everyone's eye. High quality chrome powder finish.",
    images: [
      "https://placehold.co/600x600/B76E79/FFFFFF?text=Chrome+1",
      "https://placehold.co/600x600/C58F97/FFFFFF?text=Chrome+2",
      "https://placehold.co/600x600/D4B0B5/FFFFFF?text=Chrome+3"
    ]
  },
  {
    name: "Pastel Dream Kit",
    price: 999.00,
    originalPrice: 1800.00,
    category: "Polish Set",
    imageUrl: "https://placehold.co/600x600/FFB7B2/FFFFFF?text=Pastel+Kit",
    description: "A set of 5 pastel nail polishes including mint, lavender, baby pink, peach, and sky blue.",
    images: [
      "https://placehold.co/600x600/FFB7B2/FFFFFF?text=Pastel+1",
      "https://placehold.co/600x600/B5EAD7/FFFFFF?text=Pastel+2",
      "https://placehold.co/600x600/C7CEEA/FFFFFF?text=Pastel+3"
    ]
  },
  {
    name: "Galaxy Cat Eye",
    price: 700.00,
    originalPrice: 1200.00,
    category: "Gel",
    imageUrl: "https://placehold.co/600x600/4B0082/FFFFFF?text=Galaxy+Cat+Eye",
    description: "Magnetic cat-eye gel polish that creates a mesmerizing galaxy effect. Magnet stick included.",
    images: [
      "https://placehold.co/600x600/4B0082/FFFFFF?text=Galaxy+1",
      "https://placehold.co/600x600/380061/FFFFFF?text=Galaxy+2",
      "https://placehold.co/600x600/260040/FFFFFF?text=Galaxy+3"
    ]
  }
];

const DUMMY_BRIDAL_POSTS = [
  { id: 1, 
    imageUrl: "https://placehold.co/400x400/FCE7F3/8B5E5E?text=Bridal+Look+1", 
    caption: "Timeless elegance with a soft, glowing finish. Perfect for a morning ceremony.",
    images: [
      "https://placehold.co/600x450/FCE7F3/8B5E5E?text=Bridal+Look+1A",
      "https://placehold.co/600x450/F0D0D0/8B5E5E?text=Bridal+Look+1B",
      "https://placehold.co/600x450/F5C5C5/8B5E5E?text=Bridal+Look+1C",
    ]
  },
  { id: 2, 
    imageUrl: "https://placehold.co/400x400/FFE4E1/8B5E5E?text=Bridal+Look+2", 
    caption: "Bold eyes and a classic red lip—making a statement.",
    images: [
      "https://placehold.co/600x450/FFE4E1/8B5E5E?text=Bridal+Look+2A",
      "https://placehold.co/600x450/FFD0D0/8B5E5E?text=Bridal+Look+2B",
    ]
  },
  { id: 3, 
    imageUrl: "https://placehold.co/400x400/FFF0F5/8B5E5E?text=Bridal+Look+3", 
    caption: "Subtle shimmer and intricate detailing for the reception.",
    images: [
      "https://placehold.co/600x450/FFF0F5/8B5E5E?text=Bridal+Look+3A",
      "https://placehold.co/600x450/F0F0FF/8B5E5E?text=Bridal+Look+3B",
      "https://placehold.co/600x450/E6E6FA/8B5E5E?text=Bridal+Look+3C",
    ] 
  },
  { id: 4, 
    imageUrl: "https://placehold.co/400x400/F0F8FF/8B5E5E?text=Bridal+Look+4", 
    caption: "A traditional look elevated with modern contouring.",
    images: [
      "https://placehold.co/600x450/F0F8FF/8B5E5E?text=Bridal+Look+4A",
      "https://placehold.co/600x450/E0F0FF/8B5E5E?text=Bridal+Look+4B",
    ]
  },
  { id: 5, 
    imageUrl: "https://placehold.co/400x400/FAEBD7/8B5E5E?text=Bridal+Look+5", 
    caption: "South Indian bridal beauty, vibrant and rich.",
    images: [
      "https://placehold.co/600x450/FAEBD7/8B5E5E?text=Bridal+Look+5A",
      "https://placehold.co/600x450/E0D0B0/8B5E5E?text=Bridal+Look+5B",
      "https://placehold.co/600x450/C0B0A0/8B5E5E?text=Bridal+Look+5C",
    ] 
  },
  { id: 6, 
    imageUrl: "https://placehold.co/400x400/E6E6FA/8B5E5E?text=Bridal+Look+6", 
    caption: "Soft pastel tones for a garden wedding vibe.",
    images: [
      "https://placehold.co/600x450/E6E6FA/8B5E5E?text=Bridal+Look+6A",
      "https://placehold.co/600x450/D0D0E0/8B5E5E?text=Bridal+Look+6B",
    ]
  },
];


// =================================================================
// 2. GEMINI API HELPER
// =================================================================

const callGeminiAPI = async (systemPrompt, userPrompt) => {
  const apiKey = ""; 
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

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
// 3. REUSABLE HELPER COMPONENTS
// =================================================================

const Modal = ({ message, onClose, isLoading = false, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
    <div className="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-md text-center transform transition-all duration-300 scale-100 opacity-100">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[150px]">
          <svg className="animate-spin h-10 w-10 text-pink-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-700 mt-4">✨ Generating ideas...</p>
        </div>
      ) : (
        <>
          <h3 className="text-lg font-medium text-gray-900 mb-4">{message.title}</h3>
          <p className="text-sm text-gray-600 mb-6 whitespace-pre-wrap text-left">{message.body}</p>
          <div className={`flex ${onConfirm ? 'justify-between' : 'justify-center'} gap-3`}>
            {onConfirm && (
              <button
                onClick={onConfirm}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
              >
                Confirm & Cancel
              </button>
            )}
            <button
              onClick={onClose}
              className={`flex-1 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 transition-colors ${onConfirm ? 'bg-gray-300 text-gray-800 hover:bg-gray-400' : 'bg-pink-600 text-white hover:bg-pink-700'}`}
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  </div>
);

const SignInModal = ({ onClose, onSignInWithGoogle }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg shadow-xl p-8 w-11/12 max-w-md text-center">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h3>
      <p className="text-gray-600 mb-8">
        Please sign in with your Google account to continue.
      </p>
      <button
        onClick={onSignInWithGoogle}
        className="w-full flex items-center justify-center py-3 px-4 rounded-lg shadow-md bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
      >
        <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.2l7.15-7.15C35.8 2.15 30.2 0 24 0 14.61 0 6.37 5.96 2.63 14.31l7.64 5.9C11.83 13.01 17.5 9.5 24 9.5z"></path>
          <path fill="#34A853" d="M46.7 24.1c0-1.63-.14-3.2-.4-4.7H24v8.9h12.7c-.55 2.9-2.2 5.4-4.7 7.1v5.7h7.3c4.3-4 6.9-9.9 6.9-17z"></path>
          <path fill="#FBBC05" d="M11.83 28.3c-.37-.9-.58-1.85-.58-2.8s.21-1.9.58-2.8l-7.64-5.9C1.96 19.4 0 23.6 0 28.3c0 4.7.96 8.9 2.63 12.8l7.64-5.9c-.37-.9-.58-1.8-.58-2.8z"></path>
          <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.84-5.8l-7.3-5.7c-2.15 1.45-4.9 2.3-7.9 2.3-6.5 0-12.17-3.5-14.17-8.8l-7.64 5.9C6.37 42.04 14.61 48 24 48z"></path>
          <path fill="none" d="M0 0h48v48H0z"></path>
        </svg>
        Sign in with Google
      </button>
      <button
        onClick={onClose}
        className="w-full text-gray-500 hover:text-gray-700 mt-6"
      >
        Cancel
      </button>
    </div>
  </div>
);

const FormInput = ({ label, name, value, onChange, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm p-3"
      {...props}
    />
  </div>
);

const FormSelect = ({ label, name, value, onChange, children, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm p-3 bg-white"
      {...props}
    >
      {children}
    </select>
  </div>
);

const OrderSummary = memo(({ 
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
  <div className="bg-white rounded-lg shadow-xl p-8 sticky top-28">
    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Order</h2>
    <ul className="divide-y divide-gray-200 mb-6 max-h-64 overflow-y-auto">
      {cartItems.map(item => (
        <li key={item.id} className="flex justify-between items-center py-3">
          <span className="text-gray-600 truncate pr-4">{item.name}</span>
          <span className="font-medium text-gray-800">₹{(item.price || 0).toFixed(2)}</span>
        </li>
      ))}
    </ul>

    {/* Integrated Coupon Section */}
    <div className="mb-6 pt-4 border-t border-gray-200">
        <div className="flex items-center mb-3">
            <Ticket className="w-4 h-4 text-pink-600 mr-2" />
            <h3 className="text-sm font-medium text-gray-900">Have a coupon?</h3>
        </div>
        <div className="flex gap-2">
            <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter code"
            className="flex-1 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 text-sm p-2"
            disabled={appliedCoupon !== null}
            />
            {appliedCoupon ? (
            <button
                type="button"
                onClick={removeCoupon}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-md font-medium hover:bg-red-200 transition-colors text-xs"
            >
                Remove
            </button>
            ) : (
            <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-3 py-2 bg-gray-900 text-white rounded-md font-medium hover:bg-pink-600 transition-colors text-xs"
            >
                Apply
            </button>
            )}
        </div>
        {couponMsg?.text && (
            <p className={`mt-2 text-xs ${couponMsg.type === 'success' ? 'text-green-600 font-medium' : 'text-red-600'}`}>
            {couponMsg.text}
            </p>
        )}
        <p className="text-xs text-gray-400 mt-2">Try: <span className="font-mono">new100</span> or <span className="font-mono">moon200</span></p>
    </div>

    <div className="border-t border-gray-200 pt-4 space-y-2">
      <div className="flex justify-between items-center text-gray-600">
        <span className="text-base">Subtotal</span>
        <span className="font-medium">₹{subtotal.toFixed(2)}</span>
      </div>
      
      {discount > 0 && (
        <div className="flex justify-between items-center text-green-600">
          <span className="flex items-center text-base">
            <Tag className="w-4 h-4 mr-1" />
            Discount ({appliedCoupon})
          </span>
          <span className="font-medium">- ₹{discount.toFixed(2)}</span>
        </div>
      )}

      <div className="flex justify-between items-center pt-2 border-t mt-2">
        <span className="text-xl font-medium text-gray-900">Total</span>
        <span className="text-3xl font-bold text-gray-900">
          ₹{total.toFixed(2)}
        </span>
      </div>
    </div>
  </div>
));

const StatusPill = ({ status, isBooking = false }) => {
  let colorClass = 'bg-gray-100 text-gray-800';
  let displayStatus = status;

  if (isBooking) {
    if (status === 'pending') colorClass = 'bg-yellow-100 text-yellow-800';
    if (status === 'confirmed') colorClass = 'bg-green-100 text-green-800';
    if (status === 'rejected') colorClass = 'bg-red-100 text-red-800';
    displayStatus = status.charAt(0).toUpperCase() + status.slice(1);
  } else {
    if (status === 'Pending') colorClass = 'bg-yellow-100 text-yellow-800';
    if (status === 'Shipped') colorClass = 'bg-blue-100 text-blue-800';
    if (status === 'Delivered') colorClass = 'bg-green-100 text-green-800';
    if (status === 'Cancelled') colorClass = 'bg-red-100 text-red-800';
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colorClass}`}>
      {displayStatus}
    </span>
  );
};

// =================================================================
// 4. ADMIN COMPONENTS
// =================================================================

const AdminDashboard = ({ db, user, setModal }) => {
  const [activeTab, setActiveTab] = useState('orders'); // orders, bookings, products
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- Data Fetching ---
  useEffect(() => {
    if (!db) return;
    
    // Fetch Orders
    const ordersUnsubscribe = onSnapshot(query(collection(db, 'admin_orders')), (snapshot) => {
       const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
       // Sort locally since we might not have composite index
       data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
       setOrders(data);
    });

    // Fetch Bookings
    const bookingsUnsubscribe = onSnapshot(query(collection(db, 'admin_bookings')), (snapshot) => {
       const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
       data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
       setBookings(data);
    });

    // Fetch Products
    const productsUnsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
       const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
       setProducts(data);
    });

    return () => {
      ordersUnsubscribe();
      bookingsUnsubscribe();
      productsUnsubscribe();
    }
  }, [db]);

  // --- Handlers ---

  const handleUpdateOrderStatus = async (orderId, userId, newStatus) => {
    if (!db) return;
    try {
      // 1. Update Admin Copy
      const adminRef = doc(db, 'admin_orders', orderId);
      await updateDoc(adminRef, { status: newStatus });

      // 2. Update User Copy (if userId exists)
      if (userId) {
        const userRef = doc(db, 'users', userId, 'orders', orderId);
        await updateDoc(userRef, { status: newStatus });
      }
      
      setModal({ title: "Success", body: `Order status updated to ${newStatus}` });
    } catch (error) {
      console.error("Update Error:", error);
      setModal({ title: "Error", body: "Failed to update order status." });
    }
  };

  const handleUpdateBookingStatus = async (bookingId, userId, newStatus) => {
    if (!db) return;
    try {
      const adminRef = doc(db, 'admin_bookings', bookingId);
      await updateDoc(adminRef, { status: newStatus });

      if (userId) {
        const userRef = doc(db, 'users', userId, 'bookings', bookingId);
        await updateDoc(userRef, { status: newStatus });
      }
      setModal({ title: "Success", body: `Booking marked as ${newStatus}` });
    } catch (error) {
      console.error("Update Error:", error);
      setModal({ title: "Error", body: "Failed to update booking status." });
    }
  };

  const handleProductSave = async (productData, isEdit = false, productId = null) => {
    if (!db) return;
    try {
      if (isEdit && productId) {
        await setDoc(doc(db, 'products', productId), productData, { merge: true });
        setModal({ title: "Success", body: "Product updated successfully." });
      } else {
        // Create a slug ID from name
        const id = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        await setDoc(doc(db, 'products', id), productData);
        setModal({ title: "Success", body: "New product added." });
      }
    } catch (error) {
       console.error("Product Save Error:", error);
       setModal({ title: "Error", body: "Failed to save product." });
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!db) return;
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteDoc(doc(db, 'products', productId));
      setModal({ title: "Deleted", body: "Product removed." });
    } catch (error) {
      setModal({ title: "Error", body: "Could not delete product." });
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Shield className="w-8 h-8 text-pink-600 mr-3" />
          Admin Dashboard
        </h1>
        <p className="text-gray-500">Welcome back, Admin.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 mb-8 overflow-x-auto">
        {['orders', 'bookings', 'products'].map(tab => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`pb-3 px-4 text-sm font-medium capitalize whitespace-nowrap ${
               activeTab === tab 
                 ? 'border-b-2 border-pink-500 text-pink-600' 
                 : 'text-gray-500 hover:text-gray-700'
             }`}
           >
             {tab}
           </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow min-h-[400px]">
        {activeTab === 'orders' && (
          <AdminOrderList orders={orders} onUpdateStatus={handleUpdateOrderStatus} />
        )}
        {activeTab === 'bookings' && (
           <AdminBookingList bookings={bookings} onUpdateStatus={handleUpdateBookingStatus} />
        )}
        {activeTab === 'products' && (
           <AdminProductManager 
             products={products} 
             onSave={handleProductSave} 
             onDelete={handleDeleteProduct} 
           />
        )}
      </div>
    </div>
  );
};

const AdminOrderList = ({ orders, onUpdateStatus }) => {
  if (orders.length === 0) return <div className="p-8 text-center text-gray-500">No orders yet.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id.substring(0,6)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.customer?.name} <br/>
                <span className="text-xs text-gray-400">{order.customer?.phone}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.total.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusPill status={order.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <select 
                  className="border-gray-300 rounded text-sm p-1"
                  value={order.status}
                  onChange={(e) => onUpdateStatus(order.id, order.userId, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AdminBookingList = ({ bookings, onUpdateStatus }) => {
  if (bookings.length === 0) return <div className="p-8 text-center text-gray-500">No bookings yet.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">{booking.service.replace('_', ' ')}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(booking.date).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                 {booking.name}<br/>
                 <span className="text-xs">{booking.phone}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                 <StatusPill status={booking.status} isBooking={true} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                 <div className="flex space-x-2">
                   <button 
                     onClick={() => onUpdateStatus(booking.id, booking.customer.uid, 'confirmed')}
                     className="text-green-600 hover:text-green-900 bg-green-50 px-2 py-1 rounded"
                   >
                     Confirm
                   </button>
                   <button 
                     onClick={() => onUpdateStatus(booking.id, booking.customer.uid, 'rejected')}
                     className="text-red-600 hover:text-red-900 bg-red-50 px-2 py-1 rounded"
                   >
                     Reject
                   </button>
                 </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AdminProductManager = ({ products, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', price: '', originalPrice: '', category: 'Press-Ons', imageUrl: '', description: ''
  });

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || '',
      category: product.category,
      imageUrl: product.imageUrl,
      description: product.description || ''
    });
    setEditId(product.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ name: '', price: '', originalPrice: '', category: 'Press-Ons', imageUrl: '', description: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
    };
    onSave(payload, isEditing, editId);
    handleCancel();
  };

  return (
    <div className="p-6">
      {/* Form */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            placeholder="Product Name" 
            className="p-2 border rounded" 
            required
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
          <select 
            className="p-2 border rounded bg-white"
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
          >
            <option value="Press-Ons">Press-Ons</option>
            <option value="Polish">Polish</option>
            <option value="Gel">Gel</option>
            <option value="Bridal">Bridal</option>
            <option value="Polish Set">Polish Set</option>
          </select>
          <input 
            type="number" 
            placeholder="Price (₹)" 
            className="p-2 border rounded" 
            required
            value={formData.price}
            onChange={e => setFormData({...formData, price: e.target.value})}
          />
          <input 
            type="number" 
            placeholder="Original Price (Optional)" 
            className="p-2 border rounded" 
            value={formData.originalPrice}
            onChange={e => setFormData({...formData, originalPrice: e.target.value})}
          />
          <input 
            placeholder="Image URL" 
            className="p-2 border rounded md:col-span-2" 
            required
            value={formData.imageUrl}
            onChange={e => setFormData({...formData, imageUrl: e.target.value})}
          />
          <textarea 
            placeholder="Description" 
            className="p-2 border rounded md:col-span-2" 
            rows="3"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 flex items-center">
              <Save className="w-4 h-4 mr-2" /> {isEditing ? 'Update Product' : 'Add Product'}
            </button>
            {isEditing && (
              <button type="button" onClick={handleCancel} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <h3 className="text-lg font-bold text-gray-900 mb-4">Product Catalog</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg p-4 flex gap-4 bg-white items-start">
             <img src={product.imageUrl} className="w-20 h-20 object-cover rounded bg-gray-100" alt={product.name} />
             <div className="flex-1 min-w-0">
               <h4 className="font-semibold text-gray-900 truncate">{product.name}</h4>
               <p className="text-pink-600 font-bold">₹{product.price}</p>
               <div className="flex gap-2 mt-2">
                 <button onClick={() => handleEdit(product)} className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                   <Edit className="w-4 h-4" />
                 </button>
                 <button onClick={() => onDelete(product.id)} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100">
                   <Trash2 className="w-4 h-4" />
                 </button>
               </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =================================================================
// 5. PAGE/LARGE BLOCK COMPONENTS
// =================================================================

const ProductDetailModal = ({ product, onClose, onAddToCart, onToggleWishlist, isWishlisted }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : [product.imageUrl];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        <div className="w-full md:w-1/2 bg-gray-100 relative flex items-center justify-center p-4">
           <button 
             onClick={onClose}
             className="md:hidden absolute top-4 right-4 bg-white rounded-full p-2 shadow-md z-10 text-gray-600 hover:text-pink-600"
           >
             <X className="w-5 h-5" />
           </button>

           <div className="relative w-full h-full flex items-center justify-center group">
             <img 
               src={images[currentImageIndex]} 
               alt={`${product.name} - View ${currentImageIndex + 1}`}
               className="max-w-full max-h-[50vh] md:max-h-[600px] object-contain shadow-sm rounded-md"
               onError={(e) => { e.target.src = 'https://placehold.co/600x600/E0E0E0/B0B0B0?text=Image+Error'; }}
             />

             {images.length > 1 && (
               <>
                 <button 
                   onClick={prevImage}
                   className="absolute left-2 p-3 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-lg transition-all hover:scale-110"
                   aria-label="Previous Image"
                 >
                   <ChevronLeft className="w-6 h-6 text-pink-600" />
                 </button>
                 <button 
                   onClick={nextImage}
                   className="absolute right-2 p-3 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-lg transition-all hover:scale-110"
                   aria-label="Next Image"
                 >
                   <ArrowRight className="w-6 h-6 text-pink-600" />
                 </button>
               </>
             )}

             {images.length > 1 && (
               <div className="absolute bottom-4 flex space-x-2 bg-black/20 p-2 rounded-full backdrop-blur-sm">
                 {images.map((_, idx) => (
                   <button
                     key={idx}
                     onClick={() => setCurrentImageIndex(idx)}
                     className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                     aria-label={`Go to image ${idx + 1}`}
                   />
                 ))}
               </div>
             )}
           </div>
        </div>

        <div className="w-full md:w-1/2 p-8 overflow-y-auto relative">
          <button 
             onClick={onClose}
             className="hidden md:block absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors z-10"
           >
             <X className="w-8 h-8" />
           </button>

          {/* Added pr-12 to create space between the Wishlist icon and the Close button */}
          <div className="flex justify-between items-start mb-4 pr-12">
            <div className="mb-2">
              <span className="text-sm font-semibold tracking-wider text-pink-600 uppercase bg-pink-50 px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>
            <button 
              onClick={() => onToggleWishlist(product)}
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${isWishlisted ? 'text-red-500' : 'text-gray-400'}`}
              title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h2>
          
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-3xl font-bold text-gray-900">₹{(product.price || 0).toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xl text-gray-500 line-through">₹{product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <div className="prose text-gray-600 mb-8 leading-relaxed">
            <p>{product.description || "No description available for this product."}</p>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                onAddToCart(product);
              }}
              className="w-full py-4 bg-gray-900 text-white rounded-lg text-lg font-semibold hover:bg-pink-600 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Add to Cart
            </button>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mt-4 border-t pt-4">
               <div className="flex items-center gap-2">
                 <Truck className="w-4 h-4 text-pink-500" /> Fast Delivery
               </div>
               <div className="flex items-center gap-2">
                 <CheckCircle className="w-4 h-4 text-green-500" /> Authentic Quality
               </div>
               <div className="flex items-center gap-2">
                 <Sparkles className="w-4 h-4 text-yellow-500" /> Premium Finish
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCard = memo(({ product, onAddToCart, onProductClick, isWishlisted, onToggleWishlist }) => {
  const originalPriceDisplay = 999.00;
  
  return (
    <div 
      onClick={() => onProductClick(product)}
      className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group flex flex-col h-full relative"
    >
      <div className="relative h-64 overflow-hidden flex-shrink-0">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.target.src = 'https://placehold.co/400x400/E0E0E0/B0B0B0?text=Image+Error'; }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
           <span className="bg-white/90 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center">
             <Sparkles className="w-3 h-3 mr-1 text-pink-500" /> View Details
           </span>
        </div>
        {/* Heart Icon on Card */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-all z-10 ${isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-pink-500'}`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1" title={product.name}>{product.name}</h3>
        <div className="flex items-baseline gap-2 my-2 mt-auto">
          <p className="text-pink-600 font-bold text-xl">₹{(product.price || 0).toFixed(2)}</p>
          <p className="text-gray-500 font-medium text-sm line-through">₹{(product.originalPrice || originalPriceDisplay).toFixed(2)}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation(); 
            onAddToCart(product);
          }}
          className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg font-medium hover:bg-pink-600 transition-colors duration-300 flex items-center justify-center mt-2"
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
});

const Header = ({ 
  setPage, 
  cartCount, 
  user, 
  isMobileMenuOpen, 
  setMobileMenuMenuOpen,
  onSignInClick, 
  onSignOut,
  isAdmin 
}) => {
  const NavLink = ({ page, label, icon: Icon }) => (
    <button
      onClick={() => {
        setPage(page);
        setMobileMenuMenuOpen(false);
      }}
      className="flex items-center text-gray-600 hover:text-pink-600 transition-colors px-3 py-2 rounded-md text-sm font-medium"
    >
      <Icon className="w-5 h-5 mr-1" />
      {label}
    </button>
  );
  
  const AccountButton = () => (
    <button
      onClick={() => setPage('account')}
      className="text-gray-600 hover:text-pink-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
      title={user.displayName || 'My Account'}
    >
      <User className="w-6 h-6" />
    </button>
  );

  const renderAuthControls = (isMobile = false) => {
    if (user && !user.isAnonymous) {
      return (
        <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'items-center space-x-4'}`}>
          <div className="hidden md:block">
            <AccountButton />
          </div>
          {isMobile && (
            <button
              onClick={() => setPage('account')}
              className="flex items-center text-gray-600 hover:text-pink-600 transition-colors px-3 py-2"
            >
              <User className="w-5 h-6 mr-1" />
              My Account
            </button>
          )}
          <button
            onClick={onSignOut}
            className={`flex items-center text-gray-600 hover:text-pink-600 transition-colors ${isMobile ? 'px-3 py-2' : 'p-2 rounded-full'}`}
          >
            <LogOut className="w-5 h-6 mr-1" />
            Sign Out
          </button>
        </div>
      );
    } else {
      return (
        <button
          onClick={onSignInClick}
          className={`flex items-center text-gray-600 hover:text-pink-600 transition-colors ${isMobile ? 'px-3 py-2' : 'p-2 rounded-full'}`}
        >
          <LogIn className="w-5 h-6 mr-1" />
          Sign In
        </button>
      );
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <button 
            onClick={() => setPage('home')}
            className="flex-shrink-0 flex items-center text-2xl font-bold text-gray-900"
          >
            <Sparkles className="w-6 h-6 text-pink-500 mr-2" />
            MOONZNAILS
          </button>
          
          <div className="hidden md:flex md:items-center md:space-x-4">
            <NavLink page="home" label="Home" icon={Home} />
            <NavLink page="products" label="Nail Products" icon={ShoppingBag} />
            <NavLink page="bridal" label="Bridal Booking" icon={Calendar} />
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAdmin && (
               <button
                 onClick={() => setPage('admin')}
                 className="flex items-center bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
               >
                 <LayoutDashboard className="w-4 h-4 mr-2" />
                 Admin
               </button>
            )}
            {/* Wishlist Button */}
            <button
              onClick={() => setPage('wishlist')}
              className="text-gray-600 hover:text-pink-600 p-2 rounded-full hover:bg-pink-50 transition-colors"
              title="My Wishlist"
            >
              <Heart className="w-6 h-6" />
            </button>

            <button
              onClick={() => {
                setPage('cart');
              }}
              className="relative text-gray-600 hover:text-pink-600 p-2 rounded-full"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-pink-600 text-white text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            {renderAuthControls(false)}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => {
                setPage('cart');
              }}
              className="relative text-gray-600 hover:text-pink-600 p-2 rounded-full mr-2"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-pink-600 text-white text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-pink-600 p-2 rounded-md"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink page="home" label="Home" icon={Home} />
            <NavLink page="products" label="Nail Products" icon={ShoppingBag} />
            <NavLink page="bridal" label="Bridal Booking" icon={Calendar} />
            <NavLink page="wishlist" label="My Wishlist" icon={Heart} />
            {isAdmin && <NavLink page="admin" label="Admin Dashboard" icon={LayoutDashboard} />}
          </div>
          <div className="border-t border-gray-200 pt-4 pb-3 px-2 space-y-2">
             {renderAuthControls(true)}
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 mt-24">
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
      <div className="flex justify-center space-x-6 mb-6">
        <Sparkles className="w-8 h-8 text-pink-500" />
      </div>
      <p className="text-lg font-bold text-white mb-2">MOONZNAILS</p>
      <p className="text-base text-gray-400">
        &copy; {new Date().getFullYear()} All Rights Reserved.
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Crafting beautiful moments, one detail at a time.
      </p>
    </div>
  </footer>
);

const HomePage = ({ products, setPage, onAddToCart, onProductClick, wishlist, onToggleWishlist }) => (
  <div className="animate-fadeIn">
    <div className="relative bg-gradient-to-r from-pink-50 via-white to-pink-50 text-center py-24 px-4 h-[60vh] flex flex-col items-center justify-center">
      <img 
        src="https://placehold.co/1200x600/FCE7F3/8B5E5E?text=MOONZNAILS"
        alt="Bridal makeup and nails"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
          Beauty for Your Big Day
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-8">
          Discover stunning press-on nails and book professional bridal makeup services.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => setPage('products')}
            className="bg-gray-900 text-white py-3 px-8 rounded-lg text-lg font-medium hover:bg-pink-600 transition-colors duration-300"
          >
            Shop Nails
          </button>
          <button
            onClick={() => setPage('bridal')}
            className="bg-white text-gray-900 py-3 px-8 rounded-lg text-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors duration-300"
          >
            Book Bridal
          </button>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">
        Featured Products
      </h2>
      {products.length === 0 ? (
         <p className="text-center text-gray-500">
           No products found. Use the Admin Dashboard to add products.
         </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
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
  <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 animate-fadeIn">
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

// ADDED: WishlistPage Component Definition
const WishlistPage = ({ wishlist, onAddToCart, onProductClick, onToggleWishlist, setPage, user }) => {
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 animate-fadeIn text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Your Wishlist</h1>
        <p className="text-lg text-gray-600 mb-8">Please sign in to save your favorite items.</p>
        <Heart className="w-20 h-20 text-gray-200 mx-auto mb-6" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 animate-fadeIn">
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
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 animate-fadeIn text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          Loading Your Cart...
        </h1>
        <p className="text-lg text-gray-600">
          Please wait a moment.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
        Shopping Cart
      </h1>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">Your cart is empty.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <li key={item.id} className="flex flex-col sm:flex-row items-center p-4 sm:p-6">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  loading="lazy"
                  className="w-24 h-24 rounded-md object-cover mb-4 sm:mb-0 sm:mr-6"
                  onError={(e) => { e.target.src = 'https://placehold.co/100x100/E0E0E0/B0B0B0?text=Item'; }}
                />
                <div className="flex-1 text-center sm:text-left mb-4 sm:mb-0">
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  <p className="text-gray-500">{item.category}</p>
                </div>
                <div className="flex items-center">
                  <p className="text-lg font-semibold text-gray-900 w-24 text-center sm:text-right">
                    ₹{(item.price || 0).toFixed(2)}
                  </p>
                  <button
                    onClick={() => onRemoveFromCart(item.id)}
                    className="ml-6 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          
          <div className="bg-gray-50 p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-medium text-gray-900">Total</span>
              <span className="text-3xl font-bold text-gray-900">
                ₹{total.toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => onGenerateIdeas(cartItems)}
              className="w-full flex justify-center py-3 px-4 border border-pink-600 rounded-lg shadow-sm text-lg font-medium text-pink-600 bg-white hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors mb-4"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Get Personalized Recommendations
            </button>
            <button
              onClick={onCheckout}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gray-900 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
            >
              Proceed to Checkout
            </button>
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

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toLowerCase();
    
    // Reset state
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
      // Check order history. If 0 orders or undefined (loading), valid.
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
      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
        paymentMethod === value 
          ? 'bg-pink-50 border-pink-500 shadow-md' 
          : 'bg-white border-gray-300 hover:bg-gray-50'
      }`}
    >
      <input
        type="radio"
        id={value}
        name="paymentMethod"
        value={value}
        checked={paymentMethod === value}
        onChange={() => setPaymentMethod(value)}
        className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
      />
      <div className="ml-3 flex items-center">
        <Icon className="w-6 h-6 text-gray-700 mr-3" />
        <span className="text-sm font-medium text-gray-800">{label}</span>
      </div>
    </label>
  );

  const NextButton = ({ text, icon: Icon = ArrowRight }) => (
    <button
      type="submit"
      className="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
    >
      {text}
      <Icon className="w-5 h-5 ml-2" />
    </button>
  );

  const BackButton = ({ onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex justify-center items-center py-3 px-6 border border-gray-300 rounded-lg shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
    >
      <ArrowLeft className="w-5 h-5 mr-2" />
      Go Back
    </button>
  );

  const Stepper = ({ step }) => {
    const steps = ["1. Details", "2. Address", "3. Payment"];
    return (
      <nav className="flex items-center justify-between mb-8" aria-label="Progress">
        {steps.map((stepName, index) => (
          <React.Fragment key={stepName}>
            <div className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step > index + 1 ? 'bg-green-500' : 
                  step === index + 1 ? 'bg-pink-600 border-2 border-pink-700 shadow-lg' : 
                  'bg-gray-300'
                }`}
              >
                {step > index + 1 ? (
                  <Check className="w-6 h-6 text-white" />
                ) : (
                  <span className={`font-bold ${step === index + 1 ? 'text-white' : 'text-gray-600'}`}>
                    {index + 1}
                  </span>
                )}
              </div>
              <p className={`mt-2 text-sm font-medium ${step >= index + 1 ? 'text-pink-600' : 'text-gray-500'}`}>
                {stepName.split('. ')[1]}</p>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 ${step > index + 1 ? 'bg-green-500' : 'bg-gray-300'} mx-4`} />
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  };
  
  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
        Checkout
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 bg-white rounded-lg shadow-xl p-8">
          <Stepper step={step} />

          {step === 1 && (
            <form onSubmit={handleCustomerSubmit} className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">1. Customer Details</h2>
              <FormInput label="Full Name" name="name" value={customerDetails.name} onChange={handleCustomerChange} required placeholder="Your Full Name" />
              <FormInput label="Email Address" name="email" type="email" value={customerDetails.email} onChange={handleCustomerChange} required placeholder="you@example.com" />
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
              <div className="pt-4">
                <NextButton text="Next: Shipping Address" />
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleAddressSubmit} className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">2. Shipping Address</h2>
              <FormInput label="Street Address" name="street" value={addressDetails.street} onChange={handleAddressChange} required placeholder="House No, Building, Street" />
              <FormInput label="Landmark (Optional)" name="landmark" value={addressDetails.landmark} onChange={handleAddressChange} placeholder="Near..." />
              
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
                  placeholder="e.g. Mumbai" 
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
                placeholder="6 digit Pincode" 
                disabled={!addressDetails.state}
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]{6}" 
              />
              
              <div className="pt-4 flex flex-col-reverse sm:flex-row gap-4">
                <div className="sm:w-1/3">
                  <BackButton onClick={() => setStep(1)} />
                </div>
                <div className="sm:w-2/3">
                  <NextButton text="Next: Payment Method" />
                </div>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">3. Payment & Confirm</h2>
              
              {/* RE-ADDED COUPON SECTION TO PAYMENT STEP */}
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-5 mb-6">
                <div className="flex items-center mb-3">
                   <Ticket className="w-5 h-5 text-pink-600 mr-2" />
                   <h3 className="font-bold text-gray-900">Have a coupon?</h3>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code (e.g. new100)"
                    className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm p-2 bg-white"
                    disabled={appliedCoupon !== null}
                  />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-md font-medium hover:bg-red-200 transition-colors text-sm"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-gray-900 text-white rounded-md font-medium hover:bg-pink-600 transition-colors text-sm"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {couponMsg.text && (
                  <p className={`mt-2 text-sm ${couponMsg.type === 'success' ? 'text-green-600 font-bold' : 'text-red-600'}`}>
                    {couponMsg.text}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Try codes: <span className="font-mono bg-white px-1 rounded border">new100</span> (First Order) or <span className="font-mono bg-white px-1 rounded border">moon200</span> (Orders &gt; ₹1000)
                </p>
              </div>

              <div className="space-y-4">
                <PaymentOption value="COD" label="Cash on Delivery (COD)" icon={Truck} />
                <PaymentOption value="UPI" label="PhonePe / Google Pay / UPI" icon={Smartphone} />
                <PaymentOption value="CARD" label="Credit / Debit Card" icon={CreditCard} />
              </div>

              {(paymentMethod === 'UPI' || paymentMethod === 'CARD') && (
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <p className="text-sm text-blue-700">
                    You will be securely redirected to our payment partner to complete your purchase. (Simulation)
                  </p>
                </div>
              )}
              
              <div className="pt-4 flex flex-col-reverse sm:flex-row gap-4">
                <div className="sm:w-1/3">
                  <BackButton onClick={() => setStep(2)} />
                </div>
                <div className="sm:w-2/3">
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    {paymentMethod === 'COD' ? 'Place Order' : 'Confirm & Pay'}
                    {paymentMethod === 'COD' ? <Truck className="w-5 h-5 ml-2" /> : <CheckCircle className="w-5 h-5 ml-2" />}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="md:col-span-1">
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
    <div className="space-y-6">
      <button 
        onClick={onBack} 
        className="text-pink-600 hover:text-pink-800 flex items-center mb-6"
      >
        <ChevronLeft className="w-5 h-5 mr-1" /> Back to Orders
      </button>

      <div className="flex justify-between items-start border-b pb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Order #{order.id.substring(0, 8)}</h2>
          <p className="text-sm text-gray-500 mt-1">Placed on: {formattedDate}</p>
        </div>
        <StatusPill status={order.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-5 border rounded-lg bg-gray-50 space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Delivery Address</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium">{order.customer.name}</p>
            <p>{order.address.street}, {order.address.landmark}</p>
            <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
            <p>Phone: {order.customer.phone}</p>
          </div>
        </div>
        
        <div className="md:col-span-1 space-y-4">
          <div className="p-5 border rounded-lg bg-pink-50">
            <h3 className="text-lg font-semibold text-pink-800">Total: ₹{order.total.toFixed(2)}</h3>
            {order.discount > 0 && (
              <p className="text-xs text-green-600 font-medium">Includes discount: ₹{order.discount}</p>
            )}
            <p className="text-sm text-pink-600">Paid via: {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}</p>
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
              className="w-full flex items-center justify-center py-2 px-4 border border-red-500 rounded-lg shadow-sm text-sm font-medium text-red-500 bg-white hover:bg-red-50 transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel Order
            </button>
          ) : (
            <div className="w-full text-center text-sm text-gray-500 p-2 border border-gray-300 rounded-lg">
              Cancellation window closed.
            </div>
          )}
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 pt-4 border-t mt-4">Items ({order.items.length})</h3>
      <ul className="divide-y divide-gray-200 border rounded-lg overflow-hidden">
        {order.items.map((item, index) => (
          <li key={index} className="flex justify-between items-center p-4 bg-white">
            <div className="flex items-center">
              <Package className="w-5 h-5 text-pink-500 mr-3" />
              <span className="font-medium text-gray-800">{item.name}</span>
            </div>
            <span className="font-semibold text-gray-900">₹{item.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const BookingsListView = ({ userOrders, setPage }) => {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bridal Bookings</h2>
        {userOrders.length === 0 ? (
          <div className="text-center p-10 bg-gray-50 rounded-lg">
            <Calendar className="w-12 h-12 text-pink-400 mx-auto mb-3" />
            <p className="text-gray-600">You have no pending booking inquiries.</p>
            <button onClick={() => setPage('bridal')} className="mt-4 text-pink-600 hover:text-pink-800 font-medium">Book a Service</button>
          </div>
        ) : (
          userOrders.map(booking => (
            <div key={booking.id} className="bg-white p-5 rounded-lg shadow-md border-t-4 border-pink-500">
              <div className="flex justify-between items-start mb-3">
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{booking.service.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</p>
                  <p className="text-xs text-gray-500">For: {new Date(booking.date).toLocaleDateString()}</p>
                </div>
                <StatusPill status={booking.status} isBooking={true} />
              </div>
              <div className="border-t border-gray-200 pt-3 mt-3 text-sm text-gray-600">
                <p><span className="font-medium">Client:</span> {booking.name}</p> 
                <p><span className="font-medium">Contact:</span> {booking.phone}</p>
                <p><span className="font-medium">Email:</span> {booking.email}</p>
                <p className="mt-2 text-xs italic truncate">"{booking.message || "No message provided."}"</p>
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
      className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
        view === targetView 
          ? 'bg-pink-100 text-pink-700 font-semibold' 
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      <Icon className="w-5 h-6 mr-3" />
      {label}
    </button>
  );

  const OrderCard = ({ order }) => {
    return (
      <button 
        onClick={() => handleOrderClick(order)} 
        className="w-full text-left bg-white p-5 rounded-lg shadow-md border-t-4 border-pink-500 mb-4 hover:shadow-lg transition-shadow"
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Order ID:</p>
            <p className="text-sm font-medium text-gray-900">{order.id.substring(0, 10)}...</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase text-gray-500">Date:</p>
            <p className="text-sm font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-bold text-gray-900">Total: ₹{order.total.toFixed(2)}</span>
            <StatusPill status={order.status} />
          </div>
          <p className="text-sm text-gray-600">{order.items.length} item(s) purchased</p>
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
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>
            {userOrders.length === 0 ? (
              <div className="text-center p-10 bg-gray-50 rounded-lg">
                <Package className="w-12 h-12 text-pink-400 mx-auto mb-3" />
                <p className="text-gray-600">You haven't placed any orders yet.</p>
                <button onClick={() => setPage('products')} className="mt-4 text-pink-600 hover:text-pink-800 font-medium">Start Shopping</button>
              </div>
            ) : (
              userOrders.map(order => <OrderCard key={order.id} order={order} />)
            )}
          </div>
        );
      case 'bookings': 
        return <BookingsListView userOrders={userBookings} setPage={setPage} />; 
      case 'address':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Address</h2>
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <p className="font-semibold text-gray-800 mb-2">Default Shipping Address (From Last Order)</p>
              {userOrders.length > 0 ? (
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{userOrders[0].address.street}, {userOrders[0].address.landmark}</p>
                  <p>{userOrders[0].address.city}, {userOrders[0].address.state} - {userOrders[0].address.pincode}</p>
                  <p className="font-medium mt-3">Contact: {userOrders[0].customer.phone}</p>
                </div>
              ) : (
                <p className="text-gray-500">No saved address found. Place an order to save your details.</p>
              )}
            </div>
            <p className="text-sm text-gray-500 pt-4">Your address is automatically saved upon placing an order.</p>
          </div>
        );
      case 'details':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Details</h2>
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-sm space-y-3">
              <p><span className="font-medium text-gray-800">Name:</span> {user.displayName || userOrders[0]?.customer?.name || 'Not Available'}</p>
              <p><span className="font-medium text-gray-800">Email:</span> {user.email}</p>
              <p><span className="font-medium text-gray-800">Phone:</span> {userOrders[0]?.customer?.phone || 'Not Saved'}</p>
              <p><span className="font-medium text-gray-800">User ID:</span> {user.uid}</p>
              <p><span className="font-medium text-gray-800">Authentication:</span> Google</p>
            </div>
            <button
              onClick={onSignOut}
              className="mt-6 w-full flex items-center justify-center py-2 px-4 border border-red-500 rounded-lg shadow-sm text-sm font-medium text-red-500 bg-white hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-6 mr-2" />
              Logout
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 animate-fadeIn text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Account Access Required</h1>
        <p className="text-lg text-gray-600">Please sign in to view your account details and orders.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-12">My Account</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-xl h-fit">
          <NavButton targetView="orders" icon={Package} label="My Orders" />
          <NavButton targetView="bookings" icon={Calendar} label="My Bookings" /> 
          <NavButton targetView="address" icon={MapPin} label="Address" />
          <NavButton targetView="details" icon={ClipboardList} label="Account Details / Logout" />
          
          <div className="mt-6 pt-6 border-t border-gray-200 lg:hidden">
            <button
              onClick={onSignOut}
              className="w-full flex items-center justify-center py-2 px-4 border border-red-500 rounded-lg shadow-sm text-sm font-medium text-red-500 bg-white hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-6 mr-2" />
              Logout
            </button>
          </div>
        </div>
        
        <div className="lg:col-span-3 bg-white p-8 rounded-lg shadow-xl min-h-[500px]">
          {renderContent()}
        </div>
        
      </div>
    </div>
  );
};

const OurWorksSection = ({ onPostClick }) => (
  <div className="max-w-7xl mx-auto pt-4 pb-16 px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
      Our Works: Inspiration Gallery
    </h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {DUMMY_BRIDAL_POSTS.map(post => (
        <button 
          key={post.id} 
          onClick={() => onPostClick(post)} 
          className="bg-white rounded-lg shadow-md overflow-hidden group text-left transition-shadow hover:shadow-xl"
        >
          <img 
            src={post.imageUrl} 
            alt={post.caption} 
            loading="lazy"
            className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { e.target.src = 'https://placehold.co/400x400/E0E0E0/B0B0B0?text=Work+Image'; }}
          />
          <div className="p-3">
            <p className="text-xs text-gray-600 truncate">{post.caption}</p>
          </div>
        </button>
      ))}
    </div>
    <p className="text-center text-sm text-gray-500 mt-8">Scroll down to book your personalized bridal service!</p>
  </div>
);

const PostDetailModal = ({ post, onClose, setPage }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = post.images || [post.imageUrl];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % images.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex - 1 + images.length) % images.length
    );
  };
  
  const handleBookNowClick = () => {
    onClose(); 
    setPage('bridal'); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity duration-300 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-full overflow-y-auto transform transition-all duration-300">
        
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-80 transition-colors z-50"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          <div className="relative bg-gray-100 flex items-center justify-center">
            <img
              src={images[currentImageIndex]}
              alt={`Image ${currentImageIndex + 1} of ${post.caption}`}
              className="w-full h-full object-contain max-h-[70vh] rounded-tl-lg md:rounded-bl-lg"
              loading="lazy"
              onError={(e) => { e.target.src = 'https://placehold.co/600x450/D0D0D0/808080?text=Error'; }}
            />
            
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
                  aria-label="Next image"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </>
            )}

            {images.length > 1 && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-pink-500' : 'bg-white bg-opacity-50'
                    }`}
                    aria-label="View image"
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-pink-600 mb-3">Bridal Inspiration</h2>
            <p className="text-gray-800 text-lg mb-4">{post.caption}</p>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Service Details</h3>
              <p className="text-gray-600 mb-4">This look typically falls under our "Full Bridal Makeup" package, tailored to your event timing and attire.</p>
              
              <button
                onClick={handleBookNowClick} 
                className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg hover:bg-pink-700 transition-colors font-medium flex items-center justify-center"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book This Look Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BridalBookingPage = ({ onBookingSubmit, setIsLoading, setModal, isLoading, setPage }) => {
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
      setModal({
        title: "Missing Information",
        body: "Please fill in Name, Email, Phone, and Date before submitting."
      });
      return;
    }
    
    if (new Date(bookingDate) < new Date(today)) {
      setModal({
        title: "Invalid Date",
        body: "Booking date cannot be in the past. Please select a current or future date."
      });
      return;
    }
    
    if (formData.phone.length !== 10) {
      setModal({
        title: "Invalid Phone Number",
        body: "Please enter a valid 10-digit phone number."
      });
      return;
    }

    onBookingSubmit(formData);
    setFormData({ name: '', email: '', phone: '', date: '', service: 'full_bridal', message: '' });
  };

  const handleGenerateClick = async () => {
    setIsLoading(true);
    setModal(null);

    const serviceName = {
      'full_bridal': 'Full Bridal Makeup (Trial included)',
      'bridal_party': 'Bridal Party Makeup',
      'engagement': 'Engagement Shoot Makeup',
      'consultation': 'Consultation'
    }[formData.service] || 'my makeup service';
    
    const systemPrompt = "You are a friendly and creative bridal assistant. Help the user write a short, enthusiastic, and descriptive message (2-3 sentences) for their makeup artist inquiry. Focus on their excitement and ask one clarifying question for the artist.";
    const userPrompt = `I'm booking a "${serviceName}" service for my wedding date ${formData.date}. Help me write a starter message for the makeup artist.`;

    try {
      const responseText = await callGeminiAPI(systemPrompt, userPrompt);
      setFormData(prev => ({ ...prev, message: responseText }));
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating message:", error);
      setIsLoading(false);
      setModal({ title: "Error", body: `Could not generate message: ${error.message}` });
    }
  };

  const bookingFormRef = useRef(null); 
  
  useEffect(() => {
      if (bookingFormRef.current) {
          bookingFormRef.current.scrollIntoView({ behavior: 'smooth' });
      }
  }, [setPage]); 

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      
      <OurWorksSection onPostClick={setSelectedPost} />
      
      {selectedPost && (
        <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} setPage={setPage} />
      )}
      
      <div className="max-w-3xl mx-auto" ref={bookingFormRef}>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Book Your Bridal Makeup
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Let's make your special day unforgettable. Fill out the form below to inquire.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm p-2"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm p-2"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Contact Number</label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm p-2"
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Wedding Date</label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  min={today}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm p-2"
                />
              </div>
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700">Service Type</label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm p-2"
                >
                  <option value="full_bridal">Full Bridal Makeup (Trial included)</option>
                  <option value="bridal_party">Bridal Party Makeup</option>
                  <option value="engagement">Engagement Shoot Makeup</option>
                  <option value="consultation">Consultation Only</option>
                </select>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message (Optional)</label>
                  <button
                    type="button"
                    onClick={handleGenerateClick}
                    disabled={isLoading}
                    className="flex items-center text-xs text-pink-600 hover:text-pink-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Help me describe my look
                  </button>
                </div>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm p-2"
                ></textarea>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
                >
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


// =================================================================
// MAIN APP COMPONENT
// =================================================================

export default function App() {
  const [page, setPage] = useState('home'); 
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]); // New Wishlist State
  const [orders, setOrders] = useState([]); 
  const [bookings, setBookings] = useState([]); 
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
  
  // Wishlist Toggle Handler
  const handleToggleWishlist = useCallback(async (product) => {
    if (!user) {
      setSignInModalOpen(true);
      return;
    }

    if (!userWishlistColRef) return;

    const isWishlisted = wishlist.some(item => item.id === product.id);

    try {
      if (isWishlisted) {
        // Remove
        await deleteDoc(doc(userWishlistColRef, product.id));
      } else {
        // Add (Use product ID as doc ID for easy deduplication)
        // Exclude ID from data being saved to avoid nesting ID inside data
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
    } catch (error)
 {
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

    const systemPrompt = "You are a friendly e-commerce assistant for 'MOONZNAILS'. Your goal is to suggest 3 relevant products that are NOT already in the cart. Format the output as a bulleted list with bolded product names, followed by a brief reason. Be friendly and concise. If no products are available, say so.";
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