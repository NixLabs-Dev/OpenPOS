'use client'

export default function MenuItem(props: {
  name: string; 
  price: number;
  launchQuantityPicker: any;
  defaultSize: string;
  smallPrice:  number;
  mediumPrice: number;
  largePrice:  number;
  side: string;
}) {
  // Necessary because we will have to use Greet as a component later.
  return (
    // TODO: Add ID for each menu item in the backend. Pass this ID down to this component and launch the quantity picker with that item ID to get props.
    // DO NOT SEND PROPS DOWN ALL COMPONENTS OR YOU ENTER MEMORY HELL
    // DO NOT SEND PROPS DOWN ALL COMPONENTS OR YOU ENTER MEMORY HELL
    // DO NOT SEND PROPS DOWN ALL COMPONENTS OR YOU ENTER MEMORY HELL
    // DO NOT SEND PROPS DOWN ALL COMPONENTS OR YOU ENTER MEMORY HELL
    // DO NOT SEND PROPS DOWN ALL COMPONENTS OR YOU ENTER MEMORY HELL
    // DO NOT SEND PROPS DOWN ALL COMPONENTS OR YOU ENTER MEMORY HELL
    // DO NOT SEND PROPS DOWN ALL COMPONENTS OR YOU ENTER MEMORY HELL
    // DO NOT SEND PROPS DOWN ALL COMPONENTS OR YOU ENTER MEMORY HELL
    // DO NOT SEND PROPS DOWN ALL COMPONENTS OR YOU ENTER MEMORY HELL
    <div className='bg-zinc-900 p-4 rounded-2xl h-44 w-44 flex flex-col cursor-flex' onClick={()=> props.launchQuantityPicker(props.name)}>
      <h1 className='font-bold text-2xl'>{props.name}</h1>
      <h2 className="text-green-400 mt-auto text-4xl">${props.price}</h2>
    </div>
  );
}