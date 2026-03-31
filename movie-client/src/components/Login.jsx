import { useState } from 'react';
import api from '../api/axios';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/users/login', credentials);
            // Save the token and username to the browser
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);
            setMessage('Login Successful!');
            window.location.reload(); // Refresh to update the UI
        } catch (error) {
            setMessage('Invalid Credentials');
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', width: '300px' }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input type="text" name="username" placeholder="Username" onChange={handleChange} required /><br/><br/>
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required /><br/><br/>
                <button type="submit">Login</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default Login;