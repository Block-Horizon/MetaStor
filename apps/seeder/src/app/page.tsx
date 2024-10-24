"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ChevronDown, GitHub, Twitter } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { Button } from "@repo/ui/components/ui/button";
import { Card } from "@repo/ui/components/ui/card-hover-effect";
import { BackgroundBeams } from "@repo/ui/components/ui/background-beams";
import { TextGenerateEffect } from "@repo/ui/components/ui/text-generate-effect";
import { SparklesCore } from "@repo/ui/components/ui/sparkles";
import { Meteors } from "@repo/ui/components/ui/meteors";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "Decentralized Storage",
    description:
      "Provide storage space on your device to the MetaStor network, contributing to a global, distributed data infrastructure.",
    gradient: "from-blue-500 to-cyan-500",
    icon: "/storj-svgrepo-com.svg",
  },
  {
    title: "Earn Rewards",
    description:
      "Get compensated for contributing to the network's storage capacity. Turn your unused storage into a passive income stream.",
    gradient: "from-purple-500 to-pink-500",
    icon: "/earn-points-svgrepo-com.svg",
  },
  {
    title: "Secure & Private",
    description:
      "Advanced encryption and decentralization ensure your data remains private and secure at all times.",
    gradient: "from-orange-500 to-red-500",
    icon: "/security-svgrepo-com.svg",
  },
  {
    title: "Easy to Use",
    description:
      "Our user-friendly interface makes it simple to set up and manage your node, even for non-technical users.",
    gradient: "from-green-500 to-emerald-500",
    icon: "/easy.png",
  },
];

const blockchainPartners = [
  {
    name: "Solana",
    logo: "/solana-sol-icon.svg",
    color: "bg-green-500",
  },
  {
    name: "IPFS",
    logo: "/ipfs-svgrepo-com.svg",
    color: "bg-blue-500",
  },
  {
    name: "Ethereum",
    logo: "/ethereum-svgrepo-com.svg",
    color: "bg-purple-500",
  },
  {
    name: "Polkadot",
    logo: "/Polkadot_colorful_logo_icon_svg.svg",
    color: "bg-pink-500",
  },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    }; // Added braces here
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-zinc-900/90 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="MetaStor Logo" width={32} height={32} />
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-zinc-200 to-zinc-400 bg-clip-text text-transparent"
            >
              MetaStor
            </motion.div>
          </Link>

          <div className="hidden md:flex md:items-center md:space-x-8">
            {["Features", "How It Works", "Rewards", "Contact"].map((item) => (
              <NavLink
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
              >
                {item}
              </NavLink>
            ))}
            <AnimatedButton className={""}>
              Get Started
              <ChevronRight className="ml-2 h-4 w-4" />
            </AnimatedButton>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="md:hidden"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
            }}
          >
            <ChevronDown
              className={cn(
                "h-6 w-6 text-zinc-100 transition-transform duration-200",
                mobileMenuOpen && "rotate-180"
              )}
            />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-900/95 backdrop-blur-md"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {["Features", "How It Works", "Rewards", "Contact"].map(
                (item) => (
                  <NavLink
                    key={item}
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    mobile
                  >
                    {item}
                  </NavLink>
                )
              )}
              <AnimatedButton className="w-sm mt-4">
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </AnimatedButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const NavLink = ({
  href,
  children,
  mobile = false,
}: {
  href: string;
  children: React.ReactNode;
  mobile?: boolean;
}) => (
  <Link
    href={href}
    className={cn(
      "relative group",
      mobile
        ? "block px-3 py-2 text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-md"
        : "inline-flex items-center px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white"
    )}
  >
    {children}
    {!mobile && (
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-zinc-200 to-zinc-400 rounded-full origin-left"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    )}
  </Link>
);
const AnimatedButton = ({ children, className, ...props }) => {
  return (
    <div className="relative group">
      {/* Multiple background elements for animated border effect */}
      <div className="absolute -inset-0.5 rounded-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 blur-sm" />

      {/* Glow effect */}
      <div className="absolute -inset-1 rounded-lg opacity-30 group-hover:opacity-50 transition duration-1000 blur-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500" />

      <Button
        className={cn(
          "relative w-full",
          "bg-zinc-900 hover:bg-zinc-800",
          "text-zinc-100 hover:text-white",
          "border border-zinc-800/50",
          "shadow-lg shadow-zinc-900/50",
          "transition-all duration-300 ease-out",
          "rounded-lg",
          "overflow-hidden",
          className
        )}
        {...props}
      >
        {/* Button background animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-zinc-800 to-zinc-700"
          initial={{ x: "100%" }}
          whileHover={{ x: 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Content wrapper with hover effect */}
        <span className="relative z-10 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300">
          {children}
        </span>
      </Button>
    </div>
  );
};

const FeatureCard = ({
  title,
  description,
  gradient,
  icon,
}: (typeof features)[0]) => (
  <Card className="relative overflow-hidden bg-zinc-900 border-zinc-800 group">
    <motion.div
      className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500",
        `bg-gradient-to-r ${gradient}`
      )}
    />
    <div className="p-6">
      <Image src={icon} alt={title} width={48} height={48} className="mb-4" />
      <h3 className="text-xl font-semibold text-zinc-100 mb-2">{title}</h3>
      <p className="text-zinc-400">{description}</p>
    </div>
  </Card>
);

const PartnersSection = () => (
  <div className="py-20">
    <div className="container mx-auto px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200"
      >
        Powered by Leading Blockchain Technologies
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-8"
      >
        {blockchainPartners.map((partner, index) => (
          <motion.div
            key={partner.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <div className="relative aspect-square rounded-lg overflow-hidden bg-zinc-800">
              <Image
                src={partner.logo}
                alt={partner.name}
                layout="fill"
                objectFit="contain"
                className="p-4 transition-transform duration-300 group-hover:scale-110"
              />
              <motion.div
                className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300",
                  partner.color
                )}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </div>
);

export default function Page() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax scrolling effects
      gsap.to(".hero-content", {
        y: 200,
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Feature cards stagger animation
      gsap.from(".feature-card", {
        opacity: 0,
        y: 100,
        stagger: 0.2,
        duration: 1,
        scrollTrigger: {
          trigger: ".features-section",
          start: "top 80%",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      <Navbar />
      <BackgroundBeams className="opacity-20" />

      {/* Hero Section */}
      <section
        ref={targetRef}
        className="hero-section relative h-screen flex items-center justify-center pt-16"
      >
        <motion.div
          style={{ opacity, scale }}
          className="hero-content text-center z-10 max-w-4xl mx-auto px-4"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200"
          >
            Revolutionize Storage with MetaStor
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 text-zinc-300"
          >
            Join the decentralized storage revolution and earn rewards while
            securing the future of data
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <AnimatedButton size="lg">
              Get Started
              <ChevronRight className="ml-2 h-5 w-5" />
            </AnimatedButton>
          </motion.div>
        </motion.div>
      </section>

      {/* Partners Section */}
      <PartnersSection />

      {/* Features Section */}
      <section id="features" className="features-section py-20 relative">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200"
          >
            Why Become a MetaStor Seeder?
          </motion.h2>
          <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 relative bg-gradient-to-b from-zinc-900 to-zinc-950"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200"
          >
            How MetaStor Works
          </motion.h2>
          <div className="max-w-3xl mx-auto">
            <TextGenerateEffect words="MetaStor revolutionizes data storage by creating a decentralized network of seeders. As a seeder, you contribute unused storage space from your device to our secure, distributed network. Your computer becomes a vital node in our ecosystem, storing encrypted fragments of data across the globe. In return for your contribution, you earn cryptocurrency rewards, creating a win-win situation where you monetize your idle resources while helping to build a more resilient, efficient, and private internet infrastructure." />
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h3 className="text-xl font-semibold mb-4">1. Install & Setup</h3>
              <p className="text-zinc-400">
                Download the MetaStor app and configure your storage settings in
                minutes.
              </p>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h3 className="text-xl font-semibold mb-4">
                2. Contribute Storage
              </h3>
              <p className="text-zinc-400">
                Allocate your unused storage space to the network and start
                seeding data.
              </p>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h3 className="text-xl font-semibold mb-4">3. Earn Rewards</h3>
              <p className="text-zinc-400">
                Get compensated in cryptocurrency for your contribution to the
                network.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section id="rewards" className="py-20 relative">
        <div className="absolute inset-0 z-0">
          <SparklesCore
            id="tsparticles"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            className="w-full h-full"
            particleColor="#71717a"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200"
          >
            Earn While You Sleep
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Storage Rewards"
              description="Earn based on the amount and quality of storage you provide to the network."
              gradient="from-green-500 to-emerald-500"
              icon="/quality-reward-svgrepo-com.svg"
            />
            <FeatureCard
              title="Uptime Bonuses"
              description="Get additional rewards for maintaining high availability and reliability."
              gradient="from-blue-500 to-indigo-500"
              icon="/backup.png"
            />
            <FeatureCard
              title="Network Contribution"
              description="Earn more by actively participating in data transfer and network operations."
              gradient="from-purple-500 to-pink-500"
              icon="/contribution.png"
            />
          </div>
        </div>
      </section>

      {/* Security Visualization */}
      <section className="py-20 relative bg-gradient-to-b from-zinc-950 to-zinc-900">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200"
          >
            Cutting-Edge Security
          </motion.h2>
          <div className="relative h-64 bg-zinc-800 rounded-lg overflow-hidden">
            <Meteors number={20} />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-2xl font-bold text-zinc-100">
                Your Data is Protected by Advanced Encryption
              </p>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h3 className="text-xl font-semibold mb-4">
                End-to-End Encryption
              </h3>
              <p className="text-zinc-400">
                All data is encrypted before leaving your device, ensuring only
                you have access to your files.
              </p>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h3 className="text-xl font-semibold mb-4">
                Decentralized Architecture
              </h3>
              <p className="text-zinc-400">
                Your data is distributed across multiple nodes, eliminating
                single points of failure.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 relative">
        <BackgroundBeams className="opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200"
            >
              Ready to Revolutionize Storage?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl mb-8 text-zinc-300"
            >
              Join the MetaStor network and start earning rewards while shaping
              the future of decentralized storage.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <AnimatedButton size="lg" className={""}>
                Become a Seeder
                <ChevronRight className="ml-2 h-5 w-5" />
              </AnimatedButton>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-zinc-500">
        <p>© 2024 MetaStor Seeder Network. All rights reserved.</p>
      </footer>
    </div>
  );
}
