import Logo from '../assets/waitless-logo.webp'
import FruitPoke from '../assets/stockphoto/fruit-poke.jpg'
import SalmonPoke from '../assets/stockphoto/salmon-poke.jpg'
import PrawnPoke from '../assets/stockphoto/prawn-poke.jpg'
import Salad from '../assets/stockphoto/salad.jpg'
import Dumpling from '../assets/stockphoto/dumpling.jpg'
import StrawberryDrink from '../assets/stockphoto/strawberry-drink.jpg'
import OrangeDrink from '../assets/stockphoto/orange-drink.jpg'
import WatermelonDrink from '../assets/stockphoto/watermelon-drink.jpg'

import { useState } from 'react'

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Button } from '@/components/ui/button'

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

import {
    PersonIcon,
    PlusIcon,
    MinusIcon
} from '@radix-ui/react-icons'
import { 
    Card, 
    CardContent,
} from '@/components/ui/card'

export type MenuItem = {
    id: string;
    thumbnail: string;
    name: string;
    description: string;
    price: number;
    category: string;
}

const pokeBowls: MenuItem[] = [
    {
        id: '1',
        thumbnail: FruitPoke,
        name: 'Fruit Poke',
        description: 'Filled with strawberries, drenched with lemon zest, with dab of greek yogurt',
        price: 14.99,
        category: 'Noodle'
    },
    {
        id: '2',
        thumbnail: SalmonPoke,
        name: 'Salmon Poke',
        description: 'The classic with Salmon, enjoy the traditinal Hawaiian dish!',
        price: 12.99,
        category: 'Rice'
    },
    {
        id: '3',
        thumbnail: PrawnPoke,
        name: 'Prawn Poke',
        description: 'Prawn, mushroom and usual, when it doubt this is the choice!',
        price: 10.99,
        category: 'Vermiceli'
    }
]

const sideDishes: MenuItem[] = [
    {
        id: '4',
        thumbnail: Salad,
        name: 'Asparagus Salad',
        description: 'Filled with strawberries, drenched with lemon zest, with dab of greek yogurt',
        price: 7.99,
        category: 'Salad'
    },
    {
        id: '5',
        thumbnail: Dumpling,
        name: 'Dimsim Dumplings',
        description: 'The classic with Salmon, enjoy the traditinal Hawaiian dish!',
        price: 9.99,
        category: 'Steamed'
    }
]

const drinks: MenuItem[] = [
    {
        id: '6',
        thumbnail: StrawberryDrink,
        name: 'Strawberry Punch',
        description: 'Filled with strawberries, drenched with lemon zest, with dab of greek yogurt',
        price: 5.99,
        category: 'Drinks'
    },
    {
        id: '7',
        thumbnail: OrangeDrink,
        name: 'Orange Juice',
        description: 'The classic with Salmon, enjoy the traditinal Hawaiian dish!',
        price: 5.99,
        category: 'Drinks'
    },
    {
        id: '8',
        thumbnail: WatermelonDrink,
        name: 'Water fresh Melon',
        description: 'The classic with Salmon, enjoy the traditinal Hawaiian dish!',
        price: 5.99,
        category: 'Drinks'
    }
]

export const Incrementor = () => {
    const [count, setCount] = useState(0)

    const incrementUp = () => {
        setCount(count + 1)
    }

    const incrementDown = () => {
        setCount(count - 1)
    }

    return (
        <div className='flex flex-row items-center gap-4 border rounded-md'>
            <Button className='rounded-md' onClick={incrementDown}><MinusIcon/></Button><p className='flex justify-center w-[1rem]'>{count}</p><Button className="rounded-md" onClick={incrementUp}><PlusIcon/></Button>
        </div>
    )
}

export const MenuItemCard = ({ menuItem }: { menuItem: MenuItem }) => {
    return (
        <Drawer>
            <DrawerTrigger className='w-full'>
                <Card className='flex flex-row p-1 w-full h-[6rem]'>
                    <img className="h-full rounded-sm" src={menuItem.thumbnail} alt={menuItem.name} />
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
                                src={menuItem.thumbnail}
                                width="300"
                            />
                            </div>
                        </CardContent>
                    </Card>
                    <div className='flex flex-row justify-between items-end w-full'>
                        <DrawerTitle className='text-[2rem]'>{menuItem.name}</DrawerTitle>
                        <p className='text-[1.5rem] font-bold'>${menuItem.price}</p>
                    </div>
                    <DrawerDescription className='text-left'>{menuItem.description}</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className='flex flex-row justify-between items-center w-full'>
                    <Incrementor/>
                    <Button className="rounded-md">Add to order</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

function Order() {
    return (
        <div className='flex flex-col px-[1rem] md:px-[2rem] w-full md:w-[40%] md:mx-auto pb-4'>
           <header className='flex flex-row  md:py-[2rem] justify-between items-center w-full'>
                <img className='h-[1.5rem]' src={Logo} alt="Waitless Logo" />
                <div className='flex gap-2 md:gap-4'>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className='flex flex-row items-center gap-2 rounded-md'>
                            <PersonIcon /> Table 1
                        </Button>
                    </SheetTrigger>
                    <SheetContent className='flex flex-col justify-start'>
                        <SheetHeader>
                        <SheetTitle>My Order</SheetTitle>
                        <SheetDescription>
                            Order summary will be present here
                        </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
                </div>
            </header>
            <div className='flex flex-col justify-start items-start mt-5 gap-4 w-full'>
                <div>
                    <div>
                        <h1 className='text-[1.5rem] font-bold'>Welcome!</h1>
                    </div>
                </div>
                <div className='flex flex-col gap-3 w-full'>
                    Poke Bowls
                    {pokeBowls.map((pokeBowl) => (
                        <MenuItemCard key={pokeBowl.id} menuItem={pokeBowl} />
                    ))}
                </div>
                <div className='flex flex-col gap-3 w-full'>
                    Side Dishes
                    {sideDishes.map((sideDish) => (
                        <MenuItemCard key={sideDish.id} menuItem={sideDish} />
                    ))}
                </div>
                <div className='flex flex-col gap-3 w-full'>
                    Drinks
                    {drinks.map((drink) => (
                        <MenuItemCard key={drink.id} menuItem={drink} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Order
