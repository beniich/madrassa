import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/useUserStore';
import { MockUser } from '@/lib/mockData';

export default function TestLogin() {
    const navigate = useNavigate();
    const { setUser, setLoading } = useUserStore();

    useEffect(() => {
        // Create a mock user
        const mockUser: MockUser = {
            id: 'test-user-1',
            email: 'test@example.com',
            aud: '',
            role: 'authenticated',
            // add other required fields if any
        } as any;
        setUser(mockUser);
        setLoading(false);
        // After login, redirect to dashboard
        navigate('/dashboard');
    }, [navigate, setUser, setLoading]);

    return null;
}
