import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom'
import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import {
    PlusIcon,
    TransformIcon,
    TrashIcon
} from '@radix-ui/react-icons'

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface DraggableComponentProps {
  id: number;
  onStop?: (e: MouseEvent | TouchEvent) => void;
  onRemove?: (id: number) => void;
  position: { x: number; y: number };
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ id, onRemove, position }) => {
    const [width, setWidth] = useState(40);
    const [height, setHeight] = useState(40);
    const [isResizable, setIsResizable] = useState(false);
    const componentRef = useRef<HTMLDivElement>(null);
  
    const onResize = (_event: any, { size }: any) => {
      setWidth(size.width);
      setHeight(size.height);
    };
  
    const handleTransform = () => {
      setIsResizable(!isResizable);
    };
  
    const handleRemove = () => {
        if (onRemove) {
            onRemove(id);
        }
    };
  
    const handleClickOutside = (event: MouseEvent) => {
      if (isResizable && componentRef.current && !componentRef.current.contains(event.target as Node)) {
        setIsResizable(false);
      }
    };
  
    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isResizable]);
  
    return (
        <div
          ref={componentRef}
          className='absolute'
        >
            <Draggable grid={[40, 40]} handle='.draggable-handle' defaultPosition={position}>
                <ResizableBox
                width={width}
                height={height}
                resizeHandles={isResizable ? ['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne'] : []}
                onResize={onResize}
                lockAspectRatio={false}
                >
                <TooltipProvider>
                    <Tooltip>
                    <TooltipTrigger>
                        <div
                        className="flex items-center justify-center bg-primary text-white rounded-md draggable-handle"
                        style={{ width: `${width}px`, height: `${height}px` }}
                        >
                        {id}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div>
                            <Button variant="ghost" className="rounded-sm hover:bg-accent hover:text-accent-foreground px-3" onClick={handleTransform}>
                                <TransformIcon />
                            </Button>
                            <Button variant="ghost" className="rounded-sm hover:bg-accent hover:text-accent-foreground px-3" onClick={handleRemove}>
                                <TrashIcon />
                            </Button>
                        </div>
                    </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                </ResizableBox>
            </Draggable>
        </div>
    );
  };

  function Layout() {
    const [components, setComponents] = useState<DraggableComponentProps[]>([]);

    const handleAddComponent = () => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const centerX = windowWidth / 2.05;
        const centerY = windowHeight / 4;
    
        setComponents([
          ...components,
          {
            id: components.length,
            position: { x: centerX, y: centerY },
          },
        ]);
      };

    const handleRemoveComponent = (id: number) => {
        setComponents(components.filter((component) => component.id !== id));
    };

  
    return (
        <div>
            <div className="inset-0 h-[90vh] w-full bg-white bg-[radial-gradient(#D0D0D0_1px,transparent_1px)] [background-size:20px_20px] z-[0] relative hidden md:block">
                <div className="relative flex flex-row justify-between items-center px-[2rem] py-4 w-full z-[2]">
                    <div>
                        <span className="flex flex-row items-center gap-2 text-[3rem] font-bold">Store Layout</span>
                        <p className="text-neutral-500">Customise the layout of the store</p>
                    </div>
                    <div className='flex flex-row gap-2'>
                        <Button variant="outline" className='rounded-md'>Print QR codes</Button>
                        <Button className='rounded-md'>Save</Button>
                    </div>
                </div>
        
                <Button onClick={handleAddComponent} className="fixed bottom-[5vh] left-1/2 -translate-x-1/2 size-[4rem] drop-shadow-lg z-[1]">
                <PlusIcon />
                </Button>
                {components.map((component) => (
                        <DraggableComponent
                            key={component.id}
                            id={component.id}
                            onRemove={handleRemoveComponent}
                            position={component.position}
                        />
                    ))}
            </div>
            <div className='absolute block md:hidden left-1/2 -translate-x-1/2 text-center top-1/2 -translate-y-1/2 text-neutral-400'>
                This feature requires a larger screen display checkout the <Link to="/" className="underline">
                    demo
                </Link> video instead
            </div>
        </div>
      
    );
  }


  export default Layout