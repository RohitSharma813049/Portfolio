import Link from "next/link";

export default function CTA() {
  return (
    <section className="bg-[#111] py-20 px-8 border-y border-[#222]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex-1">
          <p className="text-[#D8C494] font-bold text-sm mb-4 tracking-wide uppercase">
            Ready to build your project?
          </p>
          <h2 className="text-4xl md:text-5xl font-playfair font-medium text-white leading-tight">
            Discover & Launch <span className="text-[#D8C494] italic">Cutting-Edge</span> Software Solutions.
          </h2>
        </div>
        
        <div className="flex-shrink-0">
          <Link 
            href="/connect" 
            className="inline-block bg-[#D8C494] text-black font-semibold px-10 py-4 rounded-xl hover:bg-[#c2ae7c] transition-colors shadow-[0_0_20px_rgba(216,196,148,0.2)] hover:scale-105 duration-300"
          >
            Get In Touch
          </Link>
        </div>
      </div>
    </section>
  );
}
