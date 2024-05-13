import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";

import { Button } from "../../components/ui/button";
import { Product } from "@/type";

interface ProductDrawerProps {
    isOpen: boolean;
    product: Product | null;
    onClose: () => void;
}

const ProductDrawer: React.FC<ProductDrawerProps> = ({ isOpen, product, onClose }) => {
    if (!isOpen || !product) return null;
  
    return (
        <Drawer open={isOpen} onClose={onClose}>
            <DrawerContent className='flex flex-col justify-start items-start w-full md:w-[40%] md:mx-auto'>
                <DrawerHeader className='flex flex-col justify-start items-start'>
                    <div className="overflow-hidden border-hidden">
                        <div className='p-0'>
                            <div className="grid gap-2">
                                <img
                                    alt="Product image"
                                    className="aspect-square w-full rounded-md object-cover"
                                    height="300"
                                    src={product.image}
                                    width="300"
                                />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row justify-between items-end w-full'>
                        <DrawerTitle className='text-[2rem]'>{product.name}</DrawerTitle>
                        <p className='text-[1.5rem] font-bold'>${product.price}</p>
                    </div>
                </DrawerHeader>
                <DrawerFooter className='flex flex-row justify-between items-center w-full'>
                    <div className='flex flex-row items-center gap-4 border rounded-md'>
                    <Button className='rounded-md'><MinusIcon/></Button><p className='flex justify-center w-[1rem]'>0</p><Button className="rounded-md"><PlusIcon/></Button>
                    </div>
                    <Button className="rounded-md">Add to order</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
  };

export default ProductDrawer