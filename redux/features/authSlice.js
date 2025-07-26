import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: null
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
            // const response = await fetch(BACKEND_URL + '/auth/logout', {
            //     method: 'POST',
            //     credentials: 'include',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            // })
            // const data = await response.json()
            // if (data.success === true) {
            //     setLocalstorage('authState', initialState)
            //     window.location.href = '/login';
            // }
            return initialState;
        },
        logIn: (state, action) => {
            if (action.payload.success === true) {
                setLocalstorage('authState', { value: action.payload.data });
                return {
                    value: action.payload.data
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