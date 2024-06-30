import { Coins, HandCoins } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { formatRp, toRp } from "~/lib/utils";

const nominals = [10000, 20000, 50000, 100000, 200000, 500000];

interface ICashPaymentProps {
  readonly totalAmount: number;
  readonly onHandleCashSufficiency: (isSufficient: boolean) => void;
}

export default function CashPayment(props: ICashPaymentProps) {
  /** local state to handle amount change */
  const [paidAmount, setPaidAmount] = React.useState<string>("0");

  const exchange =
    parseInt(paidAmount.replace(/\D/g, ""), 10) - props.totalAmount;

  const handlePaidAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const amount = formatRp(value);
    setPaidAmount(amount);

    if (parseInt(amount.replace(/\D/g, ""), 10) > props.totalAmount)
      props.onHandleCashSufficiency(true);
    else props.onHandleCashSufficiency(false);
  };

  return (
    <div className="grid w-60 gap-4">
      <div className="grid gap-8">
        <div className="text-center">
          <p>Nominal pembayaran </p>
          <p className="text-3xl font-bold">{toRp(props.totalAmount)}</p>
        </div>

        <div className="grid gap-4">
          <div>
            <p className="flex w-fit items-center gap-2 rounded-lg bg-neutral-100 p-2">
              <Coins className="h-4 w-4" />
              Accepted
            </p>
            <div className="flex items-center gap-1 text-3xl font-bold">
              <span className="opacity-50">Rp.</span>
              <Input
                className="w-48 border-none text-3xl focus-visible:ring-0 focus-visible:ring-offset-0"
                onChange={handlePaidAmountChange}
                type="text"
                inputMode="numeric"
                // pattern="\d*"
                min={0}
                value={paidAmount}
              />
            </div>

            <div className="no-scrollbar mt-4 flex w-60 gap-2 overflow-x-scroll">
              {nominals.map((n, i) => (
                <Button
                  size={"sm"}
                  key={i}
                  onClick={() => {
                    setPaidAmount(n.toLocaleString("id-ID"));
                    if (n > props.totalAmount)
                      props.onHandleCashSufficiency(true);
                    else props.onHandleCashSufficiency(false);
                  }}
                >
                  {toRp(n)}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <p className="flex w-fit items-center gap-2 rounded-lg bg-neutral-100 p-2">
              <HandCoins className="h-4 w-4" />
              Exchange
            </p>
            <div className="flex items-center gap-1 text-3xl font-bold">
              <p>
                <span className="opacity-50">Rp. </span>
                {exchange.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
