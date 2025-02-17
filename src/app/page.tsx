"use client";
import Image from "next/image";
import toast from "react-hot-toast";
// import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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

const dummyTransactions: Transaction[] = Array.from({ length: 20 }).map(
  (_, i) => ({
    _id: `trans_${i + 1}`,
    amount: Math.floor(Math.random() * 1000) + 10,
    description: `Transaction ${i + 1}`,
    category: categories[Math.floor(Math.random() * categories.length)].value,
    createdAt: new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    ).toISOString(),
  })
);

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

export default function Home() {
  const { setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);

  const [transaction, setTransacction] = React.useState({
    amount: 0,
    description: "",
    category: "others",
  });

  const addTransaction = async () => {
    console.log("Transaction Details:");
    console.table(transaction);
    try {
      const response  = await axios.post("/api/transactions", transaction);
      console.log(response.data);
      toast.success(response.data.message);
      setOpen(false); // Close dialog after success
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred');
      }
    }

  };

  // React.useEffect(()->{
  //   if(amount > 0 && category.length > 0)
  // })

  // Add this function to process transactions for the chart
  const processTransactionsForChart = () => {
    const sortedTransactions = [...dummyTransactions].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return sortedTransactions.map(trans => ({
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
          <NavigationMenuItem>Item One</NavigationMenuItem>
          <NavigationMenuItem>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Add transaction</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add transaction</DialogTitle>
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
                  <Button type="submit" onClick={addTransaction}>
                    add transaction
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
                {dummyTransactions.map((trans) => (
                  <div key={trans._id}>
                    <div className="text-sm flex items-center gap-4 py-2">
                      <span className="flex-1">
                        {trans.amount.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}{" "}
                        - {trans.description}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {new Date(trans.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Add transaction</DialogTitle>
                              <DialogDescription>
                                Fill in the transaction details. Click save when
                                you&apos;re done.
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
                                <Label
                                  htmlFor="username"
                                  className="text-right"
                                >
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
                                <Label
                                  htmlFor="username"
                                  className="text-right"
                                >
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
                              <Button type="submit" onClick={addTransaction}>
                                Save changes
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete this transaction
                                and remove your data from our servers. This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <Separator className="my-2" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="analysis" className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processTransactionsForChart()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?categories=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
