import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import Cookies from 'universal-cookie'
import { useStore } from "@/hooks/useStore"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Input } from "@/components/ui/input"
import { PlusIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Logo from '../assets/waitless-logo.webp'
import pfp from '../assets/pfp-ph.webp'
import { motion } from 'framer-motion'

export type Store = {
    name: string
    email: string
    address: string
    url: string
  }

export type StoreProfile = {
    id: string
    store_id: string
    store_name: string
    username: string
    store_url: string
    role: string
}


function User () {
    const token = localStorage.getItem('access-token') !== null
    const [currentStep, setCurrentStep] = useState(0)
    const cookies = new Cookies();
    const navigate = useNavigate()
    const { setStoreId, setStoreUrl } = useStore();

    const [storeProfiles, setStoreProfiles] = useState<StoreProfile[]>([]);

    useEffect(() => {
        const fetchUserProfiles = async () => {
            try {
            const response = await fetch('/api/profiles/');
            const data: StoreProfile[] = await response.json();
            setStoreProfiles(data);
            } catch (error) {
            console.error('Error fetching menu items:', error);
            }
        };

        fetchUserProfiles();
    }, []);

    const handleClick = (item: { store_id: string; store_url: string }) => {
        setStoreId(item.store_id);
        setStoreUrl(item.store_url);
        navigate(`/menu/${item.store_url}`);
    };

    const handleLogout = async () => {
        try {
          const response = await fetch('/api/logout/', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          if (response.ok) {
            localStorage.removeItem('access-token');
            window.location.href = '/';
          } else {
            const data = await response.json();
            console.error('Logout failed:', data.detail);
          }
        } catch (error) {
          console.error('Logout error:', error);
        }
      };

    const stepVariants = {
        initial: { x: '2vw', opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: '-2vw', opacity: 0 },
    };

    const [store, setStore] = useState<Store>({
        name: '',
        email: '',
        address: '',
        url: '' 
    })

    const [key, setKey] = useState<string>('')

    const handleChangeStoreDetails = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setStore((prevStore) => ({
          ...prevStore,
          [name]: value,
        }));
      };

    const handleCloseClick = () => {
        setStore({
            name: '',
            email: '',
            address: '',
            url: '' 
        })
    }

    const handleKeyInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setKey(value)
      };

    const handleSubmit = async () => {  
        try {
            const response = await fetch('/api/create-store/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
            },
            body: JSON.stringify({ ...store }),
            });
        
            if (response.ok) {
            console.log(`Store created`);
            handleCloseClick()
            } else {
            console.error('Failed to create store');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAddStore = async () => {
        try{
            const response = await fetch('/api/create-store-profile/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': cookies.get('csrftoken'),
                },
                body: JSON.stringify({ key }),
            })

            if (response.ok) {
                console.log("Store added")
                setKey('')
            } else {
                console.error(response)
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="flex flex-col w-full px-[1rem] md:px-[2rem]">
        <header className='flex flex-row md:py-[2rem] justify-between items-center w-full'>
            <img onClick={() => window.location.href = '/'} className="h-[1.8rem]" src={Logo}></img>
                {token ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                                <Avatar>
                                    <AvatarImage src={pfp} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <Button onClick={() => handleLogout()}>
                                Logout
                            </Button>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <div className='flex gap-2 md:gap-4'>
                    <Button onClick={() => window.location.href = '/signin'} className="text-[0.7rem] md:text-[0.8rem]" variant="outline">Sign in</Button>
                    <Button onClick={() => window.location.href = '/demo/menu'} className='text-[0.7rem] md:text-[0.8rem] hidden md:block'> Try it out now</Button>
                    </div>
                )}
            </header>
        <div className="flex flex-col md:flex-row justify-between items:start md:items-end py-4">
            <div className="flex flex-col items-start">
                <span className="flex flex-row items-center gap-2 text-[3rem] font-bold">Welcome!</span>
                <p className="text-neutral-500">Let's select your store or create a new store</p>
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="rounded-md gap-2" variant="outline" onClick={() => setCurrentStep(0)}>
                        <PlusIcon className="size-4"/> New Store
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Connect or Create a new store</DialogTitle>
                    <DialogDescription>
                        Enter the store key to connect to the store or press + to create a new store
                    </DialogDescription>
                    </DialogHeader>
                    {currentStep === 0 && (
                        <motion.div
                            className='h-full w-full'
                            key="step-0"
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                        >
                            <div className="flex flex-col gap-2">
                                <label>
                                    Store Key
                                </label>
                                <div className="flex flex-row gap-3">
                                    <Input
                                        name="key"
                                        value={key}
                                        onChange={handleKeyInput}
                                    />
                                    <Button className="rounded-md" onClick={handleAddStore}>
                                        Connect
                                    </Button>
                                </div>
                                <label>
                                    Create New Store
                                </label>
                                <Button className="rounded-md" onClick={() => setCurrentStep(1)}>
                                    <PlusIcon/>
                                </Button>
                            </div>
                        </motion.div>
                    )}
                    {currentStep === 1 && (
                        <motion.div
                            className='h-full w-full'
                            key="step-1"
                            variants={stepVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.15, ease: 'easeInOut' }}
                        >
                            <form className="flex flex-col gap-2" onSubmit={(event) => {event.preventDefault();}}>
                                <label>
                                    Store Name
                                </label>
                                <Input 
                                    name="name"
                                    value={store.name}
                                    onChange={handleChangeStoreDetails}
                                />
                                <label>
                                    Address
                                </label>
                                <Input 
                                    name="address"
                                    value={store.address}
                                    onChange={handleChangeStoreDetails}
                                />
                                <label>
                                    Email
                                </label>
                                <Input 
                                    name="email"
                                    value={store.email}
                                    onChange={handleChangeStoreDetails}
                                />

                                <DialogClose className="w-full">
                                    <Button className="rounded-md" onClick={handleSubmit}>
                                        Create Store
                                    </Button>
                                </DialogClose>
                            </form>
                        </motion.div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 space-x-2 py-4">
            {storeProfiles.map((item) => {
                return (
                    <Button 
                        variant="outline"
                        className="flex flex-col rounded-md h-[12rem] p-4"
                        onClick={() => handleClick(item)}
                    >
                        
                        <h1 className="text-[2rem] font-bold">{item.store_name}</h1>
                    </Button>
                )
            })}
        </div>
    </div>
    )
}

export default User