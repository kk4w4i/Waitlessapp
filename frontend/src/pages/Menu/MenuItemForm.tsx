import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import Cookies from "universal-cookie"
import { ImageIcon, } from "@/assets/svgs/IconSVGs"
import ImageUploader from "@/components/ImageUploader"
import { Input } from "@/components/ui/input"
import { Product } from "@/type"
import { TagIcon } from "@/assets/svgs/IconSVGs"
import { useStore } from "@/hooks/useStore"

interface MenuItemProps {
    editingProduct: Product | null
    isOpen: boolean
    onClose: () => void
}

const MenuItemForm: React.FC<MenuItemProps> = ({editingProduct, isOpen, onClose}) => {
    const cookies = new Cookies();
    const { storeId } = useStore()
    const [product, setProduct] = useState<Product>({
        id: '',
        name: '',
        price: '',
        category: 'Sushi',
        status: 'Draft',
        image: '',
        storeId: ''
    });
   
    useEffect(() => {
        if (editingProduct && isOpen) {
            setProduct(editingProduct);
        }
    }, [editingProduct, isOpen]);

    const handleChangeForMenuItem = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setProduct((prevProduct) => ({
          ...prevProduct,
          [name]: value,
        }));
      };

      const handleSubmit = async (status: "Published" | "Draft", storeId: string | null) => {  
        try {
          const response = await fetch('/api/create-product/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': cookies.get('csrftoken'),
            },
            body: JSON.stringify({ ...product, status, storeId }),
          });
      
          if (response.ok) {
            console.log(`Product created with ${status} status`);
            handleCloseClick()
          } else {
            console.error('Failed to create product');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

      interface CustomButtonProps {
        children?: React.ReactNode;
        onClick?: () => void;
      }
      
      function CustomButton({ children, onClick, ...rest }: CustomButtonProps) {
        return (
          <Button
            className="flex gap-2 items-center p-0"
            variant="ghost"
            onClick={onClick}
            {...rest}
          >
            {children}
            <ImageIcon /> Photo
          </Button>
        );
      }
    
      const handleImageUpload = (base64: string) => {
        setProduct((prevProduct) => ({
            ...prevProduct,
            ["image"]: base64,
          }));
    }
    
    const handleCloseClick = () => {
        onClose()
        setProduct({
            id: '',
            name: '',
            price: '',
            category: 'Sushi',
            status: 'Draft',
            image: '', 
            storeId: ''
        })
    }
    
    const handleCategoryChange = (value: "Sushi" | "Main" | "Small Dish" | "Dessert" | "Main" | "Soup" | "Share") => {
        setProduct((prevProduct) => ({
            ...prevProduct,
            ["category"]: value,
          })); 
    }

    const title = editingProduct ? `Editing ${editingProduct.name}` : "Create Menu Item"
    const description = editingProduct ? 
        "Edit the details of the menu item" : 
        "Add details of the menu item, these items will appear on order page if you select \"Publish\"."

    return(
        <Dialog open={isOpen}>
            <DialogContent onCloseClick={handleCloseClick}>
                <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>
                    {description}
                </DialogDescription>
                </DialogHeader>
                <form className="flex flex-col gap-2" onSubmit={(event) => {event.preventDefault();}}>
                    <label>Name</label>
                    <Input
                        name="name"
                        value={product.name}
                        onChange={handleChangeForMenuItem}
                    />
                    <label>Price</label>
                    <Input
                        name="price"
                        value={product.price}
                        onChange={handleChangeForMenuItem}
                        /> 
                    <div className="flex flex-row gap-4 items-center justify-start w-full">
                        <ImageUploader 
                            onImageUpload={handleImageUpload}
                            label=""
                            buttonComponent={CustomButton}
                        />
                        <Select value={product.category} onValueChange={handleCategoryChange}>
                            <SelectTrigger>
                                <div className="flex gap-2 items-center">
                                    <TagIcon/><SelectValue placeholder="Category"/>
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Sushi">Sushi</SelectItem>
                                <SelectItem value="Main">Main</SelectItem>
                                <SelectItem value="Small Dish">Small Dish</SelectItem>
                                <SelectItem value="Dessert">Dessert</SelectItem>
                                <SelectItem value="Soup">Soup</SelectItem>
                                <SelectItem value="Share">Share</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="flex gap-4 justify-end">
                        <DialogClose>
                            <Button className="rounded-md" variant="outline" type="submit" onClick={() => handleSubmit('Draft', storeId)}>
                                Draft
                            </Button>
                            <Button className="rounded-md" type="submit" onClick={() => handleSubmit('Published', storeId)}>
                                Publish
                            </Button>
                        </DialogClose>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default MenuItemForm
