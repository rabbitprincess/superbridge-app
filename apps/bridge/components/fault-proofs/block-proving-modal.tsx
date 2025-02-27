import { IconAlert } from "@/components/icons";
import { optimismFaultProofsUpgrade } from "@/constants/links";
import { useConfigState } from "@/state/config";

import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";

export const BlockProvingModal = () => {
  const deployment = useConfigState.useBlockProvingModal();
  const setOpen = useConfigState.useSetBlockProvingModal();

  return (
    <Dialog open={!!deployment} onOpenChange={() => setOpen(null)}>
      <DialogContent>
        <div className="flex flex-col gap-8 p-6">
          <div className="flex flex-col gap-4 pt-6">
            <div className="animate-bounce mx-auto">
              <IconAlert className="w-16 h-16" />
            </div>
            <h1 className="font-bold text-xl tracking-tighter text-left">
              {deployment?.l2.name} Fault Proof upgrade
            </h1>
            <div className="text-xs text-left md:text-sm prose-sm tracking-tight leading-relaxed font-medium text-muted-foreground text-pretty">
              <p>
                The {deployment?.l2.name} Fault Proof upgrade has been targeted
                for June.
              </p>
              <p>
                Please come back after the upgrade is complete to prove your
                withdrawal.
              </p>
              <p>
                Find out more at{" "}
                <a
                  href={optimismFaultProofsUpgrade}
                  target="_blank"
                  className="text-foreground underline"
                >
                  optimism.io
                </a>{" "}
                or check the{" "}
                <a
                  href="https://superbridge.app/support/optimism"
                  target="_blank"
                  className="text-foreground underline"
                >
                  FAQs
                </a>
                .
              </p>
            </div>
          </div>

          <Button onClick={() => setOpen(null)}>Ok</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
