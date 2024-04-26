import { useState, useEffect } from 'react'
import Logo from '../assets/waitless-logo.webp'
import pfp from '../assets/pfp-ph.webp'
import { useLocation } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from './ui/button'

function Navbar() {
    const location = useLocation()
    const [isVisible, setIsVisible] = useState(true);

    const appPagesObj = {
        '/menu/': true, 
        '/layout/': true,
        '/serving/': true,
        '/kitchen/': true
      };
      
    type AppPages = typeof appPagesObj;
      
    const appPages = appPagesObj[location.pathname as keyof AppPages]; [1][2]

    useEffect(() => {
        const handleScroll = () => {
          const scrollPosition = window.innerHeight + window.scrollY;
          const documentHeight = document.documentElement.scrollHeight;
    
          if (scrollPosition >= documentHeight) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
    }, []);
      

    return (
        appPages && (
            <div className='flex flex-row justify-between items-center pb-[1rem] md:pb-[2rem] md:pt-[1rem] border-b px-[1rem] md:px-[2rem] z-[50]'>
                <img onClick={() => window.location.href = '/'} className="h-[1.8rem]" src={Logo}></img>
                <div className='absolute left-1/2 -translate-x-1/2 flex flex-row gap-4 md:block hidden'>
                    <Button 
                        className={`${location.pathname === '/menu/' ? "font-bold" : "font-light"}`} 
                        variant="ghost"
                        onClick={() => window.location.href = '/menu'}
                    >
                        Menu
                    </Button>
                    <Button 
                        className={`${location.pathname === '/layout/' ? "font-bold" : "font-light"}`} 
                        variant="ghost"
                        onClick={() => window.location.href = '/layout'}
                    >
                        Layout
                    </Button>
                    <Button 
                        className={`${location.pathname === '/serving/' ? "font-bold" : "font-light"}`} 
                        variant="ghost"
                        onClick={() => window.location.href = '/serving'}
                    >
                        Serve
                    </Button>
                    <Button 
                        className={`${location.pathname === '/kitchen/' ? "font-bold" : "font-light"}`} 
                        variant="ghost"
                        onClick={() => window.location.href = '/kitchen'}
                    >
                        Kitchen
                    </Button>
                </div>
                <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-row gap-2 md:hidden block bg-white z-[50] p-2 drop-shadow-lg transition-opacity ease-in duration-600 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                    <Button 
                        className={`rounded-md ${location.pathname === '/menu/' ? "font-bold bg-primary" : "font-light text-primary bg-secondary"}`} 
                        onClick={() => window.location.href = '/menu'}
                    >
                        Menu
                    </Button>
                    <Button 
                        className={`rounded-md ${location.pathname === '/layout/' ? "font-bold bg-primary" : "font-light text-primary bg-secondary"}`} 
                        onClick={() => window.location.href = '/layout'}
                    >
                        Layout
                    </Button>
                    <Button 
                        className={`rounded-md ${location.pathname === '/serving/' ? "font-bold bg-primary" : "font-light text-primary bg-secondary"}`} 
                        onClick={() => window.location.href = '/serving'}
                    >
                        Serve
                    </Button>
                    <Button 
                        className={`rounded-md ${location.pathname === '/kitchen/' ? "font-bold bg-primary" : "font-light text-primary bg-secondary"}`} 
                        onClick={() => window.location.href = '/kitchen'}
                    >
                        Kitchen
                    </Button>
                </div>
                <Avatar>
                    <AvatarImage src={pfp} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
        )
    )
}

export default Navbar