import Link from "next/link";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import CategoryGrid from "@/components/CategoryGrid";

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


      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 pt-24 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
          Browse by Category
        </h1>
        <p className="text-lg text-[#16325C] max-w-2xl mx-auto mb-10">
          Find exactly what you're looking for by browsing our curated categories of premium software solutions.
        </p>
      </section>

      {/* Categories Grid (Client Component for Search & Pagination) */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <CategoryGrid initialCategories={JSON.parse(JSON.stringify(categoriesData))} />
      </section>

      {/* Footer */}
      <footer className="border-t border-[#EAEAEA] py-12 mt-20">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center text-sm text-[#16325C]">
          <p>© 2026 Webbeside Technology. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-[#0B1B3D]">Terms</Link>
            <Link href="#" className="hover:text-[#0B1B3D]">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#0B1B3D]">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
