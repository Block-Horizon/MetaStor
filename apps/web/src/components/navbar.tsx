'use client';

import Link from 'next/link';
import { useState } from 'react';
import { LuMenu, LuX } from 'react-icons/lu';
import { WalletConnectButton } from './WalletConnect';
import { Button } from '@repo/ui/components/ui/button';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="backdrop-blur-md bg-gradient-to-b from-zinc-950/80 to-zinc-900/60 border-b border-zinc-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200 bg-clip-text text-transparent animate-gradient-move">
                MetaStor
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-zinc-300 hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link href="/upload" className="text-zinc-300 hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">
              Upload
            </Link>
            <Link href="/dashboard" className="text-zinc-300 hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">
              Dashboard
            </Link>
            <WalletConnectButton />
          </div>

          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <LuX className="h-6 w-6" /> : <LuMenu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg-zinc-950/95 rounded-b-xl shadow-lg border-t border-zinc-800 py-2">
            <div className="px-2 space-y-1">
              <Link href="/" className="block text-zinc-300 hover:text-indigo-400 px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link href="/upload" className="block text-zinc-300 hover:text-indigo-400 px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>
                Upload
              </Link>
              <Link href="/dashboard" className="block text-zinc-300 hover:text-indigo-400 px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>
                Dashboard
              </Link>
              <div className="px-3 py-2">
                <WalletConnectButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}