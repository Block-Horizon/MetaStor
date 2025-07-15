"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@repo/ui/components/ui/button";
import { LuWallet, LuLogOut } from "react-icons/lu";
import { apiFetch } from "../lib/api";
import { useAuthStore } from "../store/authStore";
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
} from "@repo/ui/components/ui/alert-dialog";

export function WalletConnectButton() {
  const { publicKey, signMessage, connected, disconnect } = useWallet();
  const router = useRouter();
  const { pubKey, token, setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, [setAuth]);

  useEffect(() => {
    if (!connected) {
      clearAuth();
    }
  }, [connected, clearAuth]);

  const handleAuth = async () => {
    if (!publicKey || !signMessage) return;

    try {
      const nonce = `MetaStor Login ${Date.now()}`;
      const message = new TextEncoder().encode(nonce);

      toast.loading("Please sign the message...");
      const signature = await signMessage(message);

      const signatureBase64 = btoa(
        String.fromCharCode(...Array.from(signature))
      );

      const response = await apiFetch(
        "/api/auth",
        {
          method: "POST",
          body: JSON.stringify({
            pubKey: publicKey.toBase58(),
            signature: signatureBase64,
            nonce,
          }),
        },
        token || undefined,
        clearAuth
      );

      const data = await response.data;

      if (data.success) {
        setAuth({ token: data.token, pubKey: data.user.pubKey });
        toast.dismiss();
        toast.success("Authenticated successfully!");
        router.push("/dashboard");
      } else {
        throw new Error(data.error || "Authentication failed");
      }
    } catch (error) {
      toast.dismiss();
      toast.error(
        error instanceof Error ? error.message : "Authentication failed"
      );
      console.error("Auth error:", error);
    }
  };

  const handleLogout = () => {
    clearAuth();
    disconnect();
    toast.success("Logged out successfully");
    router.push("/");
  };

  if (connected && token && pubKey) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 dark:text-gray-400 hidden md:block">
          {pubKey.slice(0, 6)}...{pubKey.slice(-4)}
        </span>
        <WalletMultiButton />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="icon">
              <LuLogOut className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to log out?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  if (connected && !token) {
    return (
      <div className="flex items-center space-x-2">
        <Button onClick={handleAuth} variant="outline">
          <LuWallet className="mr-2 h-4 w-4" />
          Authenticate
        </Button>
        <WalletMultiButton />
      </div>
    );
  }

  return <WalletMultiButton />;
}
