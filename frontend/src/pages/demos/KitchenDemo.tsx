import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
  
export type OrderItem = {
    id: string
    name: string
    quantity: number
}

export type Order = {
    id: string
    status: "Cooking" | "Ready to serve"
    orderTime: string
    table: string
    productCount: number
    completedOrderCount: number
    orderType: "Dine in" | "Takeaway"
    products: OrderItem[]
  }

  const orderItems: OrderItem[] = [
    {
      id: '1',
      name: 'Margherita Pizza',
      quantity: 2
    },
    {
      id: '2', 
      name: 'Greek Salad',
      quantity: 1
    },
    {
      id: '3',
      name: 'Garlic Bread',
      quantity: 3
    },
    {
      id: '4',
      name: 'Tiramisu',
      quantity: 1
    },
    {
      id: '5',
      name: 'Spaghetti Bolognese',
      quantity: 2
    },
    {
        id: '6',
        name: 'Chicken Alfredo',
        quantity: 1
    },
    {
        id: '7',
        name: 'Caesar Salad',
        quantity: 2
    },
    {
        id: '8',
        name: 'Beef Lasagna',
        quantity: 3
    },
    {
        id: '9',
        name: 'Chocolate Lava Cake',
        quantity: 1
    },
    {
        id: '10',
        name: 'Vegetable Stir Fry',
        quantity: 2
    },
    {
        id: '11',
        name: 'Grilled Salmon',
        quantity: 1
    },
    {
        id: '12',
        name: 'Caprese Salad',
        quantity: 1
    },
    {
        id: '13',
        name: 'Mushroom Risotto',
        quantity: 2
    }
  ];



  const orders: Order[] = [
  {
    id: '1',
    status: 'Cooking',
    orderTime: '2023-04-07T10:30:00Z',
    table: '4',
    productCount: 3,
    completedOrderCount: 0,
    orderType: 'Dine in',
    products: [orderItems[0], orderItems[1], orderItems[2]]
  },
  {
    id: '2',
    status: 'Ready to serve',
    orderTime: '2023-04-07T11:15:00Z',
    table: 'T',
    productCount: 2,
    completedOrderCount: 2,
    orderType: 'Takeaway',
    products: [orderItems[3], orderItems[4], orderItems[8], orderItems[10], orderItems[2], orderItems[5], orderItems[11], orderItems[1], orderItems[0], orderItems[6]]
  },
  {
    id: '3',
    status: 'Cooking',
    orderTime: '2023-04-07T11:45:00Z',
    table: '2', 
    productCount: 4,
    completedOrderCount: 1,
    orderType: 'Dine in',
    products: [orderItems[0], orderItems[1], orderItems[2], orderItems[4]]
  },
  {
    id: '4',
    status: 'Cooking',
    orderTime: '2023-04-07T12:00:00Z',
    table: 'Table 5',
    productCount: 3,
    completedOrderCount: 1,
    orderType: 'Dine in',
    products: [orderItems[0], orderItems[1], orderItems[2]]
  },
  {
    id: '5',
    status: 'Ready to serve',
    orderTime: '2023-04-07T12:15:00Z',
    table: 'Table 9',
    productCount: 2,
    completedOrderCount: 2,
    orderType: 'Takeaway',
    products: [orderItems[3], orderItems[4]]
  },
  {
    id: '6',
    status: 'Cooking',
    orderTime: '2023-04-07T12:30:00Z',
    table: 'Table 3',
    productCount: 3,
    completedOrderCount: 0,
    orderType: 'Dine in',
    products: [orderItems[5], orderItems[6], orderItems[7]]
  },
  {
    id: '7',
    status: 'Cooking',
    orderTime: '2023-04-07T12:45:00Z',
    table: 'Table 8',
    productCount: 4,
    completedOrderCount: 1,
    orderType: 'Dine in',
    products: [orderItems[0], orderItems[1], orderItems[2], orderItems[3]]
  }
];


function Kitchen () {

    return (
            <div className="flex flex-col col-span-4 py-4 px-[1rem] md:px-[2rem]">
                <div className="relative flex flex-row items-center w-full z-[2] mb-[2vh] ">
                    <div>
                        <span className="flex flex-row items-center gap-2 text-[3rem] font-bold">Kitchen</span>
                        <p className="text-neutral-500">As simple as Look, Make, and Complete</p>
                    </div>
                </div>
                <div className="flex flex-col border rounded-md p-4 h-[62vh] md:h-[75vh]">
                    <div className=" flex flex-row justify-between items-center sticky top-0 bg-white pb-[1rem] z-[2]">
                        <h1 className="text-[2rem] font-bold">Orders</h1>
                        <p className="text-neutral-500">{orders.length} orders</p>
                    </div>
                    <ScrollArea className="w-full rounded-md h-full">
                        <div className="flex flex-row gap-4">
                        {orders.map((order) => (
                            <Card key={order.id} className="w-[17rem] h-full">
                                <CardHeader className={`flex flex-row justify-between border-b py-4 items-top rounded-t-md ${order.orderType === 'Dine in' ? 'bg-primary text-secondary' : 'bg-white text-primary'}`}>
                                    <div>
                                        <CardTitle className="text-[1.2rem]">Order {order.id}</CardTitle>
                                        <span className={`${order.orderType === 'Dine in' ? 'text-neutral-200' : 'text-neutral-400'}`}>{order.orderType} - Table {order.table}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex flex-col">
                                <div className="flex flex-col py-4 gap-6">
                                    <ul className="flex flex-col gap-4">
                                    {order.products.map((product) => (
                                        <span key={product.id} className="flex flex-row justify-between">
                                            <li >
                                                {product.name}
                                            </li>
                                            <li>
                                                {product.quantity}
                                            </li>
                                        </span>
                                        
                                    ))}
                                    </ul>
                                </div>
                                </CardContent>
                            </Card>
                        ))}

                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
            </div>
    )
}

export default Kitchen