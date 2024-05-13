export type Product = {
    id: string
    price: string
    category: "Sushi" | "Main" | "Small Dish" | "Dessert" | "Main" | "Soup" | "Share"
    status: "Published" | "Draft"
    name: string
    image: string
    storeId: string
}
