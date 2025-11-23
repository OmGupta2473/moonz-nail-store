# MOONZNAILS E-Commerce

A modern React + Firebase based e-commerce platform for nail products including press-ons, gels, bridal sets, and more. Designed for learning, portfolio showcasing, and placement readiness.

## Features
- Google authentication (Firebase Auth)
- Product browsing with categories
- Add to cart / remove from cart
- Coupon system (e.g., `new100`, `moon200`)
- Order placement + order tracking
- Admin dashboard for product & order management
- Bridal lookbook gallery
- Responsive UI with Tailwind CSS

## Folder Structure
```
├── index.html            # Main HTML entry
├── package.json          # Project dependencies
├── vite.config.js        # Vite configuration
├── postcss.config.js     # PostCSS plugins
├── tailwind.config.js    # Tailwind configuration
├── src/
│   ├── App.jsx           # Entire frontend logic (auth, cart, products, admin)
│   ├── main.jsx          # App entry point
│   ├── index.css         # Global styles + Tailwind imports
│   └── components/       # Auto-generated component folder
├── .gitignore
└── README.md
```

## Technologies Used
- **Frontend:** React, Vite, Tailwind CSS, Lucide Icons
- **Backend:** Firebase Authentication & Firestore
- **Other:** Google Fonts (Inter), Fetch-based API calls

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- Firebase project with Auth + Firestore enabled

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

## Firebase Setup
1. Go to Firebase Console
2. Create project
3. Enable Google Login
4. Enable Firestore
5. Replace config inside `App.jsx` with your Firebase keys

## Contribution Guidelines
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push your branch
5. Open a Pull Request
