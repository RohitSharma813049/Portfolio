import Link from "next/link";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import { Folder } from "lucide-react";

export const revalidate = 60;

export default async function CategoriesPage() {
  await connectToDatabase();
  
  // Aggregate to find all unique categories and their project counts, plus a feature image
  const categoriesData = await Project.aggregate([
    { $match: { status: "PUBLISHED" } },
    { $unwind: "$categories" },
    // Group by category, count projects, and get the featureImage of the most recently created project
    { $sort: { createdAt: -1 } },
    { $group: { 
        _id: "$categories", 
        count: { $sum: 1 },
        featureImage: { $first: "$featureImage" } 
    }},
    { $sort: { _id: 1 } } // Sort alphabetically by category name
  ]);

  return (
    <main className="min-h-screen bg-white">
      {/* Header / Navigation */}
      <header className="flex justify-between items-center py-6 px-8 max-w-7xl mx-auto border-b border-[#EAEAEA]">
        <div className="font-bold text-xl tracking-tight">PortfolioCMS</div>
        <nav className="flex gap-6 items-center">
          <Link href="/" className="text-sm font-medium hover:text-[#666666] transition">Projects</Link>
          <Link href="/categories" className="text-sm font-medium hover:text-[#666666] transition">Categories</Link>
          <Link href="/admin" className="bg-[#111111] text-white px-5 py-2 rounded-[8px] text-sm font-medium hover:bg-[#333] transition">
            Admin Login
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 pt-24 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
          Browse by Category
        </h1>
        <p className="text-lg text-[#666666] max-w-2xl mx-auto mb-10">
          Find exactly what you're looking for by browsing our curated categories of premium software solutions.
        </p>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        {categoriesData.length === 0 ? (
          <div className="text-center text-[#666666] py-12">
            No categories found yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categoriesData.map((cat: any) => {
              // Convert category name to slug-friendly format for the URL
              const categorySlug = cat._id.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
              
              return (
                <Link 
                  href={`/category/${categorySlug}`} 
                  key={cat._id}
                  className="group flex flex-col p-8 rounded-[20px] border border-[#EAEAEA] bg-white shadow-sm hover:shadow-hover hover:border-[#111111] transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#f4f4f4] flex items-center justify-center group-hover:bg-[#111111] group-hover:text-white transition-colors duration-300">
                      <Folder className="w-6 h-6" />
                    </div>
                    {cat.featureImage && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#EAEAEA]">
                        <img 
                          src={cat.featureImage} 
                          alt={`${cat._id} thumbnail`} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-auto">
                    <h3 className="font-bold text-xl mb-1 text-[#111111]">{cat._id}</h3>
                    <p className="text-sm text-[#666666] font-medium">
                      {cat.count} {cat.count === 1 ? 'Project' : 'Projects'}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-[#EAEAEA] py-12 mt-20">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center text-sm text-[#666666]">
          <p>© 2026 Webbeside Technology. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-[#111111]">Terms</Link>
            <Link href="#" className="hover:text-[#111111]">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#111111]">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
