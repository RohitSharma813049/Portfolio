import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import Link from "next/link";
import { Plus } from "lucide-react";
import AdminCharts from "@/components/AdminCharts";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  await connectToDatabase();
  
  // Fetch real counts from the database
  const total = await Project.countDocuments();
  const published = await Project.countDocuments({ status: "PUBLISHED" });
  const drafts = await Project.countDocuments({ status: "DRAFT" });

  // Aggregate Data for Charts
  // 1. Projects by Category
  const categoryAggregation = await Project.aggregate([
    { $unwind: "$categories" },
    { $group: { _id: "$categories", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);
  const categoryData = categoryAggregation.map((item: any) => ({
    name: item._id,
    count: item.count
  }));

  // 2. Project Growth Timeline (Mocking last 6 months based on createdAt)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const timelineAggregation = await Project.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    { 
      $group: { 
        _id: { $month: "$createdAt" },
        count: { $sum: 1 } 
      } 
    },
    { $sort: { _id: 1 } }
  ]);
  
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const timelineData = timelineAggregation.map((item: any) => ({
    month: monthNames[item._id - 1] || item._id,
    count: item.count
  }));

  // Fallback data if DB is empty so charts aren't completely blank for the demo
  const finalCategoryData = categoryData.length > 0 ? categoryData : [{ name: "No Data", count: 0 }];
  const finalTimelineData = timelineData.length > 0 ? timelineData : [{ month: "No Data", count: 0 }];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/admin/projects/new" className="bg-[#111111] text-white px-5 py-2 rounded-none-none text-sm font-medium hover:bg-[#333] transition flex items-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> New Project
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-none-none border border-[#EAEAEA] shadow-sm">
          <h3 className="text-sm font-semibold text-[#16325C] uppercase tracking-wider mb-2">Total Projects</h3>
          <p className="text-4xl font-extrabold text-[#0B1B3D]">{total}</p>
        </div>
        
        <div className="bg-white p-6 rounded-none-none border border-[#EAEAEA] shadow-sm">
          <h3 className="text-sm font-semibold text-[#16325C] uppercase tracking-wider mb-2">Published</h3>
          <p className="text-4xl font-extrabold text-green-600">{published}</p>
        </div>

        <div className="bg-white p-6 rounded-none-none border border-[#EAEAEA] shadow-sm">
          <h3 className="text-sm font-semibold text-[#16325C] uppercase tracking-wider mb-2">Drafts</h3>
          <p className="text-4xl font-extrabold text-amber-500">{drafts}</p>
        </div>
      </div>
      
      {/* Charts Section */}
      <AdminCharts categoryData={finalCategoryData} timelineData={finalTimelineData} />
    </div>
  );
}
