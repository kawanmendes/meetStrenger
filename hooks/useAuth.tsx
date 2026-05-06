import React, {createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState}from "react";
import { User } from "../constants/types";
import { apiService } from "../services/api";
import { wsService } from "../services/websocket";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (username: string, email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({children}: {children: ReactNode}) {
    const [user,setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuthStatus = useCallback(async () => {
        setIsLoading(true);
        try{
            const response = await apiService.getProfile();
            setUser(response.user);
            await wsService.connect().catch(() => undefined);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(()=> {
        checkAuthStatus();
    }, [checkAuthStatus])

    const login = useCallback(async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            const response = await apiService.Login(email, password);
            setUser(response.user);
            await wsService.connect().catch(() => undefined);
            return true;
        } catch (error) {
            console.error( error);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const register = useCallback(async (username: string, email: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            const response = await apiService.Register(username, email, password);
            setUser(response.user);
            await wsService.connect().catch(() => undefined);
            return true;
        } catch (error) {
            console.error( error);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setIsLoading(true);
        try {
            await apiService.Logout();
            await wsService.disconnected();
        } catch (error) {
            console.error("Error logging out:", error);
        } finally {
            setUser(null);
            setIsLoading(false);
        }
    }, []);

    const value = useMemo(() => ({
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout
    }), [user, isLoading, login, register, logout]);
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
