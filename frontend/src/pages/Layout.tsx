import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom'
import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import { useStore } from '@/hooks/useStore';
import QRCode from 'qrcode';
import CreatePDF from '@/utils/CreatePDF';

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

import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog"

interface DraggableComponentProps {
    id: number;
    displayIndex: number
    xLength: number;
    yLength: number;
    onStop?: (displayIndex: number, x: number, y: number) => void;
    onResize?: (displayIndex: number, width: number, height: number) => void;
    onRemove?: (displayIndex: number) => void;
    position: { x: number; y: number };
}

export type Table = {
    positionX: number
    positionY: number
    width: number
    length: number
    tableNumber: number
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ displayIndex, onRemove, position, onStop, onResize, xLength, yLength }) => {
    const [width, setWidth] = useState(xLength);
    const [height, setHeight] = useState(yLength);
    const [isResizable, setIsResizable] = useState(false);
    const componentRef = useRef<HTMLDivElement>(null);
  
    const handleTransform = () => {
      setIsResizable(!isResizable);
    };
  
    const handleRemove = () => {
        if (onRemove) {
            onRemove(displayIndex);
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
                    onStop(displayIndex, data.x, data.y);
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
                          onResize(displayIndex, size.width, size.height);
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
                        {displayIndex}
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
    const { storeId, storeUrl } = useStore()
    const cookies = new Cookies();

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

    const createQR = async (url: string, tableNumber: number): Promise<string> => {
        const fullUrl = `${url}&table=${tableNumber}`;
        try {
          const qrCodeDataUri = await QRCode.toDataURL(fullUrl);
          return qrCodeDataUri;
        } catch (error) {
          console.error('Error generating QR code:', error);
          return '';
        }
      };

    const [qrCodes, setQrCodes] = useState<string[]>([]);
    const url = `http://127.0.0.1:8000/order/?store=${storeUrl}`;
    const totalTables = tables.length;

    const printQRs = async () => {
        const codes = [];
        for (let i = 1; i <= totalTables; i++) {
            const code = await createQR(url, i);
            codes.push(code);
        }
        setQrCodes(codes);
    };
      

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
    
        setComponents(prevComponents => [
            ...prevComponents,
            {
                id: tableNumber,
                displayIndex: tableNumber,
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

    const handleRemoveComponent = (removeId: number) => {
        const filteredComponents = components.filter((component) => component.displayIndex !== removeId);
        const filteredTables = tables.filter((table) => table.tableNumber !== removeId);
    
        const updatedComponents = filteredComponents.map((component) => {
            if (component.displayIndex > removeId) {
                return { ...component, displayIndex: component.displayIndex - 1 };
            }
            return component;
        });
    
        const updatedTables = filteredTables.map((table) => {
            if (table.tableNumber > removeId) {
                return { ...table, tableNumber: table.tableNumber - 1 };
            }
            return table;
        });
    
        setComponents(updatedComponents);
        setTables(updatedTables);
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
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className='rounded-md' onClick={() => printQRs()}>Print QR codes</Button>
                        </DialogTrigger>
                        <DialogContent className='w-[80%]'>
                            {qrCodes.length > 0 && <CreatePDF qrCodes={qrCodes} />}
                        </DialogContent>
                    </Dialog>
                        <Button className='rounded-md' onClick={() => handleSubmit(storeId)}>Save</Button>
                    </div>
                </div>
                <Button onClick={() => handleAddComponent(40, 40, null, null, components.length)} className="fixed bottom-[5vh] left-1/2 -translate-x-1/2 size-[4rem] drop-shadow-lg z-[1]">
                <PlusIcon />
                </Button>
                {components.map((component) => (
                        <DraggableComponent
                            key={component.id}
                            id={component.id}
                            displayIndex={component.displayIndex}
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

 