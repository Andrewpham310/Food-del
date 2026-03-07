import React, { useState, useEffect } from 'react'
import './List.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const List = ({url}) => {

const [list, setList] = useState([]);

const fetchList = async () => {
  const response = await axios.get(`${url}/api/food/list`);
  console.log(response.data);
  if(response.data.success){
    setList(response.data.data);
  } else{
    toast.error(response.data.message);
  }
}

const handleRemove = async (id) => {
  const response = await axios.post(`${url}/api/food/remove`, {id: id});
  if(response.data.success) {
    toast.success(response.data.message);
    await fetchList();
  } else {
    toast.error(response.data.message);
  }
}

useEffect(() => {
  fetchList();
}, []);

  return (
    <div className='list add flex-col'>
      <p>All Food Items</p>
      <div className='list-table'>
        <div className='list-table-format title'>
          <b>Name</b>
          <b>Description</b>
          <b>Price</b>
          <b>Category</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div className='list-table-format' key={index}>
              <img src={`${url}/uploads/${item.image}`} alt='Food' />
              <p>{item.name}</p>
              <p>{item.description}</p>
              <p>${item.price}</p>
              <p onClick={() => handleRemove(item._id)} className='cross'>X</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default List