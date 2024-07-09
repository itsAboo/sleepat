"use client";

import { Button } from "./button";
import Loader from "./loader";
import { SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { DialogClose } from "@radix-ui/react-dialog";

export default function Modal({
  open,
  action,
  isLoading,
  setOpen,
  title,
  description,
}: {
  open: boolean;
  action?: () => void;
  isLoading?: boolean;
  setOpen?: React.Dispatch<SetStateAction<boolean>>;
  title: string;
  description: string;
}) {
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent className="sm:max-w-[425px] max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="leading-relaxed">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="mt-3" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button className="mt-3" disabled={isLoading} onClick={action}>
            {isLoading ? <Loader /> : "Yes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
