import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '../../components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Order, OrderItem } from '../../type'

import { Button } from "../../components/ui/button";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import Cookies from 'universal-cookie';
import { Progress } from "../../components/ui/progress";
import { differenceInMinutes } from 'date-fns';
import { useState } from 'react';
import { useStore } from "@/hooks/useStore"

interface OrderCardProps {
    order: Order
}

const OrderCard: React.FC<OrderCardProps> = ({order}) => {
    const { storeId } = useStore()
    const cookies = new Cookies()
    const [orderItems, setOrderItems] = useState<OrderItem[]>([])

    const handleComplete = async (orderId: string) => {
        try {
            const response = await fetch('/api/complete-hall-status/', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                },
                body: JSON.stringify({ orderId, storeId }),
            });
        
            if (response.ok) {
                console.log(`${orderId} complete!`);
                window.location.reload()
            } else {
                console.error("Error complete order :(");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const fetchOrderItems = async (orderId: string) => {
        try {
            const response = await fetch('/api/get-order-items/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': cookies.get('csrftoken'),
                },
                body: JSON.stringify({ orderId, storeId }),
            })
            if (response.ok) {
                const data = await response.json()
                const transformedOrderItems = data.order_items.map((item: 
                    {
                        id: string
                        count: number
                        menu_name: string
                        menu_image: string
                        complete_status: boolean
                    }
                ) => (
                    {
                        id: item.id,
                        count: item.count,
                        menuName: item.menu_name,
                        menuImage: item.menu_image,
                        completeStatus: item.complete_status
                    }
                ))
                setOrderItems(transformedOrderItems)
            } else {
                console.error('Failed to fetch store order items')
            }
        } catch (error) {
            console.error('Error fetching order items:', error)
        }

    }
    
    return (
        <Card key={order.id}>
            <CardHeader className="flex flex-row justify-between border-b py-4 items-top">
            <div>
                <CardTitle className="text-[1.2rem]">Order {order.orderNumber}</CardTitle>
                <span className="text-neutral-500">{order.orderType} - Table {order.table}</span>
            </div>
            <div className="flex flex-row gap-2 items-center">
                <div className={`w-2 h-2 rounded-full ${order.status === 'Cooking' ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                <p className="text-[0.89rem]">{order.status}</p>
            </div>
            </CardHeader>
            <CardContent className="flex flex-col">
            <div className="flex py-4 gap-4">
            <Dialog>
                <DialogTrigger asChild>
                    <Button onClick={() => fetchOrderItems(order.id)} className="w-full rounded-md py-6">
                        {order.productCount} items <ChevronRightIcon />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Table {order.table} Order</DialogTitle>
                    </DialogHeader>
                    {orderItems.map((item) => (
                        <div className='flex flex-row w-full'>
                            <div className='flex flex-row items-center px-2 py-2 h-full w-full'>
                                <div className='relative flex flex-col justify-start items-start h-full w-full'>
                                    <h1 className='font-medium text-left'>{item.menuName}</h1>
                                    <p className='absolute right-0 text-[0.9rem] font-bold text-left'>x{item.count}</p> 
                                </div>
                            </div>
                        </div>
                    ))}
                </DialogContent>
            </Dialog>
                
                <Button onClick={() => handleComplete(order.id)} variant="outline" className="w-full rounded-md py-6">
                    Complete Order
                </Button>
            </div>
            <div className="flex flex-row gap-4 items-center justify-between">
                <Progress className="h-[0.6rem] w-[70%]" value={100 * (order.completedOrderCount / order.productCount)} />
                <p className="text-neutral-500 text-[0.8rem]">{formatOrderTime(order.orderTime)}</p>
            </div>
            </CardContent>
        </Card> 
    )
}

const formatOrderTime = (orderTime: string): string => {
    const minutesSinceOrder = differenceInMinutes(new Date(), new Date(orderTime));
    return `${minutesSinceOrder} minute(s) ago`;
};

export default OrderCard