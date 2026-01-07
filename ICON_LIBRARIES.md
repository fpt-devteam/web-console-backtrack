# Icon Libraries trong React

## 🎨 Các thư viện icon phổ biến nhất

### 1️⃣ **Lucide React** ⭐ (Đang dùng)

**Ưu điểm:**
- ✅ Lightweight (~50KB)
- ✅ Modern, clean design
- ✅ Tree-shakeable (chỉ bundle icon đang dùng)
- ✅ Consistent style
- ✅ TypeScript support

**Cài đặt:**
```bash
npm install lucide-react
```

**Sử dụng:**
```tsx
import { Menu, X, Home, User, Settings } from 'lucide-react';

<Menu className="w-6 h-6 text-blue-600" />
<Home size={24} color="red" strokeWidth={2} />
```

**Link:** https://lucide.dev

---

### 2️⃣ **React Icons** 

**Ưu điểm:**
- ✅ Nhiều bộ icon nhất (Font Awesome, Material, Bootstrap, etc.)
- ✅ 1 package cho tất cả
- ✅ Easy to use

**Nhược điểm:**
- ❌ Bundle size lớn nếu không tree-shake đúng

**Cài đặt:**
```bash
npm install react-icons
```

**Sử dụng:**
```tsx
// Font Awesome
import { FaFacebook, FaTwitter } from 'react-icons/fa';

// Material Design
import { MdHome, MdSettings } from 'react-icons/md';

// Bootstrap Icons
import { BsFillHeartFill } from 'react-icons/bs';

<FaFacebook size={24} color="blue" />
```

**Link:** https://react-icons.github.io/react-icons/

---

### 3️⃣ **Heroicons**

**Ưu điểm:**
- ✅ Từ team Tailwind CSS
- ✅ 2 styles: Outline & Solid
- ✅ Clean, professional
- ✅ Optimized cho Tailwind

**Cài đặt:**
```bash
npm install @heroicons/react
```

**Sử dụng:**
```tsx
// Outline (24x24)
import { HomeIcon, UserIcon } from '@heroicons/react/24/outline';

// Solid (24x24)
import { HomeIcon, UserIcon } from '@heroicons/react/24/solid';

// Mini (20x20)
import { HomeIcon } from '@heroicons/react/20/solid';

<HomeIcon className="h-6 w-6 text-blue-500" />
```

**Link:** https://heroicons.com

---

### 4️⃣ **Iconify**

**Ưu điểm:**
- ✅ 150,000+ icons từ 150+ bộ icon
- ✅ Tất cả icon sets ở 1 chỗ
- ✅ CDN support

**Cài đặt:**
```bash
npm install @iconify/react
```

**Sử dụng:**
```tsx
import { Icon } from '@iconify/react';

<Icon icon="mdi:home" width={24} />
<Icon icon="fa:facebook" color="blue" />
<Icon icon="logos:react" />
```

**Link:** https://iconify.design

---

### 5️⃣ **Font Awesome (React)**

**Ưu điểm:**
- ✅ Icon library lâu đời, nhiều người biết
- ✅ Pro version có nhiều icon hơn

**Nhược điểm:**
- ❌ Setup phức tạp hơn
- ❌ Bundle size lớn

**Cài đặt:**
```bash
npm install @fortawesome/fontawesome-svg-core
npm install @fortawesome/free-solid-svg-icons
npm install @fortawesome/react-fontawesome
```

**Sử dụng:**
```tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faHome } from '@fortawesome/free-solid-svg-icons';

<FontAwesomeIcon icon={faCoffee} size="2x" />
```

**Link:** https://fontawesome.com

---

## 📊 So sánh

| Library | Bundle Size | Số lượng icons | Tree-shakeable | TypeScript |
|---------|------------|----------------|----------------|------------|
| **Lucide** | ~50KB | 1,000+ | ✅ | ✅ |
| **React Icons** | ~200KB+ | 40,000+ | ⚠️ | ✅ |
| **Heroicons** | ~40KB | 300+ | ✅ | ✅ |
| **Iconify** | Variable | 150,000+ | ✅ | ✅ |
| **Font Awesome** | ~300KB+ | 30,000+ | ⚠️ | ✅ |

---

## 🎯 Khuyến nghị cho dự án này

### **Dùng Lucide React** ✅ (Đang dùng)

**Lý do:**
1. Lightweight, fast
2. Đủ icon cho hầu hết use cases
3. Consistent style
4. Tree-shakeable tốt
5. TypeScript support tốt

**Khi nào cần thư viện khác:**
- Cần icon đặc biệt (brand logos) → Dùng **React Icons** bổ sung
- Cần icon cụ thể không có trong Lucide → Dùng **Iconify**

---

## 💡 Best Practices

### 1. Tree-shaking
```tsx
// ✅ Good - Import chỉ icon cần dùng
import { Home, User } from 'lucide-react';

// ❌ Bad - Import toàn bộ library
import * as Icons from 'lucide-react';
```

### 2. Tạo Icon Wrapper Component
```tsx
// components/ui/icon.tsx
import { LucideIcon } from 'lucide-react';

interface IconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
}

export function Icon({ icon: IconComponent, size = 24, className }: IconProps) {
  return <IconComponent size={size} className={className} />;
}

// Usage
import { Home } from 'lucide-react';
<Icon icon={Home} size={20} className="text-blue-600" />
```

### 3. Accessibility
```tsx
// ✅ Good - Có aria-label
<button aria-label="Close menu">
  <X className="w-6 h-6" />
</button>

// ✅ Good - Icon có nghĩa decorative
<span aria-hidden="true">
  <CheckCircle className="w-5 h-5" />
</span>
```

### 4. Consistency
```tsx
// Tạo constants cho size
const ICON_SIZES = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

<Home size={ICON_SIZES.md} />
```

---

## 🔍 Tìm icon

### Lucide:
https://lucide.dev/icons

### React Icons:
https://react-icons.github.io/react-icons/search

### Heroicons:
https://heroicons.com

### Iconify:
https://icon-sets.iconify.design

---

## 📦 Package.json hiện tại

```json
{
  "dependencies": {
    "lucide-react": "^0.x.x"  // ✅ Đã có
  }
}
```

Nếu cần thêm:
```bash
npm install react-icons        # Nhiều icon hơn
npm install @heroicons/react   # Tailwind icons
npm install @iconify/react     # Tất cả icons
```

