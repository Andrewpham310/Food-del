import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import {StoreContext} from '../../context/StoreContext'

const FoodItem = ({id, name, image, price, description}) => {

    const {addToCart, removeFromCart, cartItems, url} = useContext(StoreContext);

  return (
    <div className='food-item'>
        <div className='food-item-img-container'>
            <img src={`${url}/uploads/${image}`} alt='' className='food-item-image' />
            {
                !cartItems[id] 
                ?<img className='add' src={assets.add_icon_white} alt='Add' onClick={() => addToCart(id)}/>
                :<div className='food-item-counter'>
                    <img src={assets.remove_icon_red} alt='Remove'  onClick={() => removeFromCart(id)}/>
                    <p>{cartItems[id]}</p>
                    <img src={assets.add_icon_green} alt='Add'  onClick={() => addToCart(id)}/>
                </div>
            }
        </div>
        <div className='food-item-info'>
            <div className='food-item-name-rating'>
                <p>{name}</p>
                <img src={assets.rating_starts} alt='' />
            </div>
            <p className='food-item-desc'>
                {description}
            </p>
            <p className='food-item-price'>$ {price}</p>
        </div>
    </div>
  )
}

export default FoodItem