import { Button } from '@/components/ui/button'
import { useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { useInView } from 'react-intersection-observer';
import { useCookies } from 'react-cookie';

// assets
import Logo from '../assets/waitless-logo.webp'
import HeroPhoto from '../assets/stockphoto/herophoto.webp'
import MenuVideo from '../assets/mp4/Menu.mp4'
import pfp from '../assets/pfp-ph.webp'
import { MenuTagSVG, KitchenTagSVG, LayoutTagSVG, ServingTagSVG } from '@/assets/svgs/HeroSVG'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from '@/hooks/useUser';

function Hero () {
    const [cookies] = useCookies(['csrftoken'])
    const { userId }  = useUser()

    const handleLogout = async () => {
        try {
          const response = await fetch('/api/logout/', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': cookies.csrftoken,
            },
          });
      
          if (response.ok) {
            // Logout successful
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

    const [isVideoVisible, setIsVideoVisible] = useState(false);
    const videoRef = useRef(null);
    const { ref, inView } = useInView({
        threshold: 0.5, 
        triggerOnce: true,
    });

    const ctaMessage = userId ? "Start" : "Let's have a look"

    const ctaUrl = userId ? "/user" : "/demo/menu"

    if (inView && !isVideoVisible) {
        setIsVideoVisible(true);
    }

    return (
        <div className='flex flex-col items-center px-[1rem] md:px-[2rem]'>
            <div
                className="absolute inset-0 h-full w-full bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] md:bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] z-[0]"
            ></div>
            <div className='flex flex-col items-center w-full z-[1]'>
                <header className='flex flex-row md:py-[2rem] md:px-[6rem] justify-between items-center w-full'>
                    <img className='h-[2rem]' src={Logo}></img>
                    {userId ? (
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

                <div className='flex flex-col items-center py-[7rem]'>
                    <div className='flex flex-col items-center text-3xl md:text-7xl font-medium gap-4 md:gap-2 mb-3'>
                        <h1 className="flex items-center">
                            Effortless Service for 
                        </h1>
                        <div className='flex flex-row items-center mt-[-1rem]'>
                            <div className="[text-wrap:balance] bg-clip-text text-primary bg-gradient-to-r from-slate-200/60 to-50% to-slate-200">Your Signature <span className="text-neutral-500 inline-flex flex-col h-[calc(theme(fontSize.3xl)*theme(lineHeight.tight))] md:h-[calc(theme(fontSize.7xl)*theme(lineHeight.tight))] overflow-hidden">
                                <ul className="block animate-text-slide-4 text-left leading-tight [&_li]:block">
                                    <li>Coffee ☕️</li>
                                    <li>Sushi 🍣 </li>
                                    <li>Pizza 🍕 </li>
                                    <li>Salad 🥗</li>
                                    <li aria-hidden="true">Coffee ☕</li>
                                </ul>
                            </span></div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-6 items-center'>
                        <p className='text-[0.7rem] md:text-[1rem] text-center w-[85%] md:w-[60%]'>
                            For restaurants and cafes that are looking to streamline their POS system to be faster and more accurate.
                        </p>
                        <Button className='text-[1rem] px-7 py-6' onClick={() => window.location.href = `${ctaUrl}`}>{ctaMessage}</Button>
                    </div>
                </div>

                <div className='flex flex-col items-center gap-4 pb-[5vh]'>
                    <div className='flex flex-row gap-2 md:gap-4'>
                        <MenuTagSVG /> <LayoutTagSVG /> <ServingTagSVG /> <KitchenTagSVG />
                    </div>
                    <div className='relative'>
                        <img className="w-screen rounded-[20px] md:rounded-[40px] h-[32vh] md:h-[96vh] object-cover" src={HeroPhoto}></img>
                        <div ref={ref} className='absolute top-10 left-1/2 -translate-x-1/2 w-[90%]'>
                            <div style={{ borderRadius: '20px', overflow: 'hidden' }}>
                                <ReactPlayer
                                ref={videoRef}
                                url={MenuVideo}
                                playing={isVideoVisible}
                                width="100%"
                                height="100%"
                                controls
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            

            <div>

            </div>
        </div>
    )
}

export default Hero