export type MenuItemType = {
    name: string;
    price: number;
}

export type MenuCategoryType = {
    name: string;
    items: MenuItemType[]
}

export type OrderItemType = {
    name: string
    quantity: number;
    price: number;
}