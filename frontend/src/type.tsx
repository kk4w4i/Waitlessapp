export type Product = {
    id: string
    price: string
    category: "Sushi" | "Main" | "Small Dish" | "Dessert" | "Main" | "Soup" | "Share"
    status: "Published" | "Draft"
    name: string
    image: string
    storeId: string
}

export type Order = {
    id: string
    orderNumber: string
    status: "Cooking" | "Ready to serve"
    completeStatus: boolean
    orderTime: string
    table: string
    productCount: number
    completedOrderCount: number
    orderType: "Dine in" | "Takeaway"
}

export type Table = {
    id: number;
    width: number;
    height: number;
    positionx: number;
    positiony: number;
    status: "Default" | "Assist" | "Bill"
};

export type OrderItem = {
    id: string
    count: number
    menuName: string
    menuImage: string
    completeStatus: boolean
}