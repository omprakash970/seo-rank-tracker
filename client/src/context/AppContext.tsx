import {createContext, type ReactNode, use, useState} from "react";
import type {AxiosInstance} from "axios";
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

    const api = axios

    const value = {};
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>



}