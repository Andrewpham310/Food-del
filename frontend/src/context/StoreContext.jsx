import { createContext } from "react";
import { useState, useEffect } from "react";
import axios from 'axios';




export const StoreContext = createContext();

const StoreProvider = (props) => {

    const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cartItems')) || {});

    const url = import.meta.env.VITE_API_URL || 'https://food-del-backend-z4k7.onrender.com';

    const [token, setToken] = useState('');

    const [foodList, setFoodList] = useState([]);

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        if(token) {
            await axios.post(`${url}/api/cart/add`, {itemId}, {headers: {token}})
            .then(response => {
                if(response.data.success) {
                    alert(response.data.message);
                }
            })
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        if (token) {
            await axios.post(url + '/api/cart/remove', {itemId}, {headers: {token}})
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = foodList.find((product) => product._id === item);
                if(itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(`${url}/api/food/list`);
        setFoodList(response.data.data);
    }

    const loadCartData  = async (token) => {
        const response = await axios.post(url + '/api/cart/get',{}, {headers: {token}})
        const cartData = response.data.cartData || {};
        setCartItems(cartData);
        localStorage.setItem('cartItems', JSON.stringify(cartData));
    }

    //update token, after page refresh keep the token in the context
    useEffect(() => {

        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem('token')) {
                setToken(localStorage.getItem('token'));
                await loadCartData(localStorage.getItem('token'));
            }
        }
        loadData()
    }, []);

    const contextValue = {
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        foodList,
        setFoodList,
        fetchFoodList,
        loadCartData,
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreProvider;
