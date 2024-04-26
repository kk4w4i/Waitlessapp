import { Button } from "@/components/ui/button";
import { differenceInMinutes } from 'date-fns';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress";
import { ChevronRightIcon } from "@radix-ui/react-icons";

const orders: Order[] = [
    {
      id: '1',
      status: 'Cooking',
      orderTime: '2024-04-06T16:45:56Z',
      table: "4",
      productCount: 11,
      completedOrderCount: 0,
      orderType: 'Dine in',
    },
    {
      id: '2',
      status: 'Cooking',
      orderTime: '2024-04-06T17:02:33Z',
      table: "T",
      productCount: 5,
      completedOrderCount: 3,
      orderType: 'Takeaway',
    },
    {
      id: '3',
      status: 'Cooking',
      orderTime: '2024-04-06T16:55:00Z',
      table: "2",
      productCount: 8,
      completedOrderCount: 0,
      orderType: 'Dine in',
    },
    {
      id: '4',
      status: 'Ready to serve',
      orderTime: '2024-04-06T16:50:12Z',
      table: "10",
      productCount: 3,
      completedOrderCount: 3,
      orderType: 'Dine in',
    },
    {
      id: '5',
      status: 'Cooking',
      orderTime: '2024-04-06T17:00:00Z',
      table: "T",
      productCount: 7,
      completedOrderCount: 2,
      orderType: 'Takeaway',
    },
    {
      id: '6',
      status: 'Ready to serve',
      orderTime: '2024-04-06T17:01:30Z',
      table: "9",
      productCount: 4,
      completedOrderCount: 4,
      orderType: 'Dine in',
    },
  ];
  
  export type Order = {
    id: string
    status: "Cooking" | "Ready to serve"
    orderTime: string
    table: string
    productCount: number
    completedOrderCount: number
    orderType: "Dine in" | "Takeaway"
  }

  export type Table = {
    id: number;
    width: number;
    height: number;
    positionx: number;
    positiony: number;
    status: "Default" | "Assist" | "Bill"
  };
  
  const tables: Table[] = [
    { id: 1, width: 40, height: 40, positionx: 10, positiony: 10, status: "Default" },
    { id: 2, width: 40, height: 100, positionx: 10, positiony: 30, status: "Bill" },
    { id: 3, width: 40, height: 40, positionx: 10, positiony: 50, status: "Default" },
    { id: 4, width: 40, height: 100, positionx: 10, positiony: 70, status: "Bill" },
    { id: 5, width: 40, height: 40, positionx: 10, positiony: 90, status: "Default" },
    { id: 6, width: 40, height: 100, positionx: 30, positiony: 10, status: "Assist" },
    { id: 7, width: 40, height: 40, positionx: 30, positiony: 30, status: "Default" },
    { id: 8, width: 40, height: 100, positionx: 30, positiony: 50, status: "Assist" },
    { id: 9, width: 40, height: 40, positionx: 30, positiony: 70, status: "Default" },
    { id: 10, width: 40, height: 100, positionx: 30, positiony: 90, status: "Default" },
    { id: 12, width: 40, height: 100, positionx: 50, positiony: 10, status: "Default" },
    { id: 13, width: 40, height: 100, positionx: 50, positiony: 30, status: "Assist" },
    { id: 14, width: 40, height: 100, positionx: 50, positiony: 50, status: "Default" },
    { id: 15, width: 40, height: 100, positionx: 50, positiony: 70, status: "Bill" },
    { id: 16, width: 40, height: 100, positionx: 50, positiony: 90, status: "Default" },
    { id: 17, width: 100, height: 40, positionx: 70, positiony: 10, status: "Bill" },
    { id: 18, width: 100, height: 40, positionx: 70, positiony: 40, status: "Default" },
    { id: 19, width: 100, height: 40, positionx: 70, positiony: 70, status: "Default" },
    { id: 20, width: 100, height: 40, positionx: 70, positiony: 100, status: "Default" },
    { id: 21, width: 100, height: 40, positionx: 100, positiony: 25, status: "Assist" },
    { id: 22, width: 100, height: 40, positionx: 100, positiony: 55, status: "Default" },
    { id: 23, width: 100, height: 40, positionx: 100, positiony: 85, status: "Default" },
  ];
  
  function Serving() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 py-4 px-[1rem] md:px-[2rem] md:gap-4">
        <div className="flex flex-col col-span-2 gap-4">
            <div className="relative flex flex-row items-center w-full z-[2]">
            <div>
                <span className="flex flex-row items-center gap-2 text-[3rem] font-bold">Serve</span>
                <p className="text-neutral-500">Keep track of orders and seating vacancies</p>
            </div>
            </div>
            <div className="relative h-[75vh] w-full border rounded-md p-10 md:block hidden">
            {tables.map((table) => (
                <div
                key={table.id}
                className={`absolute flex items-center justify-center rounded-md ${
                    table.status === "Default" ? "bg-white text-primary border" : "bg-primary text-white"
                }`}
                style={{
                    width: `${table.width}px`,
                    height: `${table.height}px`,
                    left: `${(table.positionx / 100) * (100 - 20)}%`,
                    top: `${(table.positiony / 100) * (100 - 20)}%`,
                }}
                >
                {table.id}
                </div>
            ))}
            <div className="absolute bottom-5 right-10 flex flex-row gap-6">
                <div className="flex flex-row gap-2 items-center">
                    <div className="bg-primary h-4 w-4 rounded-md"></div>Assistance!
                </div>
            </div>
            </div>
        </div>
            <ScrollArea className="relative h-[62vh] md:h-[85vh] w-full rounded-md border p-4 mt-5 md:mt-0">
                <h1 className="sticky top-0 bg-white text-[2rem] font-bold pb-[1rem] z-[2]">Orders</h1>
                <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                    <Card key={order.id}>
                        <CardHeader className="flex flex-row justify-between border-b py-4 items-top">
                        <div>
                            <CardTitle className="text-[1.2rem]">Order {order.id}</CardTitle>
                            <span className="text-neutral-500">{order.orderType} - Table {order.table}</span>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <div className={`w-2 h-2 rounded-full ${order.status === 'Cooking' ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                            <p className="text-[0.89rem]">{order.status}</p>
                        </div>
                        </CardHeader>
                        <CardContent className="flex flex-col">
                        <div className="flex py-4 gap-4">
                            <Button className="w-full rounded-md py-6">
                            {order.productCount} items <ChevronRightIcon />
                            </Button>
                            <Button variant="outline" className="w-full rounded-md py-6">
                            Complete Order
                            </Button>
                        </div>
                        <div className="flex flex-row gap-4 items-center justify-between">
                            <Progress className="h-[0.6rem] w-[70%]" value={100 * (order.completedOrderCount / order.productCount)} />
                            <p className="text-neutral-500 text-[0.8rem]">{formatOrderTime(order.orderTime)}</p>
                        </div>
                        </CardContent>
                    </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
  }
  
  const formatOrderTime = (orderTime: string): string => {
    const minutesSinceOrder = differenceInMinutes(new Date(), new Date(orderTime));
    return `${minutesSinceOrder} minute(s) ago`;
  };
  
  export default Serving;