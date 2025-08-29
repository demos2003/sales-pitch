# Authentication System Documentation

## Overview

This authentication system provides comprehensive token management with automatic logout on token expiration and idle timeout functionality.

## Features

### 1. Token Expiration Checking
- **Automatic Detection**: JWT tokens are automatically checked for expiration before API requests
- **Proactive Validation**: Tokens are validated client-side to prevent unnecessary API calls
- **Server Response Handling**: 401 responses automatically trigger logout and redirect

### 2. Idle Timeout Management
- **Configurable Timeout**: Default 10 minutes of inactivity before logout
- **Activity Tracking**: Monitors mouse movements, clicks, keyboard input, scrolling, and touch events
- **Warning System**: Shows warning 1 minute before automatic logout
- **Reset on Activity**: Any user activity resets the idle timer

### 3. User Experience Features
- **Session Status Display**: Shows remaining session time in the header
- **Toast Notifications**: Clear feedback for session expiration, idle timeout, and warnings
- **Automatic Redirects**: Seamless redirect to login page when session ends
- **Manual Logout**: Users can manually logout at any time

## Implementation

### Core Components

#### 1. Token Utilities (`utils/auth.ts`)
```typescript
// Check if token is expired
isTokenExpired(token: string): boolean

// Get token expiration time
getTokenExpirationTime(token: string): number | null

// Get time until expiration
getTimeUntilExpiration(token: string): number
```

#### 2. Auth Manager Hook (`hooks/useAuthManager.ts`)
```typescript
const { handleLogout, resetIdleTimer, isTokenExpired, timeUntilExpiration } = useAuthManager({
  idleTimeoutMinutes: 10,        // Minutes of inactivity before logout
  checkIntervalMs: 60000,        // Token check interval (1 minute)
  showWarningBeforeLogout: true, // Show warning before logout
  warningTimeMs: 60000,          // Warning time (1 minute)
});
```

#### 3. Auth Layout Component (`components/auth-layout.tsx`)
Wraps protected routes and automatically handles authentication state.

#### 4. Session Status Component (`components/session-status.tsx`)
Displays current session status with countdown timer.

### Configuration Options

#### Auth Manager Options
```typescript
interface UseAuthManagerOptions {
  idleTimeoutMinutes?: number;     // Default: 10 minutes
  checkIntervalMs?: number;        // Default: 60000ms (1 minute)
  showWarningBeforeLogout?: boolean; // Default: true
  warningTimeMs?: number;          // Default: 60000ms (1 minute)
}
```

#### Activity Events Tracked
- `mousedown` - Mouse button press
- `mousemove` - Mouse movement
- `keypress` - Keyboard input
- `scroll` - Page scrolling
- `touchstart` - Touch screen interaction
- `click` - Click events

## Usage Examples

### Basic Setup (Already Implemented)
The authentication system is automatically active in all protected routes through the layout wrapper.

### Custom Timeout Configuration
```typescript
// In a specific component that needs different timeout settings
const { handleLogout } = useAuthManager({
  idleTimeoutMinutes: 30, // 30 minutes instead of default 10
  showWarningBeforeLogout: false, // No warning
});
```

### Manual Session Management
```typescript
import { useAuthManager } from '@/hooks/useAuthManager';

function MyComponent() {
  const { handleLogout, resetIdleTimer } = useAuthManager();

  const handleUserAction = () => {
    // Manually reset idle timer on specific actions
    resetIdleTimer();
  };

  const handleManualLogout = () => {
    // Manual logout with custom reason
    handleLogout('manual');
  };
}
```

### Session Status Display
```typescript
import SessionStatus from '@/components/session-status';

// Simple inline display
<SessionStatus />

// Card format
<SessionStatus showCard={true} />

// Custom styling
<SessionStatus className="my-custom-class" />
```

## API Integration

### Token Refresh (Optional)
If your backend supports token refresh, you can use the refresh endpoint:

```typescript
import { useRefreshTokenMutation } from '@/api/features/auth/authApiSlice';

const [refreshToken] = useRefreshTokenMutation();

// Refresh token before expiration
const handleRefresh = async () => {
  try {
    const result = await refreshToken().unwrap();
    // Token will be automatically updated in the store
  } catch (error) {
    // Handle refresh failure
    handleLogout('expired');
  }
};
```

### Backend Requirements
Your backend should:
1. Return JWT tokens with `exp` claim
2. Return 401 status for expired/invalid tokens
3. Optionally provide a refresh token endpoint

## Security Considerations

### Client-Side Security
- Tokens are stored in localStorage (consider httpOnly cookies for production)
- Automatic cleanup on logout
- No sensitive data in JWT payload

### Server-Side Security
- Validate tokens on every protected endpoint
- Use short token expiration times (recommended: 1-4 hours)
- Implement proper CORS policies
- Use HTTPS in production

## Troubleshooting

### Common Issues

#### 1. Token Not Being Checked
- Ensure the component is wrapped in AuthLayout
- Check that the token exists in localStorage
- Verify JWT token format is valid

#### 2. Idle Timer Not Working
- Check that activity events are being registered
- Ensure the component is mounted and active
- Verify no JavaScript errors are preventing event listeners

#### 3. Session Status Not Updating
- Check that the token exists and is valid
- Ensure the component is re-rendering
- Verify the token has a valid `exp` claim

### Debug Mode
Add console logs to track authentication state:

```typescript
// In useAuthManager hook
console.log('Token status:', { isTokenExpired, timeUntilExpiration });
console.log('Activity detected:', new Date());
```

## Best Practices

1. **Token Expiration**: Use reasonable expiration times (1-4 hours)
2. **Activity Tracking**: Don't set idle timeout too short (minimum 5 minutes)
3. **User Feedback**: Always provide clear feedback for session changes
4. **Graceful Degradation**: Handle network errors gracefully
5. **Testing**: Test with expired tokens and network failures

## Future Enhancements

Potential improvements:
- Remember me functionality
- Multiple device session management
- Session activity logging
- Biometric authentication support
- Progressive Web App offline support
