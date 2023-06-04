import React, {
    createContext, Dispatch,
    useContext, useEffect,
    useReducer,

} from "react";

type Action = { type: "SET_TOKEN"; token: string | null; };

type State = { accessToken: string | null; }

type AppDispatch = Dispatch<Action>;

const initialState: State = {
    accessToken: null,
}

const stateName = 'tokenState';
const TokenStateContext = createContext<State | null>(null);
const TokenDispatchContext = createContext<AppDispatch | null>(null);

const TokenReducer = (state: State, action: Action) => {
    switch (action.type) {
        case "SET_TOKEN":
            return {
                ...state,
                accessToken: action.token
            };
        default:
            throw new Error("Unhandled action");
    }
};

export function TokenProvider({children}: { children: React.ReactNode }) {

    const [state, dispatch] = useReducer(TokenReducer, initialState);

    useEffect(() => {
        // 로컬 스토리지에서 상태 값 불러오기
        const storedState = localStorage.getItem(stateName);
        if (storedState) {
            setToken(dispatch, JSON.parse(storedState).accessToken);
        }
    }, []);

    useEffect(() => {
        // 상태 값 로컬 스토리지에 저장하기
        localStorage.setItem(stateName, JSON.stringify(state));
    }, [state]);


    return (
        <TokenStateContext.Provider value={state}>
            <TokenDispatchContext.Provider value={dispatch}>
                {children}
            </TokenDispatchContext.Provider>
        </TokenStateContext.Provider>
    );
}

export function useTokenState() {
    const state = useContext(TokenStateContext);
    if (!state) {
        throw new Error("Connot find TokenStateProvider");
    }
    return state;
}

export function useTokenDispatch() {
    const dispatch = useContext(TokenDispatchContext);
    if (!dispatch) {
        throw new Error("Cannot find DispatchProvider");
    }
    return dispatch;
}

export const setToken = (dispatch: AppDispatch, token: string) => {
    dispatch({type: "SET_TOKEN", token});
}

export const getTokenFromLocalStorage = () => {
    const tokenState = localStorage.getItem(stateName);
    if (tokenState) {
        return JSON.parse(tokenState).accessToken;
    }
    return null;
}

export const removeTokenFromLocalStorage = () => {
    localStorage.removeItem(stateName);
}
