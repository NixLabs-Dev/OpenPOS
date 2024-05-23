export type MenuItemType = {
    name: string;
    price: number;
    defaultSize: string;
    smallPrice:  number;
    mediumPrice: number;
    largePrice:  number;
    side: string;
}

export type MenuCategoryType = {
    name: string;
    pretty_name: string;
    items: MenuItemType[]
}

export type OrderItemType = {
    name: string
    quantity: number;
    price: number;
    defaultSize: string;
    smallPrice:  number;
    mediumPrice: number;
    largePrice:  number;
    side: string;
}