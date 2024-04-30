import { useState, useEffect } from 'react'
import Logo from '../assets/waitless-logo.webp'
import pfp from '../assets/pfp-ph.webp'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/hooks/useStore'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'

function Navbar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { storeUrl } = useStore()
    const [isVisible, setIsVisible] = useState(true);
    const token = localStorage.getItem('access-token') !== null

    const menuPage = {
        '^/menu/.*': true,
        '/demo/menu': true
    }

    const layoutPage = {
        '^/layout/.*': true,
        '/demo/layout': true
        
    }

    const servePage = {
        '^/serving/.*': true,
        '/demo/serving': true
    }

    const kitchenPage = {
        '^/kitchen/.*': true,
        '/demo/kitchen': true
    }

    const appPagesObj = {
        ...menuPage,
        ...layoutPage,
        ...servePage,
        ...kitchenPage,
    };

    function checkMenu(pathname: string): boolean {
        for (const pattern of Object.keys(menuPage)) {
            const regex = new RegExp(pattern);
            
            if (regex.test(pathname)) {
                return true;
            }
        }
        return false;
    }

    function checkLayout(pathname: string): boolean {
        for (const pattern of Object.keys(layoutPage)) {
            const regex = new RegExp(pattern);
            
            if (regex.test(pathname)) {
                return true;
            }
        }
        return false;
    }

    function checkServe(pathname: string): boolean {
        for (const pattern of Object.keys(servePage)) {
            const regex = new RegExp(pattern);
            
            if (regex.test(pathname)) {
                return true;
            }
        }
        return false;
    }

    function checkKitchen(pathname: string): boolean {
        for (const pattern of Object.keys(kitchenPage)) {
            const regex = new RegExp(pattern);
            
            if (regex.test(pathname)) {
                return true;
            }
        }
        return false;
    }
    
    function checkPath(pathname: string): boolean {
        for (const pattern in appPagesObj) {
            const regex = new RegExp(pattern);
            
            if (regex.test(pathname)) {
                return true; 
            }
        }
        return false; 
    }    

    const appPages = checkPath(location.pathname)

    const menuUrl =  token ? `/menu/${storeUrl}` : "/demo/menu"
    const layoutUrl =  token ? `/layout/${storeUrl}` : "/demo/layout"
    const serveUrl =  token ? `/serving/${storeUrl}` : "/demo/serving"
    const kitchenUrl =  token ? `/kitchen/${storeUrl}` : "/demo/kitchen" 

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
            navigate('/');
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
                <img onClick={() => navigate('/')} className="h-[1.8rem]" src={Logo}></img>
                <div className='absolute left-1/2 -translate-x-1/2 flex flex-row gap-4 md:block hidden'>
                    <Button 
                        className={checkMenu(location.pathname) ?  "font-bold" : "font-light"} 
                        variant="ghost"
                        onClick={() => navigate(menuUrl)}
                    >
                        Menu
                    </Button>
                    <Button 
                        className={checkLayout(location.pathname) ? "font-bold" : "font-light"}
                        variant="ghost"
                        onClick={() => navigate(layoutUrl)}
                    >
                        Layout
                    </Button>
                    <Button 
                        className={checkServe(location.pathname) ? "font-bold" : "font-light"} 
                        variant="ghost"
                        onClick={() => navigate(serveUrl)}
                    >
                        Serve
                    </Button>
                    <Button 
                        className={checkKitchen(location.pathname) ? "font-bold" : "font-light"}
                        variant="ghost"
                        onClick={() => navigate(kitchenUrl)}
                    >
                        Kitchen
                    </Button>
                </div>
                <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-row gap-2 md:hidden block bg-white z-[50] p-2 drop-shadow-lg transition-opacity ease-in duration-600 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                    <Button 
                        className={`rounded-md ${checkMenu(location.pathname) ? "font-bold bg-primary" : "font-light text-primary bg-secondary"}`} 
                        onClick={() => navigate(menuUrl)}
                    >
                        Menu
                    </Button>
                    <Button 
                        className={`rounded-md ${checkLayout(location.pathname) ? "font-bold bg-primary" : "font-light text-primary bg-secondary"}`} 
                        onClick={() => navigate(layoutUrl)}
                    >
                        Layout
                    </Button>
                    <Button 
                        className={`rounded-md ${checkServe(location.pathname) ? "font-bold bg-primary" : "font-light text-primary bg-secondary"}`} 
                        onClick={() => navigate(serveUrl)}
                    >
                        Serve
                    </Button>
                    <Button 
                        className={`rounded-md ${checkKitchen(location.pathname) ? "font-bold bg-primary" : "font-light text-primary bg-secondary"}`} 
                        onClick={() => navigate(kitchenUrl)}
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
                    <Button onClick={() => navigate('/signin')} className="text-[0.7rem] md:text-[0.8rem]" variant="outline">Sign in</Button>
                )}
                
            </div>
        )
    )
}

export default Navbar