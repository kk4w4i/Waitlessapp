import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
    PlusCircledIcon
} from "@radix-ui/react-icons"
 
const data: Product[] = [
    {
        id: "a76d9f8b-2f6d-4e3c-b7d8-8e7d9f6e5d1a",
        price: 12.99,
        category: "Sushi",
        status: "Published",
        name: "California Roll"
    },
    {
        id: "e3c7b6d8-a9f6-4d1e-b2d9-f3e7c9b2d5e6",
        price: 18.75,
        category: "Main",
        status: "Published",
        name: "Grilled Salmon"
    },
    {
        id: "f7a6d3c2-b9e8-4f1d-a2e3-c5d7e6f8d9b1",
        price: 6.25,
        category: "Small Dish",
        status: "Draft",
        name: "Edamame"
    },
    {
        id: "c8d7e6f9-b1a2-4e3c-b5d8-a9f6d1e2b3d4",
        price: 7.50,
        category: "Dessert",
        status: "Published",
        name: "Mochi Ice Cream"
    },
    {
        id: "b9e8f1d2-a3e5-4c7d-b6d8-a9f6d1e2b3d4",
        price: 22.99,
        category: "Main",
        status: "Published",
        name: "Beef Teriyaki"
    },
    {
        id: "d2a3e5c7-d6b8-4a9f-b1e2-d3c4b5d8e6f9",
        price: 4.99,
        category: "Soup",
        status: "Draft",
        name: "Miso Soup"
    },
    {
        id: "e5c7d6b8-a9f6-4d1e-b2d9-f3e7c9b2d5e6",
        price: 9.25,
        category: "Share",
        status: "Published",
        name: "Gyoza"
    },
    {
        id: "b8a9f6d1-e2d9-4f3e-b7c9-b2d5e6f8d9b1",
        price: 16.50,
        category: "Main",
        status: "Published",
        name: "Chicken Katsu"
    },
    {
        id: "f6d1e2d9-f3e7-4c9b-b2d5-e6f8d9b1a2e3",
        price: 5.75,
        category: "Small Dish",
        status: "Draft",
        name: "Seaweed Salad"
    },
    {
        id: "d1e2d9f3-e7c9-4b2d-b5e6-f8d9b1a2e3c5",
        price: 8.99,
        category: "Dessert",
        status: "Published",
        name: "Green Tea Ice Cream"
    },
    {
        id: "e2d9f3e7-c9b2-4d5e-b6f8-d9b1a2e3c5d7",
        price: 3.25,
        category: "Soup",
        status: "Published",
        name: "Egg Drop Soup"
    },
    {
        id: "d9f3e7c9-b2d5-4e6f-b8d9-b1a2e3c5d7e6",
        price: 11.75,
        category: "Share",
        status: "Draft",
        name: "Vegetable Tempura"
    },
    {
        id: "f3e7c9b2-d5e6-4f8d-b9b1-a2e3c5d7e6f9",
        price: 14.25,
        category: "Main",
        status: "Published",
        name: "Vegetable Curry"
    },
    {
        id: "e7c9b2d5-e6f8-4d9b-b1a2-e3c5d7e6f9b1",
        price: 6.99,
        category: "Small Dish",
        status: "Published",
        name: "Cucumber Sunomono"
    },
    {
        id: "c9b2d5e6-f8d9-4b1a-b2e3-c5d7e6f9b1a2",
        price: 10.50,
        category: "Share",
        status: "Published",
        name: "Yakitori"
    }
]

export type Product = {
  id: string
  price: number
  category: "Sushi" | "Main" | "Small Dish" | "Dessert" | "Main" | "Soup" | "Share"
  status: "Published" | "Draft"
  name: string
}
 
export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="w-[10rem] md:w-auto capitalize pl-4 text-left">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return (
        <div className="flex w-[6rem] md:w-auto">
            <div className={`capitalize text-left rounded-full py-1 px-3 text-white bg-primary`}>
                {row.getValue("category")}
            </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      let textColor;
  
      if (status === "Published") {
        textColor = "text-green-600"; // Tailwind CSS class for green text
      } else if (status === "Draft") {
        textColor = "text-red-500"; // Tailwind CSS class for red text
      } else {
        textColor = "text-gray-500"; // Tailwind CSS class for gray text
      }
  
      return (
        <div className={`capitalize text-left ${textColor}`}>
          {row.getValue("status")}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: () => <div className="">Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"))
 
      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
 
      return <div className="text-left">{formatted}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 rounded-md hover:bg-accent hover:text-accent-foreground">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
 
function MenuDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
 
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })
 
  return (
    <div className="flex flex-col w-full px-[1rem] md:px-[2rem]">
        <div className="flex flex-col md:flex-row justify-between items:start md:items-end py-4">
            <div className="flex flex-col items-start">
                <span className="flex flex-row items-center gap-2 text-[3rem] font-bold">Store Menu</span>
                <p className="text-neutral-500">Create, edit or delete your items here</p>
            </div>
            <div className="flex items-center gap-1 md:gap-4 mt-2 md:mt-0">
                <Input
                placeholder="Filter product names..."
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="w-[20rem]"
                />
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="rounded-md hover:bg-accent hover:text-accent-foreground">
                    Columns <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                        return (
                        <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                            }
                        >
                            {column.id}
                        </DropdownMenuCheckboxItem>
                        )
                    })}
                </DropdownMenuContent>
                </DropdownMenu>
                <Button className="md:flex hidden rounded-md gap-2">Create <PlusCircledIcon/></Button>
                <Button className="md:hidden block rounded-md gap-2"><PlusCircledIcon/></Button>
            </div>
        </div>
        <div className="rounded-md border">
            <Table>
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                    return (
                        <TableHead key={header.id}>
                        {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                            )}
                        </TableHead>
                    )
                    })}
                </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                    <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    >
                    {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                        {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                        )}
                        </TableCell>
                    ))}
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                    >
                    No results.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    </div>
  )
}

export default MenuDemo