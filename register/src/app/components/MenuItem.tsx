'use client'

export default function MenuItem(props: {
  name: string; 
  price: number;
  addToOrder: any;
}) {
  // Necessary because we will have to use Greet as a component later.
  return (
    <div className='bg-zinc-900 p-4 rounded-2xl h-48 w-48 flex flex-col cursor-flex' onClick={()=> props.addToOrder({
      name: props.name,
      price: props.price
    })}>
      <h1 className='font-bold text-2xl'>{props.name}</h1>
      <h2 className="text-green-400 mt-auto text-4xl">${props.price}</h2>
    </div>
  );
}