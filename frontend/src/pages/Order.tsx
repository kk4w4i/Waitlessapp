import {
    Card,
    CardContent,
} from '@/components/ui/card'
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    MinusIcon,
    PersonIcon,
    PlusIcon
} from '@radix-ui/react-icons'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import Cookies from 'universal-cookie'
import Logo from '@/assets/waitless-logo.webp'
import { useSearchParams } from 'react-router-dom'

export type Product = {
    id: string
    price: string
    category: "Sushi" | "Main" | "Small Dish" | "Dessert" | "Main" | "Soup" | "Share"
    status: "Published" | "Draft"
    name: string
    image: string
    storeId: string
}

export type OrderItem = {
    menuId: string
    count: number
}

export const MenuItemCard = ({ menuItem, orderItems, setOrderItems }: { menuItem: Product, orderItems: OrderItem[], setOrderItems: React.Dispatch<React.SetStateAction<OrderItem[]>> }) => {
    const [count, setCount] = useState(1)

    const incrementUp = () => {
        setCount(count + 1)
    }

    const incrementDown = () => {
        if (count == 1) {
            setCount(count)
        }
        else {
            setCount(count - 1)
        }
    }

    const addMenuItem = (menuItem: Product) => {
        let found = false;
    
        const updatedOrderItems = orderItems.map(orderItem => {
            if (orderItem.menuId === menuItem.id) {
                found = true; 
                return { ...orderItem, count: orderItem.count + count };
            }
            return orderItem;  
        });
    
        if (!found) {
            updatedOrderItems.push({
                menuId: menuItem.id,
                count: count
            });
        }
    
        setOrderItems(updatedOrderItems); 
    };

    return (
        <Drawer onClose={() => setCount(1)}>
            <DrawerTrigger className='w-full'>
                <Card className='flex flex-row p-1 w-full h-[6rem]'>
                    <img className="h-full rounded-sm" src={menuItem.image} alt={menuItem.name} />
                    <CardContent className='flex flex-row items-center px-2 py-2 h-full w-full'>
                        <div className='relative flex flex-col justify-start items-start h-full w-full'>
                            <h1 className='font-medium text-left'>{menuItem.name}</h1>
                            <p className='absolute bottom-0 right-0 text-[0.9rem] font-bold text-left'>${menuItem.price}</p>
                            <span className='px-2 py-1 bg-primary text-white rounded-full text-[0.5rem] mt-1'>{menuItem.category}</span>
                        </div>
                    </CardContent>
                </Card>
            </DrawerTrigger>
            <DrawerContent className='flex flex-col justify-start items-start w-full md:w-[40%] md:mx-auto'>
                <DrawerHeader className='flex flex-col justify-start items-start'>
                    <Card className="overflow-hidden border-hidden">
                        <CardContent className='p-0'>
                            <div className="grid gap-2">
                            <img
                                alt="Product image"
                                className="aspect-square w-full rounded-md object-cover"
                                height="300"
                                src={menuItem.image}
                                width="300"
                            />
                            </div>
                        </CardContent>
                    </Card>
                    <div className='flex flex-row justify-between items-end w-full'>
                        <DrawerTitle className='text-[2rem]'>{menuItem.name}</DrawerTitle>
                        <p className='text-[1.5rem] font-bold'>${menuItem.price}</p>
                    </div>
                </DrawerHeader>
                <DrawerFooter className='flex flex-row justify-between items-center w-full'>
                    <div className='flex flex-row items-center gap-4 border rounded-md'>
                        <Button className='rounded-md' onClick={incrementDown}><MinusIcon/></Button><p className='flex justify-center w-[1rem]'>{count}</p><Button className="rounded-md" onClick={incrementUp}><PlusIcon/></Button>
                    </div>
                    <Button onClick={() => addMenuItem(menuItem)}className="rounded-md">Add to order</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

function Order() {
    const [searchParams] = useSearchParams()
    const cookies = new Cookies()
    const store = searchParams.get('store')
    const table = searchParams.get('table')
    const [menuItems, setMenuItems] = useState<Product[]>([])
    const [orderItems, setOrderItems] = useState<OrderItem[]>([])
    const [storeName, setStoreName] = useState<string>()

    useEffect(() => {
        const fetchMenuList = async () => {
            const response = await fetch('/api/store/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
              },
              body: JSON.stringify({ store }),
            });
      
            if (!response.ok) {
              throw new Error('Failed to fetch products');
            }

            const data = await response.json();
            setMenuItems(data.products)
            setStoreName(data.storeName)
          };
      
          fetchMenuList();
    }, [])

    const sendOrder = async () => {  
        try {
          const response = await fetch('/api/order/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': cookies.get('csrftoken'),
            },
            body: JSON.stringify({ storeUrl: store, tableNumber: table, orderItems, orderType: 'Dine in'}),
          });
      
          if (response.ok) {
            console.log(`order sent!`);
            setOrderItems([])
          } else {
            console.error('Failed to send order');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

    const totalCost = menuItems
    .filter(menuItem => 
        orderItems.some(orderItem => orderItem.menuId === menuItem.id)
    )
    .reduce((total, menuItem) => {
        const orderItem = orderItems.find(orderItem => orderItem.menuId === menuItem.id);
        if (orderItem) {
            return total + (Number(menuItem.price) * orderItem.count);
        } else {
            return total
        }
    }, 0);

    return (
        <div className='flex flex-col px-[1rem] md:px-[2rem] w-full md:w-[40%] md:mx-auto pb-4'>
           <header className='flex flex-row  md:py-[2rem] justify-between items-center w-full'>
                <img className='h-[1.5rem]' src={Logo} alt="Waitless Logo" />
                <div className='flex gap-2 md:gap-4'>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className='flex flex-row items-center gap-2 rounded-md'>
                            <PersonIcon /> Table {table}
                        </Button>
                    </SheetTrigger>
                    <SheetContent className='flex flex-col justify-between'>
                        <div>
                            <SheetHeader>
                            <SheetTitle>My Order</SheetTitle>
                            <SheetDescription>
                                Order summary will be present here
                            </SheetDescription>
                            </SheetHeader>
                            {
                                menuItems.filter(menuItem => 
                                    orderItems.some(orderItem => orderItem.menuId === menuItem.id)
                                ).map((item) => {
                                    const orderItem = orderItems.find(orderItem => orderItem.menuId === item.id);
                                    return (
                                        <div className='flex flex-row p-1 w-full h-[6rem]'>
                                            <img className="h-full rounded-sm" src={item.image} alt={item.name} />
                                            <div className='flex flex-row items-center px-2 py-2 h-full w-full'>
                                                <div className='relative flex flex-col justify-start items-start h-full w-full'>
                                                    <h1 className='w-full flex flex-row justify-between font-medium text-left'>{orderItem ? orderItem.count : 0}x {item.name}</h1>
                                                    <p className='absolute bottom-0 right-0 text-[0.9rem] font-bold text-left'>${item.price}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        
                        <SheetFooter>
                            Total: ${totalCost}
                            <SheetClose asChild>
                                <Button onClick={() => sendOrder()} disabled={!(orderItems.length > 0)} className='w-full rounded-md'>
                                    Send Order
                                </Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
                </div>
            </header>
            <div className='flex flex-col justify-start items-start mt-5 gap-4 w-full'>
                <div>
                    <div>
                        <h1 className='text-[1.5rem] font-bold'>Welcome to {storeName}</h1>
                    </div>
                </div>
                <div className='flex flex-col gap-3 w-full'>
                    {menuItems.map((item) => (
                        <MenuItemCard key={item.id} menuItem={item} orderItems={orderItems} setOrderItems={setOrderItems}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Order
