// Token utilities for authentication management
export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;
  
  try {
    // Decode JWT token to check expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000; // Convert to seconds
    
    // Check if token has expired (exp is in seconds)
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // Treat invalid tokens as expired
  }
};

export const getTokenExpirationTime = (token: string): number | null => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // Convert to milliseconds
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const getTimeUntilExpiration = (token: string): number => {
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) return 0;
  
  return Math.max(0, expirationTime - Date.now());
};
