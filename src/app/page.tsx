"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function Home() {
  const [activeNav, setActiveNav] = useState("home");

  const navItems = [
    { id: "home", label: "Home", href: "#home" },
    { id: "vision", label: "Vision", href: "#vision" },
    { id: "features", label: "Features", href: "#features" },
    { id: "architecture", label: "Architecture", href: "#architecture" },
    { id: "generate", label: "Generate", href: "/generate" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-md z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-shrink-0"
            >
              <span className="text-2xl font-bold text-white">
                NexOra AI
              </span>
            </motion.div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveNav(item.id)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className={`text-sm font-medium transition-colors ${
                    activeNav === item.id
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Button asChild className="bg-white text-black hover:bg-gray-100">
                <Link href="/generate">Get Started</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Section 1: Hero */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center pt-20 bg-black"
      >
        {/* Background Glow - subtle */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/3 w-96 h-96 bg-white rounded-full mix-blend-screen filter blur-3xl opacity-5"></div>
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-white rounded-full mix-blend-screen filter blur-3xl opacity-5"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center space-y-8"
          >
            <motion.div variants={itemVariants}>
              <p className="text-white text-sm uppercase tracking-[0.25em] font-semibold">
                Welcome to the Future
              </p>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none"
            >
              <span className="block">NexOra Ai</span>
              <span className="block">
                
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Generate deterministic architecture blueprints from structured intake. Precise, reliable, and production-ready solutions in minutes.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            >
              <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100 text-lg px-8">
                <Link href="/generate">Launch Generator</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-900"
              >
                <Link href="#vision">Learn More</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Vision */}
      <section
        id="vision"
        className="relative min-h-screen flex items-center justify-center bg-black border-t border-gray-900"
      >
        {/* Background Glow - subtle */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-white rounded-full mix-blend-screen filter blur-3xl opacity-5"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-5xl sm:text-6xl font-black tracking-tight mb-4">
                Our Vision
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Empower teams to design scalable, resilient architectures without guesswork
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div variants={itemVariants} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-white">Engineering Precision</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Stop making architecture decisions based on gut feeling. NexOra AI analyzes your requirements, constraints, and goals to generate architectures that actually work.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-3 text-white">Built for Scale</h3>
                  <p className="text-gray-300 leading-relaxed">
                    From startup MVPs to enterprise systems handling millions of requests, our blueprints grow with you. Automatically adjust for complexity, compliance, and cost.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-3 text-white">Production Ready</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Every generated blueprint includes deployment strategies, security hardening, disaster recovery, and operational runbooks. No guessing game.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-8"
              >
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-800 text-white flex items-center justify-center flex-shrink-0 font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Conflict Detection</h4>
                      <p className="text-sm text-gray-400">Identifies contradictions before they become expensive problems</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-800 text-white flex items-center justify-center flex-shrink-0 font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Risk Assessment</h4>
                      <p className="text-sm text-gray-400">Evaluates operational, compliance, and financial risks upfront</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-800 text-white flex items-center justify-center flex-shrink-0 font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Iterative Refinement</h4>
                      <p className="text-sm text-gray-400">Adapt architectures as requirements evolve</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-800 text-white flex items-center justify-center flex-shrink-0 font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Documentation</h4>
                      <p className="text-sm text-gray-400">Auto-generated specs, diagrams, and deployment guides</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 3: Features */}
      <section
        id="features"
        className="relative min-h-screen flex items-center justify-center bg-black border-t border-gray-900"
      >
        {/* Background Glow - subtle */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-white rounded-full mix-blend-screen filter blur-3xl opacity-5"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-5xl sm:text-6xl font-black tracking-tight mb-4">
                What We Build
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Comprehensive architecture solutions across domains and scales
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🏗️",
                  title: "System Architecture",
                  description: "Microservices, monoliths, serverless, or hybrid—we design the topology that fits your goals and constraints.",
                },
                {
                  icon: "🔒",
                  title: "Security & Compliance",
                  description: "GDPR, HIPAA, PCI-DSS, SOC2—automatically embed regulatory requirements into your architecture.",
                },
                {
                  icon: "📊",
                  title: "Data Architecture",
                  description: "Data pipelines, warehousing, lakes, and real-time analytics—optimized for your workload patterns.",
                },
                {
                  icon: "⚡",
                  title: "Performance Optimization",
                  description: "Caching strategies, database tuning, CDN placement, and load balancing all designed for your scale.",
                },
                {
                  icon: "🛡️",
                  title: "Disaster Recovery",
                  description: "Multi-region failover, backup strategies, and RTO/RPO targets aligned with your business needs.",
                },
                {
                  icon: "💰",
                  title: "Cost Optimization",
                  description: "Right-sizing resources, auto-scaling rules, and reserved capacity plans to maximize ROI.",
                },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="group bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 rounded-xl p-6 transition-all cursor-pointer"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gray-100 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 4: How It Works */}
      <section
        id="architecture"
        className="relative min-h-screen flex items-center justify-center bg-black border-t border-gray-900"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-5xl sm:text-6xl font-black tracking-tight mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                From requirements to production-ready blueprint in minutes
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  num: "01",
                  title: "Intake",
                  description: "Answer structured questions about your business, constraints, and goals",
                },
                {
                  num: "02",
                  title: "Analysis",
                  description: "AI analyzes requirements and surfaces conflicts or risks early",
                },
                {
                  num: "03",
                  title: "Generation",
                  description: "Deterministic engine generates optimized architecture blueprint",
                },
                {
                  num: "04",
                  title: "Deployment",
                  description: "Get IaC, runbooks, security hardening, and team playbooks",
                },
              ].map((step, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="relative"
                >
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 h-full">
                    <div className="text-4xl font-black text-white mb-3">
                      {step.num}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  {idx < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <div className="text-2xl text-white">→</div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-black border-t border-gray-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/10 to-gray-900/10 opacity-50"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <motion.h2
              variants={itemVariants}
              className="text-4xl sm:text-5xl font-black tracking-tight"
            >
              Ready to Transform Your Architecture?
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-400 max-w-2xl mx-auto"
            >
              Stop guessing. Start building with confidence using AI-driven architecture blueprints.
            </motion.p>

            <motion.div variants={itemVariants}>
              <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100 text-lg px-12 py-6">
                <Link href="/generate">Launch Generator Now</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">NexOra AI</h3>
              <p className="text-gray-400 text-sm">
                Architecture blueprints powered by AI.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/generate" className="hover:text-white transition">Generator</Link></li>
                <li><Link href="#architecture" className="hover:text-white transition">Architecture</Link></li>
                <li><Link href="#features" className="hover:text-white transition">Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#docs" className="hover:text-white transition">Docs</a></li>
                <li><a href="#help" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#blog" className="hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Discord</a></li>
                <li><a href="#" className="hover:text-white transition">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2026 NexOra AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}