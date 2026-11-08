# 📚 BookNook – A Small Online Library

> **"Add a book, borrow a book, return a book."**

**Live Website URL**: [https://booknook-online-library.vercel.app](https://booknook-online-library.vercel.app)  
**Client Repository**: [https://github.com/RanaWrong/BookNook-Frontend](https://github.com/RanaWrong/BookNook-Frontend)  
**Server Repository**: [https://github.com/RanaWrong/BookNook-Backend](https://github.com/RanaWrong/BookNook-Backend)

---

## 🌟 Key Features

- **Dynamic New Arrivals Showcase**: Automatically queries and renders the 6 freshest book additions from the MongoDB database on the home page with instant "View Details" access.
- **Interactive Swiper Banner Slider**: Elegant multi-slide carousel featuring custom typography, curated book themes, and direct navigation into the catalog.
- **Real-Time Stock & Atomic Decrement ($inc)**: Accurately manages physical copies in circulation. Borrowing decrements available copies by 1, returning restocks by 1, and depleted stock disables borrowing with clear "Out of Stock" badges.
- **Strict Double-Borrow Prevention**: Intelligent validation guarantees that a user cannot borrow duplicate copies of the same title concurrently, safeguarding library resources.
- **Full Contributor CRUD & Custom Modals**: Registered members can add books with ImgBB cover uploads, edit their submitted book details with prefilled data, and remove items with zero default browser dialogs.
- **Robust Authentication & JWT Protection**: Powered by BetterAuth with MongoDB adapter, strict password criteria (uppercase, lowercase, 6+ characters), and seamless token authorization across Express REST endpoints.
- **Theme Customization & Responsive UI**: Smooth Dark/Light mode toggle, custom 404 page with home navigation, persistent session retention on page reloads, and modern X branding.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Next-Themes (Dark/Light mode)
- **Icons**: Lucide React (featuring the modern X logo)
- **Components & Sliders**: Swiper.js, Custom Radix-style Modals
- **Notifications**: Sonner Toaster (toast notifications for all user actions)
- **Image Hosting**: ImgBB API Integration
- **Authentication**: BetterAuth + MongoDB Adapter + JWT

---

## 📂 Project Architecture

```
BookNook Frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login form with Google OAuth
│   │   └── register/page.tsx       # Registration with password criteria
│   ├── books/
│   │   ├── page.tsx                # All books 3-column grid & search/filters
│   │   └── [id]/page.tsx           # Book details & borrow modal
│   ├── add-book/page.tsx           # Private route: Add book form & ImgBB upload
│   ├── my-books/page.tsx           # Private route: User's books, edit & delete
│   ├── my-borrows/page.tsx         # Private route: Borrowed loans table & return
│   ├── not-found.tsx               # Custom 404 error page
│   ├── layout.tsx                  # Root layout with Navbar, Footer & Providers
│   └── page.tsx                    # Home page (Slider, New Arrivals, Custom Sections)
├── components/
│   ├── books/                      # BookCard, BorrowModal, EditBookModal, DeleteConfirmModal
│   ├── home/                       # BannerSlider, NewArrivals, HowItWorks, TopCategories
│   └── layout/                     # Navbar, Footer, ThemeToggle
├── context/                        # AuthContext & Session management
├── lib/                            # API client, ImgBB utility, BetterAuth configs
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js >= 18.x
- Running instance of BookNook Backend (default port 5000)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/sketchyouridea/BookNook-Client.git
cd BookNook-Client

# Install dependencies
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
BETTER_AUTH_SECRET=<random 32+ characters, e.g. from: openssl rand -base64 48>
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/booknook?retryWrites=true&w=majority
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License
This project is open-source under the MIT License.

