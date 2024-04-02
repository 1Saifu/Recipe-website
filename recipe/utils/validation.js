function validateData(data) {
    if(data && typeof data === 'object') {
        if(data.username && typeof data.username === 'string' && data.username.trim() !== '' && 
        data.email && typeof data.email === 'string' && data.email.trim() !== '' && 
        data.password && typeof data.password === 'string' && data.password.trim() !== '') {
        return true;
        }
    }
    return false;
}

module.exports = { validateData };