import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useEffect, useState } from "react";

import Cookies from "universal-cookie";
import { KitchenOrder } from "./Kitchen"
import { useStore } from "@/hooks/useStore";

interface KitchenOrderCardsProps {
    order: KitchenOrder
}

const KitchenOrderCards: React.FC<KitchenOrderCardsProps> = ({order}) => {
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [showCompleteButton, setShowCompleteButton] = useState(false);
    const { storeId } = useStore()
    const cookies = new Cookies();


    const handleToggleChange = (productId: string) => {
        if (selectedProducts.some((id) => id === productId)) {
            setSelectedProducts(selectedProducts.filter((id) => id !== productId));
        } else {
            setSelectedProducts([...selectedProducts, productId]);
        }
    };

    const allProductsSelected = order.products.every((product) =>
        selectedProducts.includes(product.id)
    );

    useEffect(() => {
        if (allProductsSelected) {
            setShowCompleteButton(true);
        } else {
            setShowCompleteButton(false);
        }
    }, [allProductsSelected]);

    const handleReadyToServe = async (orderId: string) => {
        try {
            const response = await fetch('/api/update-order/', {
                method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': cookies.get('csrftoken'),
                    },
                    body: JSON.stringify({ storeId, orderId }),
            })
            if (response.ok) {
                console.log("Great job order completed!")
                window.location.reload()
            } else {
                console.error('Failed to update order status')
            }
        } catch (error) {
            console.error('Error fetching orders:', error)
        }
    }
    
    return (
        <Card key={order.id} className="w-[17rem] h-full transition-all ease-in-out duration-200">
            <CardHeader className={`flex flex-row justify-between border-b py-4 items-top rounded-t-md ${order.orderType === 'Dine in' ? 'bg-primary text-secondary' : 'bg-white text-primary'}`}>
                <div>
                    <CardTitle className="text-[1.2rem]">Order {order.orderNumber}</CardTitle>
                    <span className={`${order.orderType === 'Dine in' ? 'text-neutral-200' : 'text-neutral-400'}`}>{order.orderType} - Table {order.table}</span>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col p-0">
                <ToggleGroup className="flex flex-col" type="multiple">
                    {order.products.map((product) => (
                        <ToggleGroupItem 
                            key={product.id} 
                            value={product.id}
                            onClick={() => handleToggleChange(product.id)}
                            >
                            <div className="flex w-full justify-between items-center">
                                <p>{product.menuName}</p>
                                <p>{product.count}</p>
                            </div>
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>
            </CardContent>
            {showCompleteButton && (
                    <button
                        className="w-full bg-primary text-white py-4 px-4 rounded-b-md"
                        onClick={() => handleReadyToServe(order.id)}
                    >
                        Complete
                    </button>
                )}
        </Card>

    )
}

export default KitchenOrderCards