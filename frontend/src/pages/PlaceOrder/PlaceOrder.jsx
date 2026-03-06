import React, { useContext, useState, useEffect } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import dotenv from 'dotenv';
dotenv.config();

const PlaceOrder = () => {
  const { getTotalCartAmount, token, foodList, cartItems } = useContext(StoreContext);
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  })
  const url = process.env.API_URL;

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData(data=>({...data, [name]:value}))
  }

  const placeOrder = async (e) => {
    e.preventDefault();
    let orderItems = [];
    foodList.map((item)=> {
      if(cartItems[item._id]) {
       let itemInfo = item;
       itemInfo['quantity'] = cartItems[item._id];
       orderItems.push(itemInfo);
      }
    })
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,

    }
    let response = await axios.post(url + '/api/order/place', orderData,{headers: {token}});
    if(response.data.success){
      const {session_url} = response.data;
      window.location.replace(session_url);
    } else {
      alert("Error placing order");
    }
  }  
 
  const navigate = useNavigate();

  useEffect(() => {
    if(!token) {
      navigate('/cart');
    }
    else if (getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  },[token])

  return (
    <form className='place-order' onSubmit={placeOrder}>
      <div className='place-order-left'>
        <p className='title'>Delivery Information</p>
        <div className='multi-fields'>
          <input required onChange={onChangeHandler} value={data.firstName} name='firstName' type='text' placeholder='First Name' />
          <input required onChange={onChangeHandler} value={data.lastName} name='lastName' type='text' placeholder='Last Name' />

        </div>
        <input required onChange={onChangeHandler} value={data.email} name='email' type='text' placeholder='Email Address' />
        <input required onChange={onChangeHandler} value={data.street} name='street' type='text' placeholder='Address' />
        <div className='multi-fields'>
          <input required onChange={onChangeHandler} value={data.city} name='city' type='text' placeholder='City' />
          <input required onChange={onChangeHandler} value={data.state} name='state' type='text' placeholder='Province' />
        </div>
        <div className='multi-fields'>
          <input required onChange={onChangeHandler} value={data.zipcode} name='zipcode' type='text' placeholder='Zip Code' />
          <input required onChange={onChangeHandler} value={data.country} name='country' type='text' placeholder='Country' />

        </div>
        <input required  onChange={onChangeHandler} value={data.phone} name='phone' type='text' placeholder='Phone Number' />
      </div>

      <div className='place-order-right'>
        <div className='cart-total'>
          <h2>Cart Total</h2>
          <div>
            <div className='cart-total-details'>
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className='cart-total-details'>
              <p>Delivery Fee</p>
              <p>${2}</p>
            </div>
            <hr />
            <div className='cart-total-details'>
              <p>Total</p>
              <p>${getTotalCartAmount() + 2}</p>
            </div>
          </div>
          <button className='cart-checkout' type='submit'>Pay Now</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder