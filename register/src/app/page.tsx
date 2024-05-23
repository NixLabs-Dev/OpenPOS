'use client'
import { invoke } from '@tauri-apps/api/tauri'

import { useEffect, useState } from 'react';
import {MenuItemType, MenuCategoryType, OrderItemType} from "./util/types/Menu"
import Modal from "./components/Modal"
import Image from 'next/image';

import { fetcher } from './util/fetcher';
import useSWR from 'swr';

import Menu from './components/Menu';
import { onlyUnique } from './util/sorterFunctions';

export default function Greet() {
  const [order, setOrder] = useState<OrderItemType[]>([]);
  const [category, setCategory] = useState(0); //also also yes
  const [orderTotal, setOrderTotal] = useState(0);

  const [backendAddress, setBackendAddress] = useState("");
  const [mealSize, setSize] = useState("");

  if(backendAddress == "") {
    setBackendAddress("localhost:6969")
  }

  // invoke("get_environment_variable", { name: "SERVER_IP" })
  // .then((hostIp) => {
  //   setBackendAddress(String(hostIp));
  // })
  // .catch(console.log);

  const { data, error, isLoading } = useSWR(`http://${backendAddress}/menu`, fetcher)

  const [quantity, setQuantity] = useState(0);

  const [modalIsOpen, setIsOpen] = useState(false);  

  const [currentItem, setCurrentItem] = useState<OrderItemType|null>();

  const getItemData = (id: string) => {
    // var item; 
    // data.forEach((category: MenuCategoryType) => {
    //   item = category.items.map((item: MenuItemType) => item.name == id)
    // })

    // return item;

    console.log(data)
  }

  const launchQuantityPicker = (item: string) => {
      //setCurrentItem(getItemData(item))
      setQuantity(1)
      setIsOpen(true);
  }

  const closeModal = () => {
    console.log(currentItem)
    addToOrder({
      name: currentItem?.name!,
      price: currentItem?.price!,
      defaultSize: currentItem?.defaultSize!,
      smallPrice: currentItem?.smallPrice!,
      mediumPrice: currentItem?.mediumPrice!,
      largePrice: currentItem?.largePrice!,
      side: currentItem?.side!
    }, quantity)
    resetQuantity()
    setCurrentItem(null)
    setIsOpen(false);
  }

  // Add item to order array
  const addToOrder = (item: MenuItemType, quantity: number) => {
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
        quantity: quantity
      })];
    } else {

      // Item exists
      let newItem = newOrder[itemIndex];
      newOrder.splice(itemIndex, 1);
      
      newItem.quantity = newItem.quantity+quantity;

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
      if(mealSize == "S") {
        total += item.smallPrice * item.quantity
        //I don't think the new variables are actually being set to anything.
      }
      else if(mealSize == "M") {
        total += item.mediumPrice * item.quantity
      }
      else if(mealSize == "L") {
        total += item.largePrice * item.quantity
      }
      else {
        total += item.price * item.quantity;
      }
    })
    setSize("")
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
  
  const placeOrder = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    };
    fetch(`http://${backendAddress}/placeorder`, requestOptions)
      setOrder([])
  }

  const increaseQuantity = (input: number) => {

    if(quantity == 1) {
      setQuantity(input)
    }
    else {
      var newQuantity = quantity + input
      if(newQuantity < 0){
        setQuantity(0);
      }
      else {
        setQuantity(newQuantity);
      }
    }
  }

  const resetQuantity = () => {
    setQuantity(0);
  }

  if (error) return <div className="h-screen flex flex-col items-center justify-center relative text-white font-bold text-5xl">
      <Image
        src="/favicon.ico"
        width={250}
        height={250}
        alt="A"
      />
    <div>OpenPOS failed to connect to {backendAddress}</div>
  </div>
  if (isLoading) return <div className="h-screen flex flex-col items-center justify-center relative text-white font-bold text-5xl">
    <Image
        src="/favicon.ico"
        width={250}
        height={250}
        alt="A"
    />
    <div>OpenPOS loading...</div>
  </div>

  return (
    <div>
      <Modal state={modalIsOpen} closeModal={closeModal}>
        <h1 className='text-xl'>Quantity of {currentItem?.name}</h1>
        <div className='flex grid grid-cols-4 place-items-center'>
          <h1></h1>
          <h1 className='text-4xl text-white font-bold p-2'>Count:</h1>
          <h1 className='text-4xl text-white font-bold p-2'>{quantity}</h1>
          <h1></h1>
        </div>
        <div className='flex gap-4 grid grid-cols-3 gap-4 place-items-center p-4'>
          <button className='text-4xl text-black font-bold p-2 bg-white rounded-2xl' onClick={()=>increaseQuantity(1)}>+1</button>
          <button className='text-4xl text-black font-bold p-2 bg-white rounded-2xl' onClick={()=>increaseQuantity(5)}>+5</button>
          <button className='text-4xl text-black font-bold p-2 bg-white rounded-2xl' onClick={()=>increaseQuantity(10)}>+10</button>
          <button className='text-4xl text-black font-bold p-2 bg-white rounded-2xl' onClick={()=>increaseQuantity(-1)}>-1</button>
          <button className='text-4xl text-black font-bold p-2 bg-white rounded-2xl' onClick={()=>increaseQuantity(-5)}>-5</button>
          <button className='text-4xl text-black font-bold p-2 bg-white rounded-2xl' onClick={()=>increaseQuantity(-10)}>-10</button>
        </div>
        <div className='flex gap-4 grid grid-cols-2 gap-4 place-items-center p-4'>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-2xl' onClick={()=>closeModal()}>Confirm</button>
          <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-2xl' onClick={()=>resetQuantity()}>Reset</button>
        </div>
      </Modal>

      <div className='flex flex-row z-0'>
        <div className="flex flex-col h-screen w-1/4 p-8" id="sidebar">
          <h1 className='text-4xl font-bold'>OpenPOS v0.1</h1>

          <div className='mt-12'>
            {order.map((keyName: OrderItemType) => {            
              return (
                <div key={keyName.name} onClick={() => removeItem(keyName)} className='text-2xl flex w-full'>
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

            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-2xl" onClick={()=>placeOrder()}>
                Place Order
              </button>

              {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-2xl" onClick={()=>openModal()}>
                Test
              </button> */}

          </div>
          </div>
        <div className="flex flex-col bg-zinc-800 h-screen w-3/4">
          <div className='w-full h-48 bg-zinc-800 p-6 flex flex-row'>
            <h1 className="text-2xl font-bold w-1/6">Item Customizations</h1>
            <div className='w-5/6'>
            </div>
          </div>
          <div className='w-full bg-zinc-800 flex flex-row overflow-hidden'>
            <div className='w-4/5 bg-zinc-600 p-6 flex flex-row gap-3 items-center text-right'>
              <h1 className="text-3xl font-bold">Categories</h1>
              {data.categories.map((category: MenuCategoryType, index: number) => (
                <button key={category.name} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded text-2xl w-35 " onClick={()=>setCategory(index)}>
                  {category.name}
                </button>
              ))}       
            </div>
            <div className='w-2/5 bg-zinc-500 p-6'>
              <h1 className="text-6xl font-bold text-center">{data.categories[category].prettyName}</h1>
            </div>
          </div>
          {/* <Menu category={data[category]} launchQuantityPicker={launchQuantityPicker}/> */}
          </div>
          <div className="absolute flex bg-zinc-800 flex-col w-1/7 p-8 gap-4 bottom-0 right-0" id="sidebar">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-2xl" onClick={()=>launchQuantityPicker("S")}>
              S
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-2xl" onClick={()=>setSize("M")}>
              M
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-2xl" onClick={()=>setSize("L")}>
              L
            </button>            
        </div>
      </div>
    </div>
  );
}