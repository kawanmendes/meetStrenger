import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

import { User } from '../constants/types';

import { apiService } from '../services/api';

import { wsService } from '../services/websocket';

// =========================
// TYPES
// =========================

interface AuthContextType {

    user: User | null;

    isAuthenticated: boolean;

    isLoading: boolean;

    login: (
        email: string,
        password: string
    ) => Promise<boolean>;

    register: (
        username: string,
        email: string,
        password: string
    ) => Promise<boolean>;

    logout: () => Promise<void>;
}

// =========================
// CONTEXT
// =========================

const AuthContext =
    createContext<AuthContextType | undefined>(
        undefined
    );

// =========================
// PROVIDER
// =========================

export function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {

    // =========================
    // STATES
    // =========================

    const [user, setUser] =
        useState<User | null>(null);

    const [isLoading, setIsLoading] =
        useState(true);

    // =========================
    // CHECK AUTH
    // =========================

    const checkAuthStatus =
        useCallback(async () => {

            console.log(
                '[AUTH] Checking auth status'
            );

            setIsLoading(true);

            try {

                // busca usuário autenticado
                const response =
                    await apiService.getProfile();

                console.log(
                    '[AUTH] User authenticated:',
                    response.user
                );

                setUser(response.user);

                // conecta websocket
                await wsService.connect();

            } catch (error) {

                console.error(
                    '[AUTH] Auth check failed:',
                    error
                );

                setUser(null);

                wsService.disconnect();

            } finally {

                setIsLoading(false);
            }

        }, []);

    // =========================
    // INITIAL CHECK
    // =========================

    useEffect(() => {

        checkAuthStatus();

    }, [checkAuthStatus]);

    // =========================
    // LOGIN
    // =========================

    const login = useCallback(
        async (
            email: string,
            password: string
        ): Promise<boolean> => {

            console.log(
                '[AUTH] Login started'
            );

            setIsLoading(true);

            try {

                const response =
                    await apiService.Login(
                        email,
                        password
                    );

                console.log(
                    '[AUTH] Login success:',
                    response.user
                );

                setUser(response.user);

                // conecta websocket APÓS login
                await wsService.connect();

                return true;

            } catch (error) {

                console.error(
                    '[AUTH] Login error:',
                    error
                );

                return false;

            } finally {

                setIsLoading(false);
            }
        },
        []
    );

    // =========================
    // REGISTER
    // =========================

    const register = useCallback(
        async (
            username: string,
            email: string,
            password: string
        ): Promise<boolean> => {

            console.log(
                '[AUTH] Register started'
            );

            setIsLoading(true);

            try {

                const response =
                    await apiService.Register(
                        username,
                        email,
                        password
                    );

                console.log(
                    '[AUTH] Register success:',
                    response.user
                );

                setUser(response.user);

                // conecta websocket
                await wsService.connect();

                return true;

            } catch (error) {

                console.error(
                    '[AUTH] Register error:',
                    error
                );

                return false;

            } finally {

                setIsLoading(false);
            }
        },
        []
    );

    // =========================
    // LOGOUT
    // =========================

    const logout = useCallback(
        async (): Promise<void> => {

            console.log(
                '[AUTH] Logout started'
            );

            setIsLoading(true);

            try {

                await apiService.Logout();

            } catch (error) {

                console.error(
                    '[AUTH] Logout API error:',
                    error
                );

            } finally {

                // limpa usuário
                setUser(null);

                // desconecta websocket
                wsService.disconnect();

                setIsLoading(false);

                console.log(
                    '[AUTH] Logout complete'
                );
            }
        },
        []
    );

    // =========================
    // MEMO VALUE
    // =========================

    const value = useMemo(
        () => ({
            user,

            isAuthenticated: !!user,

            isLoading,

            login,

            register,

            logout,
        }),
        [
            user,
            isLoading,
            login,
            register,
            logout,
        ]
    );

    // =========================
    // PROVIDER
    // =========================

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// =========================
// HOOK
// =========================

export function useAuth() {

    const context =
        useContext(AuthContext);

    if (!context) {

        throw new Error(
            'useAuth must be used within AuthProvider'
        );
    }

    return context;
}