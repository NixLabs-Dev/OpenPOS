'use client'

import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri'
import {MenuCategoryType, MenuItemType} from "../util/types/Menu"
import MenuItem from "./MenuItem"


export default function Menu(props : {
  category: MenuCategoryType;
  launchQuantityPicker: any;
}) {
  // Necessary because we will have to use Greet as a component later.
  return (
    <div className='w-full bg-zinc-800 flex flex-wrap gap-6 p-4 overflow-y-auto'>
          {props.category.items.map((item: MenuItemType) => (
            <MenuItem  
              key={item.name}
              name={item.name}
              price={item.price}
              launchQuantityPicker={props.launchQuantityPicker}
            />
          ))}
    </div>
  );
}