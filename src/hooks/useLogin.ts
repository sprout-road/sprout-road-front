import { useState } from "react"
import { userApi } from "../services/userApi";

export const useLogin = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const login = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await userApi.loginUser()
            return result;
        } catch(error) {
            const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생하였습니다.";
            setError(errorMessage)
            throw error; 
        } finally {
            setLoading(false);
        }
    };

    return {
        login,
        loading,
        error,
    };
};