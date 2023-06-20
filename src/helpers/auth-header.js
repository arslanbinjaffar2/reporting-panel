export function authHeader(method = 'POST') {
    let user =
        typeof window !== "undefined" && JSON.parse(localStorage.getItem('agent'));
    user = (user && true) ? user : {};

    if (user && user.access_token) {
        if (method === 'PUT' || method === 'DELETE')
            return { 'Authorization': 'Bearer ' + user.access_token, 'Accept': 'application/json', 'Content-Type': 'application/json' };
        else
            return { 'Authorization': 'Bearer ' + user.access_token, 'Accept': 'application/json', 'Content-Type': 'application/json' };
    } else {
        return {};
    }
}