import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '', email: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Adjust the URL if your backend registration path is different
            await api.post('/api/auth/register', formData);
            alert("Registration successful! Please login.");
            navigate('/login');
        } catch (error) {
            console.error("Registration failed", error);
            alert("Registration failed. Username might already be taken.");
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="text" placeholder="Username" required
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    style={{ padding: '10px' }}
                />
                <input 
                    type="email" placeholder="Email" required
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{ padding: '10px' }}
                />
                <input 
                    type="password" placeholder="Password" required
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    style={{ padding: '10px' }}
                />
                <button type="submit" style={{ padding: '10px', backgroundColor: '#2ecc71', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;