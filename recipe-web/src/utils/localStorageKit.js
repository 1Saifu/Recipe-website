// localStorageKit.js
class LocalStorageKit {
    constructor(tokenKey) {
        this.STORAGE_TOKEN_KEY = tokenKey || 'DEFAULT_STORAGE_TOKEN_KEY';
    }

    setTokenInStorage(token) {
        try {
            localStorage.setItem(this.STORAGE_TOKEN_KEY, JSON.stringify(token));
        } catch (error) {
            console.error('Error storing token in localStorage:', error);
        }
    }

    getTokenFromStorage() {
        try {
            const token = localStorage.getItem(this.STORAGE_TOKEN_KEY);
            if (token) {
                return JSON.parse(token);
            }
        } catch (error) {
            console.error('Error retrieving token from localStorage:', error);
        }
    }

    deleteTokenFromStorage() {
        try {
            localStorage.removeItem(this.STORAGE_TOKEN_KEY);
        } catch (error) {
            console.error('Error deleting token from localStorage:', error);
        }
    }
}

export default LocalStorageKit;
