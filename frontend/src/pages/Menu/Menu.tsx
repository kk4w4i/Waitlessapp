import { ArrowUpDown, ChevronDown, EyeIcon, MoreHorizontal } from "lucide-react"
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React , { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import Cookies from 'universal-cookie'
import { Input } from "@/components/ui/input"
import MenuItemForm from "./MenuItemForm"
import { PlusCircledIcon } from "@radix-ui/react-icons"
import { Product } from "@/type"
import ProductDrawer from "@/pages/Menu/ProductDrawer"
import { useNavigate } from "react-router-dom"
import { useStore } from "@/hooks/useStore"

function Menu() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const cookies = new Cookies();
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const { storeId, storeUrl } = useStore()
  const [menuItems, setMenuItems] = useState<Product[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditingDialogOpen, setIsEditingDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate()

  const handleDrawerOpen = (product: Product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleEditingOpen = (product: Product| null) => {
    setSelectedProduct(product)
    setIsEditingDialogOpen(true)
  }

  const handleEditingDialogClose = () => {
    setIsEditingDialogOpen(false);
  };

  const columns: ColumnDef<Product>[] = [
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
          textColor = "text-green-600"; 
        } else if (status === "Draft") {
          textColor = "text-red-500";
        } else {
          textColor = "text-gray-500"; 
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
        const product = row.original
   
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 rounded-md hover:bg-accent hover:text-accent-foreground">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleEditingOpen(product)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(product.id)}
              >
                Copy product ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDrawerOpen(product)}
              >
                View Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  useEffect(() => {
    const fetchMenuItems = async () => {
      const response = await fetch('/api/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': cookies.get('csrftoken'),
        },
        body: JSON.stringify({ storeId }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data: Product[] = await response.json();
      setMenuItems(data);
    };

    fetchMenuItems();
  }, []);
 
  const table = useReactTable({
    data: menuItems,
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
                <Button variant="secondary" className="md:flex hidden rounded-md gap-2" onClick={() => navigate(`/order/?store=${storeUrl}&table=1`)}>Preview <EyeIcon size={15}/></Button>
                <Button onClick={() => handleEditingOpen(null)} className="md:flex hidden rounded-md gap-2">Create <PlusCircledIcon/></Button>
                <Button onClick={() => handleEditingOpen(null)} className="md:hidden block rounded-md gap-2"><PlusCircledIcon/></Button>
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
                <ProductDrawer
                  isOpen={isDrawerOpen}
                  product={selectedProduct}
                  onClose={handleDrawerClose}
                />
                <MenuItemForm 
                  isOpen={isEditingDialogOpen}
                  editingProduct={selectedProduct}
                  onClose={handleEditingDialogClose}
                />
            </TableBody>
            </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex flex-row space-x-2">
                <Button variant="secondary" className="md:hidden block rounded-md gap-2" onClick={() => navigate(`/order/?store=${storeUrl}&table=1`)}><EyeIcon size={15}/></Button>
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

export default Menu