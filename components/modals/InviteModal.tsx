"use client";

import { Dialog, DialogHeader, DialogTitle, DialogContent } from "../ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/useOrigin";
import { useState } from "react";
import axios from "axios";

const InviteModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const origin = useOrigin();
  const isModalOpen = isOpen && type === "invite";
  const { server } = data;

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  function onCopy() {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }

  async function generateCode() {
    try {
      setIsLoading(true);
      const res = await axios.patch(`/api/servers/${server?.id}/inviteCode`);
      onOpen("invite", { server: res.data });
    } catch (error) {
      console.log(error);
      throw new Error("error generating code");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">
              Invite Friends
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
              Server Invite Link
            </Label>
            <div className="flex items-center mt-2 gap-x-2">
              <Input
                disabled={isLoading}
                value={inviteUrl}
                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              />
              <Button size="icon" disabled={isLoading} onClick={onCopy}>
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <Button
              disabled={isLoading}
              onClick={generateCode}
              variant="link"
              size="sm"
              className="text-xs text-zinc-500 mt-4"
            >
              Generate a new link
              <RefreshCw
                className={`h-3 w-3 ml-2 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InviteModal;
