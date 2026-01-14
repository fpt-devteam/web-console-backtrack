/**
 * Service Selector
 * 
 * This file automatically selects between mock and real services
 * based on the USE_MOCK flag in src/mock/config.ts
 * 
 * HOW TO SWITCH TO REAL API:
 * 1. Set USE_MOCK = false in src/mock/config.ts
 * 2. Implement real services in respective files (e.g., auth.service.ts)
 * 3. Test thoroughly
 * 4. Remove src/mock/ folder
 * 5. Remove mock imports from this file
 * 6. Export real services directly: export { realAuthService as authService }
 */

import { USE_MOCK } from '@/mock/config';
import { mockAuthService } from '@/mock/services';
import { realAuthService } from './auth.service';

/**
 * Authentication Service
 * 
 * Automatically uses mock or real implementation based on USE_MOCK flag.
 * All code should import from here, not directly from mock or real services.
 * 
 * @example
 * import { authService } from '@/services';
 * 
 * // This will use mock or real service automatically
 * const user = await authService.signIn({ email, password });
 */
export const authService = USE_MOCK ? mockAuthService : realAuthService;

