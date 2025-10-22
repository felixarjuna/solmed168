import { ArrowLeft, Loader2, PartyPopper } from "lucide-react";
import type { HookActionStatus } from "next-safe-action/hooks";
import { Button } from "~/components/ui/button";
import type { PaymentMethodType } from "../data";

type IActionButton = {
  readonly method: PaymentMethodType;
  readonly onSelectPaymentMethod: (method: PaymentMethodType) => void;

  readonly onPaymentDone: (method: PaymentMethodType) => Promise<void>;
  readonly isCashSufficient?: boolean;

  readonly onHandleCashSufficiency?: (isSufficient: boolean) => void;
  readonly status: HookActionStatus;
};

export default function PaymentSelectionButton({
  method,
  onSelectPaymentMethod,
  onPaymentDone,
  isCashSufficient,
  onHandleCashSufficiency,
  status,
}: IActionButton) {
  console.log(isCashSufficient);
  return (
    <div className="mt-8 flex items-center justify-between">
      <Button
        className="flex w-24 items-center gap-1"
        onClick={() => {
          onSelectPaymentMethod(undefined);
          if (onHandleCashSufficiency) {
            onHandleCashSufficiency(false);
          }
        }}
        size={"sm"}
        variant={"secondary"}
      >
        <ArrowLeft className="h-4 w-4" />
        <p>Kembali</p>
      </Button>

      <Button
        className="flex w-24 items-center gap-2 font-normal"
        disabled={!isCashSufficient || status === "executing"}
        onClick={() => onPaymentDone(method)}
        size={"sm"}
        variant={"default"}
      >
        {status === "executing" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <PartyPopper className="h-4 w-4" />
        )}
        <p>Selesai</p>
      </Button>
    </div>
  );
}
