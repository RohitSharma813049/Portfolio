import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Cpu, Zap, Code2 } from "lucide-react";
import CTA from "@/components/CTA";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-8 pt-24 pb-16 text-center animate-fade-in-up">
        <span className="inline-block py-1.5 px-4 rounded-full bg-gray-100 text-[10px] font-bold uppercase tracking-widest mb-6 text-[#D8C494]">
          ABOUT WEBBESIDE TECHNOLOGY
        </span>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-playfair font-medium tracking-tight mb-8 leading-tight text-[#111]">
          Architecting High Impact <br />
          <span className="text-[#D8C494] italic">Digital Platforms</span>
        </h1>
        <p className="text-xl text-[#666] font-light max-w-3xl mx-auto mb-12 leading-relaxed">
          We build robust, scalable, and implementation-ready software solutions for companies worldwide. From enterprise portals to mobile applications, our engineering powers digital transformation.
        </p>
      </section>

      {/* Stats Section */}
      <section className="border-y border-[#EAEAEA] py-16 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <span className="font-playfair text-4xl lg:text-5xl font-medium text-[#111] block mb-2">50+</span>
            <span className="text-xs uppercase font-bold text-[#666] tracking-widest">Completed Projects</span>
          </div>
          <div>
            <span className="font-playfair text-4xl lg:text-5xl font-medium text-[#111] block mb-2">99.9%</span>
            <span className="text-xs uppercase font-bold text-[#666] tracking-widest">Uptime & Reliability</span>
          </div>
          <div>
            <span className="font-playfair text-4xl lg:text-5xl font-medium text-[#111] block mb-2">15+</span>
            <span className="text-xs uppercase font-bold text-[#666] tracking-widest">Expert Engineers</span>
          </div>
          <div>
            <span className="font-playfair text-4xl lg:text-5xl font-medium text-[#111] block mb-2">80+</span>
            <span className="text-xs uppercase font-bold text-[#666] tracking-widest">Global Clients</span>
          </div>
        </div>
      </section>

      {/* Core Values / Features */}
      <section className="max-w-6xl mx-auto px-8 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D8C494] block mb-3">OUR CAPABILITIES</span>
          <h2 className="text-4xl font-playfair font-medium text-[#111]">Why Choose Our Solutions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-[#EAEAEA] rounded-3xl p-8 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-[#D8C494] mb-6">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#111] mb-3">Clean Code & Tech Stack</h3>
            <p className="text-sm text-[#666] leading-relaxed">
              We leverage modern frameworks like Next.js, React, Node.js, and TypeScript to ensure maximum performance and maintainability.
            </p>
          </div>

          <div className="bg-white border border-[#EAEAEA] rounded-3xl p-8 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-[#D8C494] mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#111] mb-3">White Label Ready</h3>
            <p className="text-sm text-[#666] leading-relaxed">
              Our software solutions come white-label ready so you can rebrand and deploy seamlessly to your end customers.
            </p>
          </div>

          <div className="bg-white border border-[#EAEAEA] rounded-3xl p-8 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-[#D8C494] mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#111] mb-3">Rapid Customization</h3>
            <p className="text-sm text-[#666] leading-relaxed">
              Tailored modules, custom API integrations, and dedicated support for your specific business requirements.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTA />
    </main>
  );
}
