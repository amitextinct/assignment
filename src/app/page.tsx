"use client";
import { useToast } from "@/hooks/use-toast"
import { useCallback } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import {
  NavigationMenu,
  // NavigationMenuContent,
  // NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuList,
  // NavigationMenuLink,
  // NavigationMenuTrigger,
  // NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type categories = {
  value: string;
  label: string;
};

const categories: categories[] = [
  {
    value: "groceries",
    label: "groceries",
  },
  {
    value: "food",
    label: "food",
  },
  {
    value: "entertainment",
    label: "entertainment",
  },
  {
    value: "travel",
    label: "travel",
  },
  {
    value: "others",
    label: "others",
  },
];

type Transaction = {
  _id: string;
  amount: number;
  description: string;
  category: string;
  createdAt: string;
};

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">
          {payload[0].value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
          })}
        </p>
      </div>
    );
  }
  return null;
};

type CustomBarProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

const CustomBar = ({ x = 0, y = 0, width = 0, height = 0 }: CustomBarProps) => {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="#4338ca" // Indigo-700 color
        opacity={0.9}
        rx={4}
        className="transition-colors hover:fill-[#3730a3]" // Slightly darker on hover
      />
    </g>
  );
};

export default function Home() {
  const { setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = React.useState(true);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const { toast } = useToast()

  const [transaction, setTransacction] = React.useState({
    amount: 0,
    description: "",
    category: "others",
  });

  const addTransaction = async () => {
    setIsLoading(true);
    try {
      await axios.post("/api/transactions", transaction);
      toast({
        description: "Transaction added successfully",
      });
      setOpen(false);
      getTransactions();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        toast({
          variant: "destructive",
          description: error.message,
        });
      } else {
        console.error('An unknown error occurred');
        toast({
          variant: "destructive",
          description: "Failed to add transaction",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactions = useCallback(async () => {
    setIsLoadingTransactions(true);
    try {
      const response = await axios.get("/api/transactions");
      if (response.data.success && Array.isArray(response.data.transactions)) {
        // Sort transactions by date in descending order
        const sortedTransactions = response.data.transactions.sort((a: Transaction, b: Transaction) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setTransactions(sortedTransactions);
      } else {
        console.error('Invalid response format:', response.data);
        toast({
          variant: "destructive",
          description: "Invalid response format",
        });
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        variant: "destructive",
        description: "Failed to fetch transactions",
      });
      setTransactions([]);
    } finally {
      setIsLoadingTransactions(false);
    }
  }, [toast]);

  const editTransaction = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put("/api/transactions", {
        id: editingId,
        ...transaction
      });
      if (response.data.success) {
        toast({
          description: "Transaction updated successfully",
        });
        setOpen(false);
        getTransactions();
        setEditingId(null);
      } else {
        toast({
          variant: "destructive",
          description: "Failed to update transaction",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          description: error.message,
        });
      } else {
        toast({
          variant: "destructive",
          description: "Failed to update transaction",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await axios.delete("/api/transactions", { data: { id } });
      toast({
        description: "Transaction deleted successfully",
      });
      getTransactions();
    } catch {
      toast({
        variant: "destructive",
        description: "Failed to delete transaction",
      });
    }
  };

  const handleEditClick = (trans: Transaction) => {
    setEditingId(trans._id);
    setTransacction({
      amount: trans.amount,
      description: trans.description,
      category: trans.category,
    });
    setOpen(true);
  };

  React.useEffect(() => {
    getTransactions();
  }, [getTransactions]);

  const processTransactionsForChart = () => {
    if (!transactions.length) return [];
    
    // Take only the last 10 transactions and reverse them for the chart
    const recentTransactions = [...transactions]
      .slice(0, 10)
      .reverse();

    return recentTransactions.map(trans => ({
      date: new Date(trans.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      amount: trans.amount
    }));
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem className="mr-7">Assignment</NavigationMenuItem>
          <NavigationMenuItem>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Add transaction</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingId ? 'Edit transaction' : 'Add transaction'}</DialogTitle>
                  <DialogDescription>
                    Fill in the transaction details. Click save when you&apos;re
                    done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Amount
                    </Label>
                    <Input
                      type="Number"
                      id="amount"
                      value={transaction.amount}
                      onChange={(e) =>
                        setTransacction({
                          ...transaction,
                          amount: Number(e.target.value),
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="transaction" className="text-right">
                      Description
                    </Label>
                    <Input
                      type="text"
                      id="description"
                      value={transaction.description}
                      onChange={(e) =>
                        setTransacction({
                          ...transaction,
                          description: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="transaction" className="text-right">
                      Category
                    </Label>
                    <Select
                      value={transaction.category}
                      onValueChange={(value) =>
                        setTransacction({
                          ...transaction,
                          category: value,
                        })
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.value}
                              value={category.value}
                            >
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="submit" 
                    onClick={editingId ? editTransaction : addTransaction}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <><span className="animate-spin">⏳</span> {editingId ? 'Updating...' : 'Adding...'}</>
                    ) : (
                      editingId ? "Save changes" : "Add transaction"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <main className="flex flex-col items-start gap-8 row-start-2 w-full max-w-3xl mx-auto">
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 ">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="transactions" className="h-[500px]">
            <ScrollArea className="h-full w-full rounded-md border">
              <div className="p-4">
                {isLoadingTransactions ? (
                  <div className="flex justify-center items-center h-full">
                    <span className="animate-spin">⏳</span> Loading transactions...
                  </div>
                ) : !transactions || transactions.length === 0 ? (
                  <div className="text-center text-muted-foreground p-4">
                    No transactions found. Add your first transaction!
                  </div>
                ) : (
                  transactions.map((trans) => (
                    <div key={trans._id}>
                      <div className="text-sm flex items-center gap-4 py-2">
                        <span className="flex-1">
                          {trans.amount.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}{" "}
                          - {trans.description}
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({trans.category})
                          </span>
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {new Date(trans.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditClick(trans)}
                          >
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete this transaction and remove your data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteTransaction(trans._id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      <Separator className="my-2" />
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="analysis" className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processTransactionsForChart()}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="hsl(var(--muted-foreground))" 
                  opacity={0.2}
                />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
                />
                <Bar 
                  dataKey="amount" 
                  shape={<CustomBar />}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
