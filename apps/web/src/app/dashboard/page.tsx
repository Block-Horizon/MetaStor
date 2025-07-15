"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { Download, RefreshCw, FileText } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { AuthGuard } from "../../components/AuthGuard";
import { Navbar } from "../../components/navbar";
import { Card, CardContent, CardHeader } from "@repo/ui/components/ui/card";
import {
  CardDescription,
  CardTitle,
} from "@repo/ui/components/ui/card-hover-effect";
import { Button } from "@repo/ui/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { motion } from "framer-motion";
import Link from "next/link";
import { apiFetch } from "../../lib/api";

interface FileData {
  id: number;
  fileName: string;
  cid: string;
  timestamp: string;
  paid: boolean;
  userId: number;
}

export default function DashboardPage() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { pubKey, token, clearAuth } = useAuthStore();

  const fetchFiles = async () => {
    if (!token) {
      toast.error("Authentication token missing");
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      const response = await apiFetch(
        "/api/files",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
        token,
        clearAuth
      );
      const data = response.data;
      if (data && Array.isArray(data.files)) {
        setFiles(data.files);
      } else if (data && data.files && typeof data.files === "object") {
        setFiles([]);
        toast.error("No files found");
      } else {
        setFiles([]);
        toast.error("Unexpected response from server");
      }
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error(error.message || "Failed to fetch files");
      }
      setFiles([]);
      console.error("Fetch files error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [pubKey]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFiles();
  };

  const isImageFile = (fileName: string) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    return imageExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));
  };

  const getDownloadUrl = (cid: string, filename: string) => {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/proxy?cid=${cid}&filename=${encodeURIComponent(filename)}`;
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="relative min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
          <Navbar />

          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-zinc-400" />
                <p className="text-lg text-zinc-300">Loading your files...</p>
              </motion.div>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

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
              Your Decentralized Files
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto">
              Manage your uploaded files on IPFS with security and style.
            </p>
          </motion.div>
          <div className="relative">
            <Card className="relative z-10 bg-zinc-900/80 border border-zinc-800 shadow-xl backdrop-blur-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200">
                      Your Files
                    </CardTitle>
                    <CardDescription>
                      Manage your uploaded files on IPFS
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      asChild
                      variant="default"
                      size="sm"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      <Link href="/upload">Upload New File</Link>
                    </Button>
                    <Button
                      onClick={handleRefresh}
                      disabled={refreshing}
                      variant="outline"
                      size="sm"
                      className="border-zinc-600 text-zinc-100 hover:bg-zinc-800 bg-zinc-900 hover:text-zinc-100 transition-all duration-300"
                    >
                      <RefreshCw
                        className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                      />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {files.length === 0 ? (
                  <motion.div
                    className="text-center py-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <FileText className="h-16 w-16 text-zinc-500 mx-auto mb-6" />
                    <h3 className="text-2xl font-semibold text-zinc-100 mb-2">
                      No files uploaded yet
                    </h3>
                    <p className="text-zinc-400 mb-6">
                      Start by uploading your first file to IPFS
                    </p>
                    <Button
                      variant="outline"
                      className="border-zinc-600 text-zinc-100 hover:bg-zinc-800 bg-zinc-900 hover:text-zinc-100 transition-all duration-300"
                    >
                      <Link href="/upload">Upload File</Link>
                    </Button>
                  </motion.div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950/80">
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900">
                          <TableHead className="text-zinc-300">
                            Preview
                          </TableHead>
                          <TableHead className="text-zinc-300">
                            File Name
                          </TableHead>
                          <TableHead className="text-zinc-300">
                            Upload Date
                          </TableHead>
                          <TableHead className="text-zinc-300">CID</TableHead>
                          <TableHead className="text-zinc-300">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {files.map((file, idx) => (
                          <motion.tr
                            key={file.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="border-b border-zinc-800 hover:bg-zinc-900/60 transition-colors"
                          >
                            <TableCell>
                              {isImageFile(file.fileName) ? (
                                <img
                                  src={
                                    getDownloadUrl(file.cid, file.fileName) ||
                                    "/placeholder.svg"
                                  }
                                  alt={file.fileName}
                                  className="w-14 h-14 object-cover rounded shadow-md border border-zinc-800"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = "none";
                                  }}
                                />
                              ) : (
                                <div className="w-14 h-14 bg-zinc-800 rounded flex items-center justify-center border border-zinc-700">
                                  <FileText className="h-7 w-7 text-zinc-500" />
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="font-medium text-zinc-100">
                              {file.fileName}
                            </TableCell>
                            <TableCell className="text-zinc-400">
                              {format(
                                new Date(file.timestamp),
                                "MMM dd, yyyy HH:mm"
                              )}
                            </TableCell>
                            <TableCell className="font-mono text-sm text-zinc-400">
                              {file.cid.slice(0, 8)}...{file.cid.slice(-8)}
                            </TableCell>
                            <TableCell>
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="border-zinc-700 text-zinc-200 hover:bg-zinc-800 bg-zinc-900 hover:text-zinc-100 transition-all duration-300"
                              >
                                <Link
                                  href={getDownloadUrl(file.cid, file.fileName)}
                                  download={file.fileName}
                                  className="inline-flex items-center"
                                  passHref
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </Link>
                              </Button>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </AuthGuard>
  );
}
