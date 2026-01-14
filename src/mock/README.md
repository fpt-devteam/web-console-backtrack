# Mock System Documentation

This folder contains all mock implementations for development and testing without a real backend.

## 📁 Structure

```
mock/
├── config.ts                    # Mock configuration & USE_MOCK flag
├── data/
│   ├── mock-users.ts           # Mock user data with credentials
│   ├── mock-analytics.ts       # Mock analytics & activity logs
│   └── index.ts                # Data exports
├── services/
│   ├── auth.mock.service.ts    # Mock authentication service
│   └── index.ts                # Service exports
├── storage/
│   └── auth-storage.ts         # LocalStorage helpers with __MOCK__ prefix
└── README.md                   # This file
```

## 🚀 Quick Start

### Using Mock Data

Mock data is **enabled by default**. All authentication and data fetching will use mock implementations.

```typescript
// The application automatically uses mock services
import { authService } from '@/services';

// This will use mock auth (no real API calls)
const user = await authService.signIn({ email, password });
```

### Mock Users

Three test users are available:

| Email | Password | Role |
|-------|----------|------|
| `customer@test.com` | `123456` | Customer |
| `admin@test.com` | `123456` | EnterpriseAdmin |
| `superadmin@test.com` | `123456` | PlatformSuperAdmin |

### Features

- ✅ **Email validation** - Checks email format
- ✅ **Password validation** - Min 6 characters
- ✅ **Error handling** - Wrong password, user not found, etc.
- ✅ **API delay simulation** - 300-500ms latency
- ✅ **localStorage persistence** - Auth state persists across page refreshes
- ✅ **New user registration** - Create accounts with new emails

## 🔧 Configuration

### Enable/Disable Mock

Edit `src/mock/config.ts`:

```typescript
// Development mode - uses mock data
export const USE_MOCK = true;

// Production mode - uses real API
export const USE_MOCK = false;
```

### Adjust API Delay

```typescript
export const MOCK_API_DELAY = {
  MIN: 300,  // Minimum delay in ms
  MAX: 500,  // Maximum delay in ms
};
```

## 🔄 Switching to Real API

When your backend is ready, follow these steps:

### Step 1: Set Mock to False

```typescript
// src/mock/config.ts
export const USE_MOCK = false;
```

### Step 2: Implement Real Services

```typescript
// src/services/auth.service.ts
class RealAuthService implements IAuthService {
  async signIn(credentials: LoginCredentials): Promise<AuthUser> {
    // TODO: Implement real Firebase/API logic
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response.json();
  }
  
  // ... implement other methods
}
```

### Step 3: Test Thoroughly

Make sure all auth flows work with the real API:
- Sign in with existing account
- Sign up new account
- Get current user
- Update user profile

### Step 4: Remove Mock Code (Optional)

Once you're confident the real API works:

```bash
# Delete the entire mock folder
rm -rf src/mock/

# Update src/services/index.ts
# Remove mock imports and export real service directly
```

Update `src/services/index.ts`:

```typescript
// Remove these lines:
// import { USE_MOCK } from '@/mock/config';
// import { mockAuthService } from '@/mock/services';

// Keep only:
import { realAuthService } from './auth.service';
export const authService = realAuthService;
```

## 📝 Authentication Flow

### Sign In (Existing User)

```
1. User enters email on /auth/signin-or-signup
2. System checks if email exists
3. If exists → redirect to /auth/signin
4. User enters password
5. If correct → redirect to /console/welcome
6. User selects organization → redirect to /dashboard
```

### Sign Up (New User)

```
1. User enters email on /auth/signin-or-signup
2. System checks if email exists
3. If not exists → redirect to /auth/create-password
4. User creates password
5. Account created → redirect to /auth/check-email (shows for 2s)
6. After 2s → redirect to /auth/signin-or-signup (fresh start)
7. User enters email again → system detects email exists
8. Redirect to /auth/signin → user enters password
9. Redirect to /console/welcome
```

## 🗄️ Data Storage

All mock data uses localStorage with the `__MOCK__` prefix:

- `__MOCK__auth_user` - Current authenticated user
- `__MOCK__temp_email` - Temporary email during signup flow

To clear all mock data:

```typescript
import { clearAllMockData } from '@/mock/storage/auth-storage';
clearAllMockData();
```

Or manually in browser console:

```javascript
localStorage.removeItem('__MOCK__auth_user');
sessionStorage.removeItem('__MOCK__temp_email');
```

## 🎨 Adding New Mock Data

### Add New Mock Users

Edit `src/mock/data/mock-users.ts`:

```typescript
export const mockUsers: MockUserWithPassword[] = [
  // ... existing users
  {
    id: 'mock-user-4',
    email: 'newuser@test.com',
    password: '123456',
    displayName: 'New User',
    globalRole: UserGlobalRole.Customer,
    createdAt: new Date().toISOString(),
  },
];
```

### Add New Mock Service

1. Create interface in `src/services/[service-name].service.interface.ts`
2. Create mock implementation in `src/mock/services/[service-name].mock.service.ts`
3. Create real implementation in `src/services/[service-name].service.ts`
4. Export from `src/services/index.ts` with USE_MOCK condition

## ❓ FAQ

### Q: Why is my auth state not persisting?

**A:** Check that `saveMockAuth()` is being called after successful authentication. Also check browser localStorage for `__MOCK__auth_user`.

### Q: How do I test with different users?

**A:** Sign out (clear localStorage), then sign in with a different test account email.

### Q: Can I add more test users?

**A:** Yes! Edit `src/mock/data/mock-users.ts` and add more users to the array.

### Q: Does this work offline?

**A:** Yes! All mock data works completely offline since it's stored locally.

### Q: Will mock data interfere with real API?

**A:** No, mock data uses the `__MOCK__` prefix in localStorage. However, it's best to clear it when switching to real API.

## 🛠️ Troubleshooting

### Mock not working

1. Check `src/mock/config.ts` - ensure `USE_MOCK = true`
2. Check browser console for errors
3. Clear localStorage and try again

### TypeScript errors

1. Ensure mock service implements `IAuthService` interface
2. Run `npm run check` to validate types

### Navigation not working

1. Check TanStack Router routes are properly configured
2. Verify navigation state is being passed correctly
3. Check browser console for routing errors

## 📚 Related Files

- `src/services/index.ts` - Service selector (mock vs real)
- `src/hooks/use-auth.ts` - Auth hooks using TanStack Query
- `src/types/auth.types.ts` - Shared type definitions
- `src/lib/toast.ts` - Toast notifications for errors

## 🎯 Best Practices

1. **Never commit real credentials** - Mock data only!
2. **Keep mock and real services in sync** - Same interface, different implementation
3. **Use meaningful test data** - Makes debugging easier
4. **Document any mock limitations** - So team knows what's simulated
5. **Test both mock and real** - Ensure smooth transition

---

**Need help?** Check the implementation in `src/mock/services/auth.mock.service.ts` for reference.

