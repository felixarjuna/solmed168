"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, buttonVariants } from "~/components/ui/button";
import { DrawerClose, DrawerFooter } from "~/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";
import { cn, formatRp } from "~/lib/utils";
import { safeAddExpense } from "../_actions/expense-actions";

const AddExpenseFormSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string(),
  amount: z.string(),
});

export default function AddExpenseForm() {
  const { toast } = useToast();
  const { execute, status } = useAction(safeAddExpense, {
    onSuccess: ({ success }) => {
      if (success) {
        /** show toast for success scenario, clear cart and re-route to home page */
        toast({
          title: "Pengeluaran berhasil ditambahkan. ✅",
        });
      } else
        toast({
          title: "Pengeluaran gagal ditambahkan. ❌",
        });
    },
    onError: () => {
      toast({
        title: "Pengeluaran gagal ditambahkan. ❌",
      });
    },
  });

  const form = useForm<z.infer<typeof AddExpenseFormSchema>>({
    resolver: zodResolver(AddExpenseFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof AddExpenseFormSchema>) {
    const expense = { ...values, amount: +values.amount };
    execute(expense);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Nama barang</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Harga</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  inputMode="numeric"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    const amount = formatRp(value);
                    field.onChange(amount);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DrawerFooter className="flex flex-row items-center justify-center">
          <DrawerClose
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "icon",
              }),
            )}
          >
            <X>Tutup</X>
          </DrawerClose>
          <Button className="flex w-fit items-center gap-2">
            {status === "executing" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}

            <p>Add</p>
          </Button>
        </DrawerFooter>
      </form>
    </Form>
  );
}
