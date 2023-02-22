export function getCredentials() {
    let user_id = localStorage.getItem('userId');
    let token = localStorage.getItem('token');
    return {user_id ,token};
}