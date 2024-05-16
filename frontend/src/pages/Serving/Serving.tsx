import { Order, Table } from "@/type";
import { useEffect, useRef, useState } from "react";

import Cookies from "universal-cookie";
import OrderCards from "./OrderCards"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useStore } from "@/hooks/useStore";

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
                    const transformedOrders = data.orders.map((order: 
                        { 
                            id: string;
                            order_number: string; 
                            status: string; 
                            ordered_at: string; 
                            table_number: string; 
                            product_count: string; 
                            completed_order_count: string;
                            completeStatus: boolean
                            order_type: string
                        }
                    ) => (
                        {
                            id: order.id,
                            orderNumber: order.order_number,
                            status: order.status,
                            orderTime: order.ordered_at,
                            table: order.table_number,
                            productCount: parseInt(order.product_count),
                            completedOrderCount: parseInt(order.completed_order_count),
                            completeStatus: order.completeStatus,
                            orderType: order.order_type
                        }
                    ));
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

    console.log(orders)
    
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
                    {orders.filter((order) => !order.completeStatus).map((order) => (
                        <OrderCards order={order}/>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
    
export default Serving;