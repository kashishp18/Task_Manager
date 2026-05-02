import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // We tell TypeScript what the response looks like
            const { data } = await API.post<{ token: string; user: any }>('/auth/login', { email, password });
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            alert("Login Successful! 🎉");
            navigate('/dashboard');
        } catch (err: any) {
            alert(err.response?.data?.message || "Login Failed");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <form onSubmit={handleLogin} className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <h2 className="mb-6 text-2xl font-bold text-gray-800 text-center">Ethara AI Login</h2>
                <div className="space-y-4">
                    <input 
                        type="email" placeholder="Email" required
                        className="w-full rounded border p-2 outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                        type="password" placeholder="Password" required
                        className="w-full rounded border p-2 outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="w-full rounded bg-blue-600 py-2 font-bold text-white hover:bg-blue-700 transition">
                        Sign In
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;