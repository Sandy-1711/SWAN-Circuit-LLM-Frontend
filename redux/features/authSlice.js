import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: null,
    loggedIn: false
}
const getLocalStorage = (name) => {
    if (typeof window !== 'undefined') {
        return JSON.parse(window.localStorage.getItem(name));
    }
    return null;
};
const setLocalstorage = (name, value) => {
    window.localStorage.setItem(name, JSON.stringify(value));
};

export const auth = createSlice({
    name: "auth",
    initialState: typeof window !== 'undefined' ? getLocalStorage('authState') || initialState : initialState,
    reducers: {
        logOut: async () => {
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL_DOMAIN + '/auth/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const data = await response.json()
            setLocalstorage('authState', initialState)
            // window.location.href = '/login';
            return initialState;
        },
        logIn: (state, action) => {
            if (action.payload) {
                setLocalstorage('authState', { value: action.payload, loggedIn: true });
                return {
                    value: { ...action.payload },
                    loggedIn: true,
                }
            }
            else {
                return initialState
            }
        },

    },
});

export const { logIn, logOut } = auth.actions;
export default auth.reducer;