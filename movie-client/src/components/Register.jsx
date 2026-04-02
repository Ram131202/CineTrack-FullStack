import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '', email: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Updated to match /api/users/register without double-prefixing
            const response = await api.post('users/register', formData); 
            console.log(response.data);
            alert("Registration Successful!");
            navigate('/login'); // Redirect to login after success
        } catch (error) {
            // Log the specific response for debugging
            console.error("Registration error:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Registration failed. User may already exist."); 
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