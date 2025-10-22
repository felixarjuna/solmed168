import { Coins, HandCoins } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { formatRp, toRp } from "~/lib/utils";

const nominals = [10_000, 20_000, 50_000, 100_000, 200_000, 500_000];

type ICashPaymentProps = {
  readonly totalAmount: number;
  readonly onHandleCashSufficiency: (isSufficient: boolean) => void;
  readonly onPaymentChange?: (paidAmount: number, exchange: number) => void;
};

export default function CashPayment(props: ICashPaymentProps) {
  /** local state to handle amount change */
  const [paidAmount, setPaidAmount] = React.useState<string>("0");

  const exchange =
    Number.parseInt(paidAmount.replace(/\D/g, ""), 10) - props.totalAmount;

  const handlePaidAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const amount = formatRp(value);
    setPaidAmount(amount);

    const paidAmountNum = Number.parseInt(amount.replace(/\D/g, ""), 10);
    const exchangeAmount = paidAmountNum - props.totalAmount;

    if (paidAmountNum >= props.totalAmount) {
      props.onHandleCashSufficiency(true);
    } else {
      props.onHandleCashSufficiency(false);
    }

    // Notify parent component about payment changes
    if (props.onPaymentChange) {
      props.onPaymentChange(paidAmountNum, exchangeAmount);
    }
  };

  return (
    <div className="grid w-60 gap-4">
      <div className="grid gap-8">
        <div className="text-center">
          <p>Nominal pembayaran </p>
          <p className="font-bold text-3xl">{toRp(props.totalAmount)}</p>
        </div>

        <div className="grid gap-4">
          <div>
            <p className="flex w-fit items-center gap-2 rounded-lg bg-neutral-100 p-2">
              <Coins className="h-4 w-4" />
              Accepted
            </p>
            <div className="flex items-center gap-1 font-bold text-3xl">
              <span className="opacity-50">Rp.</span>
              <Input
                className="w-48 border-none text-3xl focus-visible:ring-0 focus-visible:ring-offset-0"
                inputMode="numeric"
                min={0}
                onChange={handlePaidAmountChange}
                // pattern="\d*"
                type="text"
                value={paidAmount}
              />
            </div>

            <div className="no-scrollbar mt-4 flex w-60 gap-2 overflow-x-scroll">
              {nominals.map((n, i) => (
                <Button
                  key={i.toString()}
                  onClick={() => {
                    setPaidAmount(n.toLocaleString("id-ID"));
                    const exchangeAmount = n - props.totalAmount;

                    if (n >= props.totalAmount) {
                      props.onHandleCashSufficiency(true);
                    } else {
                      props.onHandleCashSufficiency(false);
                    }

                    // Notify parent component about payment changes
                    if (props.onPaymentChange) {
                      props.onPaymentChange(n, exchangeAmount);
                    }
                  }}
                  size={"sm"}
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
            <div className="flex items-center gap-1 font-bold text-3xl">
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
