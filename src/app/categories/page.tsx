import Link from "next/link";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import CategoryGrid from "@/components/CategoryGrid";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  let categoriesData: any[] = [];
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      categoriesData = await Project.aggregate([
        { $unwind: "$categories" },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: "$categories",
            count: { $sum: 1 },
            featureImage: { $first: "$featureImage" },
          },
        },
        { $sort: { _id: 1 } },
      ]);
    }
  } catch (error) {
    console.error("Failed to fetch categories page data:", error);
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-10 pb-4 text-center animate-fade-in-up">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-playfair font-medium tracking-tight mb-3 max-w-4xl mx-auto leading-tight text-[#111]">
          Browse by <span className="text-[#D8C494] italic">Category</span>
        </h1>
        <p className="text-sm sm:text-base text-[#666] font-light max-w-2xl mx-auto mb-4">
          Find exactly what you're looking for by browsing our curated categories of software applications and digital platforms.
        </p>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6">
        <CategoryGrid initialCategories={JSON.parse(JSON.stringify(categoriesData))} />
      </section>

      {/* Footer */}
      <footer className="border-t border-[#EAEAEA] py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-[#16325C]">
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
