import {createContext, type ReactNode, use, useContext, useState} from "react";
import type {AxiosInstance} from "axios";
import axios from "axios";
import * as process from "node:process";
interface User{
    id:string,
    name:string,
    email:string,
    plan:string,
    analysisCount?:number;
}
interface AppContextType{
    user:User |null;
    token:string|null;
    loading: boolean;
    api:AxiosInstance;
    login:(email:string, password:string)=>Promise<{success:boolean,message:string}>;
    register:(email:string, password:string)=>Promise<{success:boolean,message:string}>;
    logout:()=>void;
}
const BACKEND_URL=import.meta.env.VITE_BACKEND_URL || "https://localhost:8000";



const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({children}:{children:ReactNode}){
    const[user, setUser]= useState<User|null>(null)
    const[token, setToken]=useStatek<String | null>(null);
    const[loading, setLoading]=useState<boolean>(false);

    const api = axios.create({

        baseURL:BACKEND_URL;
    })
api.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})
    const loadUser = async()=>{

    }
    const login =async ()=>{

    }
    const register = async ()=>{

    }
    const logout = async()=>{

    }

    const value = {user, token, loading, api, login, register, logout}


    const value = {};
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}
export function useApp(){
    const context = useContext(AppContext);
    if(!context){
        throw new Error("useApp must be used within an AppProvider");

    }
}