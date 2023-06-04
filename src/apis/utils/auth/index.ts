export const getAccessToken = () => {
    return localStorage.getItem('accessToken');
}

export const saveAccessToken = (accessToken: string) => {
    localStorage.setItem('accessToken', accessToken);
}

export const isAuthorized = () => {
    return !!getAccessToken();
}

export const deleteAccessToken = () => {
    localStorage.removeItem('accessToken');
}
