"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LuWallet, LuFileText, LuUser } from "react-icons/lu";
import { AuthGuard } from "../../components/AuthGuard";
import { Navbar } from "../../components/navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@repo/ui/components/ui/card";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { apiFetch } from "../../lib/api";
import { useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useAuthStore } from "../../store/authStore";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { pubKey, token, clearAuth } = useAuthStore();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [fileCount, setFileCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !pubKey) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // File count
        const filesResponse = await apiFetch(
          "/api/files?count=true",
          {
            method: "GET",
          },
          token,
          clearAuth
        );
        const filesData = await filesResponse.data;
        setFileCount(filesData.count || 0);

        // Balance
        if (connection) {
          const pubKeyObj = new PublicKey(pubKey);
          const lamports = await connection.getBalance(pubKeyObj);
          setBalance(lamports / LAMPORTS_PER_SOL);
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch profile data");
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, pubKey]);

  return (
    <AuthGuard>
      <div className="relative min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
        <Navbar />

        <section className="container mx-auto px-4 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-10 text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200">
              Your Profile
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto">
              View your account details and statistics.
            </p>
          </motion.div>
          <div className="relative">
            <Card className="relative z-10 max-w-2xl mx-auto bg-zinc-900/80 border border-zinc-800 shadow-xl backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-2xl bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200">
                  <LuUser className="h-6 w-6 text-zinc-400" />
                  <span>Account Overview</span>
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Your MetaStor profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full bg-zinc-800" />
                    <Skeleton className="h-24 w-full bg-zinc-800" />
                    <Skeleton className="h-24 w-full bg-zinc-800" />
                  </div>
                ) : (
                  <>
                    <motion.div
                      className="flex items-center space-x-4 p-4 bg-zinc-800 rounded-lg border border-zinc-700"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <LuWallet className="h-8 w-8 text-zinc-400" />
                      <div>
                        <p className="text-sm text-zinc-400">Wallet Address</p>
                        <p className="font-mono text-zinc-100">
                          {pubKey?.slice(0, 6)}...{pubKey?.slice(-6)}
                        </p>
                      </div>
                    </motion.div>
                    <motion.div
                      className="flex items-center space-x-4 p-4 bg-zinc-800 rounded-lg border border-zinc-700"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <LuFileText className="h-8 w-8 text-zinc-400" />
                      <div>
                        <p className="text-sm text-zinc-400">Total Files</p>
                        <p className="text-2xl font-bold text-zinc-100">
                          {fileCount}
                        </p>
                      </div>
                    </motion.div>
                    <motion.div
                      className="flex items-center space-x-4 p-4 bg-zinc-800 rounded-lg border border-zinc-700"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <LuWallet className="h-8 w-8 text-zinc-400" />
                      <div>
                        <p className="text-sm text-zinc-400">Wallet Balance</p>
                        <p className="text-2xl font-bold text-zinc-100">
                          {balance !== null ? balance.toFixed(4) : "0.0000"} SOL
                        </p>
                      </div>
                    </motion.div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </AuthGuard>
  );
}
