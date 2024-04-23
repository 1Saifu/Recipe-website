// localStorageKit.js
class LocalStorageKit {
    constructor(tokenKey) {
        this.tokenKey = tokenKey || 'accessToken';
    }

    setTokenInStorage(token) {
        try {
            localStorage.setItem(this.tokenKey, token);
            console.log('Token stored successfully:', token);
        } catch (error) {
            console.error('Error storing token in localStorage:', error);
        }
    }

    getTokenFromStorage() {
        try {
            const token = localStorage.getItem(this.tokenKey);
            console.log('Token retrieved from localStorage:', token);
            return token;
        } catch (error) {
            console.error('Error retrieving token from localStorage:', error);
            return null;
        }
    }

    deleteTokenFromStorage() {
        try {
            localStorage.removeItem(this.tokenKey);
            console.log('Token deleted from localStorage');
        } catch (error) {
            console.error('Error deleting token from localStorage:', error);
        }
    }
}

export default LocalStorageKit;
