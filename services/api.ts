import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_CONFIG } from "./config";

class ApiService {
    private baseUrl : string;

    constructor() {
        this.baseUrl = API_CONFIG.BASE_URL;
    }
    private async getAuthToken(): Promise<string | null> {
        return await AsyncStorage.getItem("authToken") ;
    }
    private async request<T>(
        endpoint: string,
        options : RequestInit = {}
    ): Promise<T> {
            const token = await this.getAuthToken();
            const config : RequestInit = {
                headers : {
                    'Content-Type' : 'application/json',
                    ...(token && { 'Authorization' : `Bearer ${token}` })
                },
                ...options,
            };

            const response = await fetch(`${this.baseUrl}${endpoint}`, config);
            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: "Network error" }));
                throw new Error(error.message || 'request failed');
            }
            return await response.json();
    }
    async Login(email: string, password: string) {
        const response = await this.request<{success : Boolean; data: {token: string; user: any}}>('auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        if(response.data?.token) {
            await AsyncStorage.setItem("authToken", response.data.token);
        }
        return response.data;
    }
    async Register(username : string, email: string, password: string) {
        const response = await this.request<{success : Boolean; data: {token: string; user: any}}>('auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });
        if(response.data?.token) {
            await AsyncStorage.setItem("authToken", response.data.token);
        }
        return response.data;
    }
    async Logout () {
        await this.request('auth/logout', {method: 'POST'});
        await AsyncStorage.removeItem("authToken");
    }
    async getProfile(){
        const response = await this.request<{success: Boolean; data: {user: any}}>('auth/profile',);
        return response.data;
    }

}
export const apiService = new ApiService