"use client";

import type React from "react";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import toast from "react-hot-toast";
import { LuUpload, LuFileText } from "react-icons/lu";
import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@repo/ui/components/ui/card";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { apiFetch } from "../../lib/api";
import { AuthGuard } from "../../components/AuthGuard";
import { Navbar } from "../../components/navbar";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { useAuthStore } from "../../store/authStore";

export default function UploadPage() {
  const auth = useAuthStore();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { connection } = useConnection();
  const { signTransaction } = useWallet();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 1024 * 1024) {
        toast.error("File size must be less than 1MB");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !signTransaction) return;

    setLoading(true);
    setProgress(0);

    try {
      setProgress(20);
      toast.loading("Uploading file to IPFS...");

      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await apiFetch(
        "/api/upload",
        {
          method: "POST",
          body: formData,
        },
        auth.token
      );

      const uploadData = await uploadResponse.data; // Changed to .json() assuming apiFetch returns Response

      console.log("uploadData", uploadData);

      setProgress(40);
      toast.dismiss();
      toast.loading("Preparing transaction...");

      // Deserialize the transaction
      let transaction = Transaction.from(
        Buffer.from(uploadData.txSerialized, "base64")
      );

      // Refresh blockhash to prevent expiration
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash("confirmed");
      transaction.recentBlockhash = blockhash;
      transaction.lastValidBlockHeight = lastValidBlockHeight; // Optional: Adds durability against chain reorgs

      console.log("Refreshed Blockhash", transaction.recentBlockhash);

      // Sign the updated transaction
      const signedTransaction = await signTransaction(transaction);

      setProgress(60);
      toast.dismiss();
      toast.loading("Sending transaction...");

      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize(),
        { skipPreflight: false, preflightCommitment: "confirmed" } // Explicit options for simulation
      );
      await connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        "confirmed"
      );

      setProgress(80);
      toast.dismiss();
      toast.loading("Confirming upload...");

      const confirmResponse = await apiFetch(
        "/api/confirm",
        {
          method: "POST",
          body: JSON.stringify({ fileId: uploadData.fileId, signature }),
        },
        auth.token
      );

      setProgress(100);
      toast.dismiss();
      toast.success("File uploaded successfully!");

      setFile(null);
      (document.getElementById("file-input") as HTMLInputElement).value = "";
    } catch (error) {
      toast.dismiss();
      let errorMsg = "Upload failed";
      if (error instanceof Error) {
        errorMsg = error.message;
        if (error.name === "SendTransactionError") {
          console.error("Transaction logs:", (error as any).logs); // Log simulation details
        }
      }
      toast.error(errorMsg);
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

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
              Upload to MetaStor
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto">
              Securely upload your files to IPFS and pay 0.001 SOL. Max 1MB.
            </p>
          </motion.div>
          <div className="relative">
           
            <Card className="relative z-10 max-w-2xl mx-auto bg-zinc-900/80 border border-zinc-800 shadow-xl backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-2xl bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200">
                  <LuUpload className="h-6 w-6 text-zinc-400" />
                  <span>Upload File</span>
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Upload to IPFS and pay 0.001 SOL. Max 1MB.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="file-input" className="text-zinc-200">
                    Select File
                  </Label>
                  <Input
                    id="file-input"
                    type="file"
                    onChange={handleFileChange}
                    disabled={loading}
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 file:bg-zinc-700 file:text-zinc-200 file:border-none file:rounded file:px-3 file:py-1"
                  />
                </div>

                {file && (
                  <motion.div
                    className="flex items-center space-x-2 p-3 bg-zinc-800 rounded-lg border border-zinc-700"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <LuFileText className="h-5 w-5 text-zinc-400" />
                    <div>
                      <p className="text-sm font-medium text-zinc-100">
                        {file.name}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </motion.div>
                )}

                {loading && (
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ProgressBar value={progress} className="h-2 bg-zinc-800" />
                    <p className="text-sm text-center text-zinc-400">
                      {progress < 20
                        ? "Preparing..."
                        : progress < 40
                          ? "Uploading..."
                          : progress < 60
                            ? "Signing..."
                            : progress < 80
                              ? "Sending..."
                              : "Confirming..."}
                    </p>
                  </motion.div>
                )}

                <Button
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className="w-full hover:cursor-pointer"
                  size="lg"
                >
                  {loading ? "Uploading..." : "Upload (0.001 SOL)"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </AuthGuard>
  );
}
