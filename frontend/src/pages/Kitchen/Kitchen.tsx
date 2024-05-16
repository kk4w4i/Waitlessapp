import { Order, OrderItem } from "@/type";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useEffect, useState } from "react";

import Cookies from "universal-cookie";
import KitchenOrderCards from "./KitchenOrderCards";
import { useStore } from "@/hooks/useStore";

type KitchenItem = Omit<OrderItem,  "menuImage"> 

export type KitchenOrder = Omit<Order, "orderTime" | "productCount" | "completeStatus"> & {
    products: KitchenItem[]
}

function Kitchen () {
    const { storeId } = useStore()
    const cookies = new Cookies();
    const [orders, setOrders] = useState<KitchenOrder[]>()

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`/api/get-kitchen-orders/${storeId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': cookies.get('csrftoken'),
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    const transformedOrders = data.orders.map((order: {
                        id: string;
                        order_number: string;
                        status: string;
                        table_number: string;
                        completed_order_count: string;
                        order_type: string;
                        order_items: {
                            id: string;
                            menu_name: string;
                            count: number;
                            complete_status: boolean;
                        }[];
                    }) => ({
                        id: order.id,
                        orderNumber: order.order_number,
                        status: order.status,
                        table: order.table_number,
                        completedOrderCount: parseInt(order.completed_order_count),
                        orderType: order.order_type,
                        products: order.order_items.map((item) => ({
                            id: item.id,
                            menuName: item.menu_name,
                            count: item.count,
                            completeStatus: item.complete_status,
                        })),
                    }));
                    setOrders(transformedOrders);
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
                        <p className="text-neutral-500">{orders ? orders.length : 0} order/s</p>
                    </div>
                    <ScrollArea className="w-full rounded-md h-full">
                        {orders &&
                            <div className="flex flex-row gap-4">
                                {orders.map((order) => (
                                    <KitchenOrderCards order={order}/>
                                ))}
                            </div>
                        }
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
            </div>
    )
}

export default Kitchen