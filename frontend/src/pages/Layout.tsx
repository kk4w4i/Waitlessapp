import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom'
import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import { useStore } from '@/hooks/useStore';
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
import Cookies from 'universal-cookie';

interface DraggableComponentProps {
    id: number;
    xLength: number;
    yLength: number;
    onStop?: (id: number, x: number, y: number) => void;
    onResize?: (id: number, width: number, height: number) => void;
    onRemove?: (id: number) => void;
    position: { x: number; y: number };
}

export type Table = {
    positionX: number
    positionY: number
    width: number
    length: number
    tableNumber: number
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ id, onRemove, position, onStop, onResize, xLength, yLength }) => {
    const [width, setWidth] = useState(xLength);
    const [height, setHeight] = useState(yLength);
    const [isResizable, setIsResizable] = useState(false);
    const componentRef = useRef<HTMLDivElement>(null);
  
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
            <Draggable
                grid={[40, 40]}
                handle='.draggable-handle'
                defaultPosition={position}
                onStop={(_e, data) => {
                    if (onStop) {
                    onStop(id, data.x, data.y);
                    }
                }}
            >
                <ResizableBox
                    width={width}
                    height={height}
                    resizeHandles={isResizable ? ['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne'] : []}
                    onResize={(_event, { size }) => {
                        setWidth(size.width);
                        setHeight(size.height);
                        if (onResize) {
                          onResize(id, size.width, size.height);
                        }
                    }}
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
    const [tables, setTables] = useState<Table[]>([]);
    const { storeId } = useStore()
    const cookies = new Cookies();
    const [nextIndex, setNextIndex] = useState<number>(0)

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await fetch(`/api/get-seating-layout/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': cookies.get('csrftoken'),
                    },
                    body: JSON.stringify({ storeId }),
                });
                if (response.ok) {
                    const data = await response.json();
                    data.tables.forEach((table: { table_number: any; position_x: string; position_y: string; width: string; height: string; }) => {
                        const transformedData = {
                            tableNumber: table.table_number,
                            positionX: parseFloat(table.position_x),
                            positionY: parseFloat(table.position_y),
                            width: parseFloat(table.width),
                            length: parseFloat(table.height)
                        };
                        handleAddComponent(transformedData.width, transformedData.length, transformedData.positionX, transformedData.positionY, transformedData.tableNumber);
                    });
                } else {
                    console.error('Failed to fetch tables');
                }
            } catch (error) {
                console.error('Error fetching tables:', error);
            }
        };
    
        fetchTables();
    }, [storeId]);

    

    const handleDragStop = (id: number, x: number, y: number) => {
        setTables(tables.map(table => {
          if (table.tableNumber === id) {
            return { ...table, positionX: x, positionY: y };
          }
          return table;
        }));
      };
      
      const handleResize = (id: number, width: number, length: number) => {
        setTables(tables.map(table => {
          if (table.tableNumber === id) {
            return { ...table, width, length };
          }
          return table;
        }));
      };
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const handleAddComponent = (width: number, length: number, positionX: number | null, positionY: number | null, tableNumber: number) => {
        const startPositionX = positionX ?? windowWidth / 2.05;
        const startPositionY = positionY ?? windowHeight / 4;
        
        setNextIndex(tableNumber + 1)
    
        setComponents(prevComponents => [
            ...prevComponents,
            {
                id: tableNumber,
                position: { x: startPositionX, y: startPositionY },
                xLength: width,
                yLength: length
            },
        ]);
    
        setTables(prevTables => [
            ...prevTables,
            {
                positionX: startPositionX,
                positionY: startPositionY,
                width: width,
                length: length, 
                tableNumber: tableNumber, 
            },
        ]);
    };

    const handleRemoveComponent = (id: number) => {
        setNextIndex(id)
        setComponents(components.filter((component) => component.id !== id));
        setTables(tables.filter((table) => table.tableNumber !== id));
    };

    const handleSubmit = async (store_id: string | null) => {  
        try {
          const response = await fetch('/api/create-layout/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': cookies.get('csrftoken'),
            },
            body: JSON.stringify({ tables, store_id }),
          });
      
          if (response.ok) {
            console.log(`Layout created`);
          } else {
            console.error('Failed to create layout');
          }
        } catch (error) {
          console.error('Error:', error);
        }
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
                        <Button className='rounded-md' onClick={() => handleSubmit(storeId)}>Save</Button>
                    </div>
                </div>

               
        
                <Button onClick={() => handleAddComponent(40, 40, null, null, nextIndex)} className="fixed bottom-[5vh] left-1/2 -translate-x-1/2 size-[4rem] drop-shadow-lg z-[1]">
                <PlusIcon />
                </Button>
                {components.map((component) => (
                        <DraggableComponent
                            key={component.id}
                            id={component.id}
                            onRemove={handleRemoveComponent}
                            onStop={handleDragStop}
                            onResize={handleResize}
                            position={component.position} 
                            xLength={component.xLength} 
                            yLength={component.yLength}                      />
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

 