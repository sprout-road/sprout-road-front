import { useEffect, useState } from "react"
import { User } from "../types/user";
import { userApi } from "../services/userApi";

export const useUserInfo = () => {
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUserInfo = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const data = await userApi.getUserInfo();
            setUserInfo(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : "알 수 없는 오류가 발생하였습니다.");
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    return {
        userInfo,
        loading,
        error,
        refetch: fetchUserInfo
    };
};