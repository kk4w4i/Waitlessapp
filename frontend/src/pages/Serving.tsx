import { Button } from "@/components/ui/button";
import { differenceInMinutes } from 'date-fns';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { useEffect, useState, useRef } from "react";
import { useStore } from "@/hooks/useStore";
import Cookies from "universal-cookie";
  
  export type Order = {
    id: string
    status: "Cooking" | "Ready to serve"
    orderTime: string
    table: string
    productCount: number
    completedOrderCount: number
    orderType: "Dine in" | "Takeaway"
  }

  export type OrderItem = {
    id: string
    count: number
    menuName: string
    menuImage: string
    orderId: string
  }

  export type Table = {
    id: number;
    width: number;
    height: number;
    positionx: number;
    positiony: number;
    status: "Default" | "Assist" | "Bill"
  };

  
  function Serving() {
    const { storeId } = useStore()
    const cookies = new Cookies();
    const [tables, setTables] = useState<Table[]>([])
    const [orders, setOrders] = useState<Order[]>([])

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await fetch(`/api/get-seating-layout/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': cookies.get('csrftoken'),
                    },
                    body: JSON.stringify({ storeId }),
                });
                if (response.ok) {
                    const data = await response.json();
                    const transformedTables = data.tables.map((table: { table_number: number; position_x: string; position_y: string; width: string; height: string; }) => ({
                        id: table.table_number,
                        positionx: parseFloat(table.position_x),
                        positiony: parseFloat(table.position_y),
                        width: parseFloat(table.width),
                        height: parseFloat(table.height),
                        status: "Default"
                    }));
                    setTables(transformedTables); // Set the transformed tables to the state
                } else {
                    console.error('Failed to fetch tables');
                }
            } catch (error) {
                console.error('Error fetching tables:', error);
            }
        };
    
        fetchTables();
    }, [storeId]);

    const [scale, setScale] = useState<number>(1)
    const parentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            if (parentRef.current) {
                const newParentWidth = parentRef.current.clientWidth;
                const newScreenWidth = window.outerWidth;
                const newScale = newScreenWidth / newParentWidth;
                setScale(newScale);
            }
        };

        window.addEventListener('resize', handleResize);

        // Call handleResize initially to set the initial scale
        handleResize();

        // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`/api/get-orders/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': cookies.get('csrftoken'),
                    },
                    body: JSON.stringify({ storeId }),
                });
                if (response.ok) {
                    const data = await response.json();
                    const transformedOrders = data.orders.map((order: { 
                            order_number: string; 
                            status: string; 
                            ordered_at: string; 
                            table_number: string; 
                            product_count: string; 
                            completed_order_count: string;
                            order_type: string
                        }) => (
                            {
                            id: order.order_number,
                            status: order.status,
                            orderTime: order.ordered_at,
                            table: order.table_number,
                            productCount: parseInt(order.product_count),
                            completedOrderCount: parseInt(order.completed_order_count),
                            orderType: order.order_type
                            }));
                    setOrders(transformedOrders); // Set the transformed tables to the state
                } else {
                    console.error('Failed to fetch store orders');
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
    
        fetchOrders();
    }, [storeId]);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 py-4 px-[1rem] md:px-[2rem] md:gap-4">
        <div className="flex flex-col col-span-2 gap-4">
            <div className="relative flex flex-row items-center w-full z-[2]">
            <div>
                <span className="flex flex-row items-center gap-2 text-[3rem] font-bold">Serve</span>
                <p className="text-neutral-500">Keep track of orders and seating vacancies</p>
            </div>
            </div>
            <div ref={parentRef} className="relative h-[75vh] w-full border rounded-md md:block hidden">
                {tables.map((table) => (
                    <div
                        key={table.id}
                        className={`absolute flex items-center justify-center rounded-md ${
                            table.status === "Default" ? "bg-white text-primary border" : "bg-primary text-white"
                        }`}
                        style={{
                            width: `${table.width / scale * 1.10}px`,
                            height: `${table.height / scale * 1.10}px`,
                            left: `${table.positionx / scale * 1.10}px`,
                            top: `${table.positiony / scale * 1.10 + 100}px`,
                        }}
                    >
                        {table.id}
                    </div>
                ))}
                <div className="absolute bottom-5 right-10 flex flex-row gap-6">
                    <div className="flex flex-row gap-2 items-center">
                        <div className="bg-primary h-4 w-4 rounded-md"></div>
                        Assistance!
                    </div>
                </div>
            </div>
        </div>
            <ScrollArea className="relative h-[62vh] md:h-[85vh] w-full rounded-md border p-4 mt-5 md:mt-0">
                <h1 className="sticky top-0 bg-white text-[2rem] font-bold pb-[1rem] z-[2]">Orders</h1>
                <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                    <Card key={order.id}>
                        <CardHeader className="flex flex-row justify-between border-b py-4 items-top">
                        <div>
                            <CardTitle className="text-[1.2rem]">Order {order.id}</CardTitle>
                            <span className="text-neutral-500">{order.orderType} - Table {order.table}</span>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <div className={`w-2 h-2 rounded-full ${order.status === 'Cooking' ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                            <p className="text-[0.89rem]">{order.status}</p>
                        </div>
                        </CardHeader>
                        <CardContent className="flex flex-col">
                        <div className="flex py-4 gap-4">
                            <Button className="w-full rounded-md py-6">
                            {order.productCount} items <ChevronRightIcon />
                            </Button>
                            <Button variant="outline" className="w-full rounded-md py-6">
                            Complete Order
                            </Button>
                        </div>
                        <div className="flex flex-row gap-4 items-center justify-between">
                            <Progress className="h-[0.6rem] w-[70%]" value={100 * (order.completedOrderCount / order.productCount)} />
                            <p className="text-neutral-500 text-[0.8rem]">{formatOrderTime(order.orderTime)}</p>
                        </div>
                        </CardContent>
                    </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
  }
  
  const formatOrderTime = (orderTime: string): string => {
    const minutesSinceOrder = differenceInMinutes(new Date(), new Date(orderTime));
    return `${minutesSinceOrder} minute(s) ago`;
  };
  
  export default Serving;