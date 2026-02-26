import React, {useState, useContext} from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext';

import axios from 'axios';

const LoginPopup = ({setShowLogin}) => {

    const {url, setToken, loadCartData} = useContext(StoreContext);

    const [currentState, setCurrentState] = useState('Login');

    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData(data=> ({...data, [name]:value}))
    }

    const onLogin = async (e) => {
        e.preventDefault();
        let newUrl = url;
        if (currentState == 'Login') {
            newUrl += '/api/user/login';
        } else {
            newUrl += '/api/user/register';
        } 
        const response = await axios.post(newUrl, data);
        
        if(response.data.success){
            const newToken = response.data.token;
            setToken(newToken);
            localStorage.setItem('token', newToken);
            await loadCartData(newToken);
            setShowLogin(false);
            alert(response.data.message);
        } else {
            alert('Invalid email or password');
        }
    }

    

  return (
    <div className='login-popup'>
        <form onSubmit={onLogin} className='login-popup-container'>
            <div className='login-popup-title'>
                <h2>{currentState}</h2>
                <img src={assets.cross_icon} alt='' onClick={() => setShowLogin(false)}/>
            </div>
            <div className='login-popup-inputs'>
                {currentState=='Sign up' && <input onChange={onChangeHandler} value={data.name} name='name' type='text' placeholder='User name' required />}
                
                <input onChange={onChangeHandler} value={data.email} name='email' type='email' placeholder='Email' required />
                <input onChange={onChangeHandler} value={data.password} name='password' type='password' placeholder='Password' required />
            </div>
            <button  type='submit'>{currentState=='Signup'?'Create account':'Login'}</button>
            <div className='login-popup-condition'>
                <input type='checkbox'  required/>
                <p>I agree to the Terms of Service and Privacy Policy</p>
            </div>
            {currentState=='Login' 
            ? 
            <p>Don't have an account? <span onClick={() => setCurrentState('Signup')}>Sign up</span></p>
            :
            <p>Already have an account? <span onClick={() => setCurrentState('Login')}>Log in</span></p>
            }
        </form>
    </div>
  )
}

export default LoginPopup