import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category }) => {

    const {foodList} = useContext(StoreContext)

  return (
    <div className='food-display' id='food-display'>
        <h2>Top dishes for you</h2>
        <div className='food-display-list'>
            {foodList.map((item, index) => {
                if(category === 'All' || item.category === category) {
                    return <FoodItem key={index} id={item._id} name={item.name} image={item.image} price={item.price} description={item.description} />
                }
                
            })}
        </div>
    </div>
  )
}

export default FoodDisplay