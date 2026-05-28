import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

import axios, { type AxiosInstance } from "axios";

interface User {
    id: string;
    name: string;
    email: string;
    plan: string;
    analysisCount?: number;
}

interface AuthResponse {
    success: boolean;
    message?: string;
}

interface AppContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    api: AxiosInstance;

    login: (
        email: string,
        password: string
    ) => Promise<AuthResponse>;

    register: (
        name: string,
        email: string,
        password: string
    ) => Promise<AuthResponse>;

    logout: () => void;
}

const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const AppContext = createContext<AppContextType | undefined>(
    undefined
);

export function AppProvider({
                                children,
                            }: {
    children: ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);

    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );

    const [loading, setLoading] = useState<boolean>(true);

    const api = axios.create({
        baseURL: BACKEND_URL,
    });

    // Attach token automatically
    api.interceptors.request.use((config) => {
        const storedToken = localStorage.getItem("token");

        if (storedToken) {
            config.headers.Authorization = `Bearer ${storedToken}`;
        }

        return config;
    });

    // Load current user
    const loadUser = async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const { data } = await api.get("/api/auth/user");

            if (data.success) {
                setUser(data.user);
            }
        } catch (error) {
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, [token]);

    // LOGIN
    const login = async (
        email: string,
        password: string
    ): Promise<AuthResponse> => {
        try {
            const res = await api.post("/api/auth/login", {
                email,
                password,
            });

            if (res.data.success) {
                setToken(res.data.token);

                setUser(res.data.user);

                localStorage.setItem("token", res.data.token);

                return {
                    success: true,
                };
            }

            return {
                success: false,
                message: res.data.message,
            };
        } catch (error: any) {
            return {
                success: false,
                message:
                    error.response?.data?.message || "Login failed",
            };
        }
    };

    // REGISTER
    const register = async (
        name: string,
        email: string,
        password: string
    ): Promise<AuthResponse> => {
        try {
            const res = await api.post("/api/auth/register", {
                name,
                email,
                password,
            });

            if (res.data.success) {
                setToken(res.data.token);

                setUser(res.data.user);

                localStorage.setItem("token", res.data.token);

                return {
                    success: true,
                };
            }

            return {
                success: false,
                message: res.data.message,
            };
        } catch (error: any) {
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Registration failed",
            };
        }
    };

    // LOGOUT
    const logout = () => {
        setToken(null);
        setUser(null);

        localStorage.removeItem("token");
    };

    const value: AppContextType = {
        user,
        token,
        loading,
        api,
        login,
        register,
        logout,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

// Custom Hook
export function useApp() {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error(
            "useApp must be used within an AppProvider"
        );
    }

    return context;
}