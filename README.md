# 🌙 MOONZNAILS — Full React + Firebase E-Commerce Store

A modern, fully functional **React + Vite + Firebase** E-Commerce application built for selling nail products such as press-ons, gels, bridal sets, and more.  
The project features authentication, admin controls, coupon system, cart, orders, and beautifully designed UI using **Tailwind CSS**.

---

## 🚀 Live Features

### 🛍️ Customer Features
- Browse products (Press-ons, Gel, Bridal, Polish sets, etc.)
- Detailed product pages with image gallery
- Add to Cart / Remove from cart
- Apply coupons (e.g., `new100`, `moon200`)
- Place orders with full address details
- Order tracking UI
- Wishlist functionality
- Bridal lookbook gallery

### 🔐 Authentication
Google Login via Firebase Auth.

### 🛠️ Admin Features
Admin email configured (`ADMIN_EMAIL`) enables:
- Add new products  
- Edit/update existing products  
- Delete products  
- Manage orders  
- Dashboard view  

### 🎨 UI/UX
- Built with **React 18 + Vite**
- Styled using **Tailwind CSS**  
- Lucide React Icons for modern UI
- Custom theme and animations

---

## 📁 Project Structure
```
root/
│── index.html
│── package.json
│── vite.config.js
│── postcss.config.js
│── tailwind.config.js
│── src/
│     ├── App.jsx
│     ├── main.jsx
│     ├── index.css
│     └── components/ (auto-generated)
```

---

## 🧰 Tech Stack

| Tool | Purpose |
|------|---------|
| **React 18** | Frontend framework |
| **Vite** | Fast development bundler |
| **Firebase** | Auth + Firestore DB |
| **Tailwind CSS** | Styling |
| **Lucide-React** | Icons |
| **Google Fonts – Inter** | Typography |

---

## 🔧 Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/moonz-nails-store.git
cd moonz-nails-store
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Run development server
```bash
npm run dev
```

### 4️⃣ Build for production
```bash
npm run build
```

---

## 🔥 Firebase Setup

The project uses Firebase config located in `App.jsx`.

### To use your own Firebase project:
1. Go to **Firebase Console**
2. Create a project
3. Enable:
   - Authentication → Google Login  
   - Firestore Database  
4. Replace the config in `App.jsx`:

```js
const FIREBASE_CONFIG = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};
```

---

## 🎁 Coupon System

| Coupon | Discount |
|--------|----------|
| `new100` | ₹100 off |
| `moon200` | ₹200 off |

---

## 🛒 Dummy Products Included
Products like:
- Classic Nude Press-Ons  
- Holographic Shimmer Polish  
- Bridal French Tip  
- Midnight Matte  
- Rose Gold Chrome  

(defined in `DUMMY_PRODUCTS`)

---

## 🖼️ Bridal Lookbook
Includes multiple bridal nail sets using `DUMMY_BRIDAL_POSTS`.

---

## ⚙️ Tailwind Setup

- `tailwind.config.js` — content paths, extended theme  
- `postcss.config.js` — Tailwind + Autoprefixer  
- `index.css` — fonts, animations, Tailwind layers  

---

## 🌟 Why This Project?
Perfect for:
- Portfolio Projects  
- E-commerce Learning  
- Firebase Practice  
- UI/UX + Tailwind Development  
- On-campus Placements  
- React/MERN Resume Boost  

---

## 📜 License

This project is open-source and free to modify.

---

## 🙌 Author
Made with ❤️ by **Om Gupta**

---

If you'd like, I can also generate:  
✅ Demo screenshots section  
✅ GIF preview  
✅ Resume-ready project description  
