import { useState, useEffect } from 'react'
import Logo from '../assets/waitless-logo.webp'
import pfp from '../assets/pfp-ph.webp'
import { useLocation } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'

function Navbar() {
    const location = useLocation()
    const [isVisible, setIsVisible] = useState(true);
    const token = localStorage.getItem('access-token') !== null

    const appPagesObj = {
        '/menu/': true, 
        '/layout/': true,
        '/serving/': true,
        '/kitchen/': true,
        '/demo/menu/': true, 
        '/demo/layout/': true,
        '/demo/serving/': true,
        '/demo/kitchen/': true
      };
      
    type AppPages = typeof appPagesObj;
      
    const appPages = appPagesObj[location.pathname as keyof AppPages]; [1][2]

    const urlHead =  token ? "/" : "/demo/"

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

    const handleLogout = async () => {
        try {
          const response = await fetch('/api/logout/', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          if (response.ok) {
            // Logout successful
            localStorage.removeItem('access-token');
            window.location.href = '/';
          } else {
            // Logout failed
            const data = await response.json();
            console.error('Logout failed:', data.detail);
            // Handle the error, show an error message, etc.
          }
        } catch (error) {
          console.error('Logout error:', error);
          // Handle any network or other errors
        }
      };

    return (
        appPages && (
            <div className='flex flex-row justify-between items-center pb-[1rem] md:pb-[2rem] md:pt-[1rem] border-b px-[1rem] md:px-[2rem] z-[50]'>
                <img onClick={() => window.location.href = '/'} className="h-[1.8rem]" src={Logo}></img>
                <div className='absolute left-1/2 -translate-x-1/2 flex flex-row gap-4 md:block hidden'>
                    <Button 
                        className={`${location.pathname === `${urlHead}menu/` ? "font-bold" : "font-light"}`} 
                        variant="ghost"
                        onClick={() => window.location.href = `${urlHead}menu/`}
                    >
                        Menu
                    </Button>
                    <Button 
                        className={`${location.pathname === `${urlHead}layout/` ? "font-bold" : "font-light"}`} 
                        variant="ghost"
                        onClick={() => window.location.href = `${urlHead}layout/`}
                    >
                        Layout
                    </Button>
                    <Button 
                        className={`${location.pathname === `${urlHead}serving/` ? "font-bold" : "font-light"}`} 
                        variant="ghost"
                        onClick={() => window.location.href = `${urlHead}serving/`}
                    >
                        Serve
                    </Button>
                    <Button 
                        className={`${location.pathname === `${urlHead}kitchen/` ? "font-bold" : "font-light"}`} 
                        variant="ghost"
                        onClick={() => window.location.href = `${urlHead}kitchen/`}
                    >
                        Kitchen
                    </Button>
                </div>
                <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-row gap-2 md:hidden block bg-white z-[50] p-2 drop-shadow-lg transition-opacity ease-in duration-600 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                    <Button 
                        className={`rounded-md ${location.pathname === `${urlHead}menu/` ? "font-bold bg-primary" : "font-light text-primary bg-secondary"}`} 
                        onClick={() => window.location.href = `${urlHead}menu/`}
                    >
                        Menu
                    </Button>
                    <Button 
                        className={`rounded-md ${location.pathname === `${urlHead}layout/` ? "font-bold bg-primary" : "font-light text-primary bg-secondary"}`} 
                        onClick={() => window.location.href = `${urlHead}layout/`}
                    >
                        Layout
                    </Button>
                    <Button 
                        className={`rounded-md ${location.pathname === `${urlHead}serving/` ? "font-bold bg-primary" : "font-light text-primary bg-secondary"}`} 
                        onClick={() => window.location.href = `${urlHead}serving/`}
                    >
                        Serve
                    </Button>
                    <Button 
                        className={`rounded-md ${location.pathname === `${urlHead}kitchen/` ? "font-bold bg-primary" : "font-light text-primary bg-secondary"}`} 
                        onClick={() => window.location.href = `${urlHead}kitchen/`}
                    >
                        Kitchen
                    </Button>
                </div>
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
                    <Button onClick={() => window.location.href = '/signin'} className="text-[0.7rem] md:text-[0.8rem]" variant="outline">Sign in</Button>
                )}
                
            </div>
        )
    )
}

export default Navbar