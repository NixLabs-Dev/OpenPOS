'use client'

import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri'
import {MenuItemType, MenuCategoryType, OrderItemType} from "./util/types/Menu"

import { fetcher } from './util/fetcher';
import useSWR from 'swr';

import Menu from './components/Menu';
import { onlyUnique } from './util/sorterFunctions';

export default function Greet() {
  const [order, setOrder] = useState<OrderItemType[]>([]);
  const [category, setCategory] = useState(0);
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const { data, error, isLoading } = useSWR('http://localhost:8080/menu', fetcher)

  
  // Add item to order array
  const addToOrder = (item: MenuItemType) => {
    let newOrder: OrderItemType[] = order

    let itemIndex: number | null = null;

    newOrder.map((orderItem: OrderItemType, index: number) => {
      if (orderItem.name == item.name) {
        itemIndex = index;
      }
      return
    })

    if (itemIndex === null) {
      // Item doesnt exist
      newOrder = [...newOrder, ({
        ...item,
        quantity: 1
      })];
    } else {

      // Item exists
      let newItem = newOrder[itemIndex];
      newOrder.splice(itemIndex, 1);
      
      newItem.quantity++;
      newOrder = [...newOrder, newItem];
    }

    newOrder.sort((a, b) => {
      const nameA = a.name.toUpperCase(); // ignore upper and lowercase
      const nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
  
      // names must be equal
      return 0;
    });
  

    setOrder(newOrder)
  }


  // Set final calculated price
  useEffect(() => {
    let total = 0;
    order.map((item: OrderItemType, i: number) => {
      total += item.price * item.quantity;
    })
    setOrderTotal(Math.ceil((total*1.098) * 100) / 100)
  }, [order]) 


  const removeItem = (item: MenuItemType) => {
    let newOrder: OrderItemType[] = order

    let itemIndex: number = 0;

    newOrder.map((orderItem: OrderItemType, index: number) => {
      if (orderItem.name == item.name) {
        itemIndex = index;
      }
      return
    })

    // Item exists
    let newItem = newOrder[itemIndex];
    newOrder.splice(itemIndex, 1);

    if((newItem.quantity-1) <= 0){
      // Delete item because it is dead.
      setOrder(order.filter((item, index) => { 
        return item.name !== newItem.name
      }))  
    }else{
      // Item quantity not less than 1
      newItem.quantity--

      newOrder = [...newOrder, newItem];

      newOrder.sort((a, b) => {
        const nameA = a.name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
    
        // names must be equal
        return 0;
      });
    
  
      setOrder(newOrder)
    }
  };
  


  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>

  return (
    <div className='flex flex-row'>
      <div className="flex flex-col h-screen w-1/4 p-8" id="sidebar">
        <h1 className='text-4xl font-bold'>OpenPOS v0.1</h1>

        <div className='mt-12'>
          {order.map((keyName: OrderItemType) => {            
            return (
              <div onClick={() => removeItem(keyName)} className='text-2xl flex w-full'>
                <h1 className="text-white cursor-pointer mr-auto text-3xl">{keyName.name}</h1>
                <h1 className="text-white cursor-pointer ml-auto">{keyName.quantity}</h1>
              </div>
            )
          })}
        </div>

      <div className=' mt-auto flex flex-col gap-4'>
        <div className='flex flex-row items-center'>
          <button className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xl" onClick={()=>setOrder([])}>
            Clear Order
          </button>
          <h1 className='text-2xl ml-auto'>Total: <span className='font-bold'>${orderTotal}</span></h1>
        </div>

        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-2xl" onClick={()=>setOrder([])}>
            Place Order
          </button>
      </div>
      </div>
      <div className="flex flex-col bg-zinc-800 h-screen w-3/4">
        <div className='w-full h-48 bg-zinc-800 p-6 flex flex-row'>
          <h1 className="text-2xl font-bold w-1/6">Item Customizations</h1>
          <div className='w-5/6'>
            
          </div>
        </div>
        <div className='w-full bg-zinc-800 flex flex-row'>
          <div className='w-3/5 bg-zinc-600 p-6 flex flex-row gap-6 items-center'>
            <h1 className="text-3xl font-bold">Categories</h1>
            {data.map((category: MenuCategoryType, index: number) => (
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-2xl" onClick={()=>setCategory(index)}>
                {category.name}
              </button>
            ))}       
          </div>
          <div className='w-2/5 bg-zinc-500 p-6'>
            <h1 className="text-6xl font-bold">{data[category].name}</h1>
          </div>
        </div>

        <Menu category={data[category]} addToOrder={addToOrder}/>
      </div>
    </div>
  );
}