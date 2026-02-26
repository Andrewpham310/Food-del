import React, { useState} from 'react'
import './Add.css'
import {assets} from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const Add = ({url}) => {

  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData(data=>({...data, [name]:value}))
  }

  const onSubmitHandler =  async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', Number(data.price));
    formData.append('category', data.category);
    formData.append('image', image);

    const response = await axios.post(`${url}/api/food/add`, formData);
    if(response.data.success){
      setData({
        name: '',
        description: '',
        price: '',
        category: '',
      });
      setImage(false);
      toast.success(response.data.message);
    } else{
      toast.error(response.data.message);
    }
  }

  

  return (
    <div className='add'>
      <form onSubmit={onSubmitHandler} className='flex-col'>
        <div className='add-img-upload flex-col'>
          <p>Upload Image</p>
          <label htmlFor='image'>
            <img   src={ image ? URL.createObjectURL(image) : assets.upload_area} alt='upload' />
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type='file' id='image' hidden required/>
        </div>
        <div className='add-product-name flex-col'>
          <p>Food Name</p>
          <input onChange={onChangeHandler} value={data.name} name='name' type='text' placeholder='Food Name' required/>
        </div>
        <div className='add-product-description flex-col'>
          <p>Food Description</p>
          <textarea onChange={onChangeHandler} value={data.description} name='description' placeholder='Food Description' rows="6" required/>
        </div>
        <div className='add-product-price flex-col'>
          <p>Food Price</p>
          <input onChange={onChangeHandler} value={data.price} name='price' type='number' placeholder='Food Price' required/>
        </div>
        <div className='add-product-category flex-col'>
          <p>Food Category</p>
          <select onChange={onChangeHandler} value={data.category} name='category'  required>
            <option value=''>Select Category</option>
            <option value='Salad'>Salad</option>
            <option value='Rolls'>Rolls</option>
            <option value='Deserts'>Deserts</option>
            <option value='Sandwich'>Sandwich</option>
            <option value='Cake'>Cake</option>
            <option value='Pure Veg'>Pure Veg</option>
            <option value='Pasta'>Pasta</option>
            <option value='Noodles'>Noodles</option>
          </select>
        </div>
        <button type='submit'>Add Food</button>
      </form>
    </div>
  )
}

export default Add
