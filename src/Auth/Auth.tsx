const STORAGE_KEYS = {
    TOKEN: 'token',
    CREDENTIALS: 'credentials',
  };
  
  export const logout = (navigate: any) => {
    sessionStorage.clear();
    navigate("/login");
  };
  
  export const isLoggedIn = () => {
    const token = sessionStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) {
      return false;
    }
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiration = payload.exp * 1000;
    if (expiration < Date.now()) {
      sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
      return false;
    }
    
    return true;
  };
  
  export const getToken = () => {
    return sessionStorage.getItem(STORAGE_KEYS.TOKEN);
  };
  
  export const storeToken = (token: string) => {
    sessionStorage.setItem(STORAGE_KEYS.TOKEN, token);
  };
  