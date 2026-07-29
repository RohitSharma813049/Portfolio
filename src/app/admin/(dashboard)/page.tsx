import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import Link from "next/link";
import { Plus, TrendingUp, TrendingDown, FolderKanban, FileCheck, FileEdit, Eye, Clock, Activity } from "lucide-react";
import AdminCharts from "@/components/AdminCharts";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  await connectToDatabase();
  
  // Fetch real counts from the database
  const total = await Project.countDocuments();
  const published = await Project.countDocuments({ status: "PUBLISHED" });
  const drafts = await Project.countDocuments({ status: "DRAFT" });
  
  // Fetch recent projects for the table
  const recentProjects = await Project.find().sort({ createdAt: -1 }).limit(5);

  // Aggregate Data for Charts
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

  const finalCategoryData = categoryData.length > 0 ? categoryData : [{ name: "No Data", count: 0 }];
  const finalTimelineData = timelineData.length > 0 ? timelineData : [{ month: "No Data", count: 0 }];

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6">
      
      {/* Breadcrumb & Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <nav className="text-sm text-[var(--color-text-secondary)] mb-2">
            Home / <span className="text-[var(--color-text-primary)] font-medium">Dashboard</span>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">Welcome back, Admin 👋</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">{currentDate}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/categories/new" className="bg-white border border-[var(--color-border)] text-[var(--color-text-primary)] px-4 py-2 rounded-[var(--radius-button)] text-sm font-medium hover:bg-gray-50 transition shadow-sm">
            Add Category
          </Link>
          <Link href="/admin/projects/new" className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-[var(--radius-button)] text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2 shadow-soft">
            <Plus className="w-4 h-4" /> Create Project
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1 */}
        <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-soft hover:shadow-hover transition duration-300 group cursor-default">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[var(--color-primary)] flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderKanban className="w-6 h-6" />
            </div>
            <span className="flex items-center text-xs font-semibold text-[var(--color-success)] bg-green-50 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" /> +12%
            </span>
          </div>
          <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">Total Projects</h3>
          <p className="text-3xl font-bold text-[var(--color-text-primary)] mt-1">{total}</p>
        </div>

        {/* Card 2 */}
        <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-soft hover:shadow-hover transition duration-300 group cursor-default">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-full bg-green-50 text-[var(--color-success)] flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileCheck className="w-6 h-6" />
            </div>
            <span className="flex items-center text-xs font-semibold text-[var(--color-success)] bg-green-50 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" /> +4%
            </span>
          </div>
          <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">Published</h3>
          <p className="text-3xl font-bold text-[var(--color-text-primary)] mt-1">{published}</p>
        </div>

        {/* Card 3 */}
        <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-soft hover:shadow-hover transition duration-300 group cursor-default">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-full bg-orange-50 text-[var(--color-warning)] flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileEdit className="w-6 h-6" />
            </div>
            <span className="flex items-center text-xs font-semibold text-[var(--color-text-secondary)] bg-gray-100 px-2 py-1 rounded-full">
              <TrendingDown className="w-3 h-3 mr-1" /> -2%
            </span>
          </div>
          <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">Drafts</h3>
          <p className="text-3xl font-bold text-[var(--color-text-primary)] mt-1">{drafts}</p>
        </div>

        {/* Card 4 */}
        <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-soft hover:shadow-hover transition duration-300 group cursor-default">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Eye className="w-6 h-6" />
            </div>
            <span className="flex items-center text-xs font-semibold text-[var(--color-success)] bg-green-50 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" /> +24%
            </span>
          </div>
          <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">Total Views</h3>
          <p className="text-3xl font-bold text-[var(--color-text-primary)] mt-1">12.4k</p>
        </div>

      </div>
      
      {/* Analytics Section */}
      <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-soft">
        <h2 className="text-lg font-bold mb-4 text-[var(--color-text-primary)]">Analytics Overview</h2>
        <AdminCharts categoryData={finalCategoryData} timelineData={finalTimelineData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects Table */}
        <div className="lg:col-span-2 bg-[var(--color-surface)] p-6 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-soft">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Recent Projects</h2>
            <Link href="/admin/projects" className="text-sm text-[var(--color-primary)] font-medium hover:underline">View All</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  <th className="pb-3 pr-4">Project Name</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentProjects.map((project) => (
                  <tr key={project._id.toString()} className="border-b border-[var(--color-border)] last:border-0 hover:bg-gray-50 transition group">
                    <td className="py-4 pr-4 font-medium text-[var(--color-text-primary)]">
                      {project.name}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {project.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-[var(--color-text-secondary)]">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 pl-4 text-right">
                      <Link href={`/admin/projects/${project._id}`} className="text-[var(--color-primary)] hover:text-blue-700 font-medium">Edit</Link>
                    </td>
                  </tr>
                ))}
                {recentProjects.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-[var(--color-text-secondary)]">
                      No projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-soft">
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-6">Activity Timeline</h2>
          <div className="relative border-l border-[var(--color-border)] ml-5 space-y-8">
            
            {/* Timeline Item 1 */}
            <div className="relative pl-8 group">
              <div className="absolute -left-5 top-0 flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-50 text-[var(--color-primary)] shadow-sm">
                <FolderKanban className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-sm bg-[var(--color-background)] transition hover:shadow-hover">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-sm text-[var(--color-text-primary)]">Project Created</h4>
                  <span className="text-xs font-medium text-[var(--color-text-secondary)]">2h ago</span>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">You created a new project <span className="font-medium text-[var(--color-text-primary)]">"E-commerce Redesign"</span>.</p>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative pl-8 group">
              <div className="absolute -left-5 top-0 flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-green-50 text-[var(--color-success)] shadow-sm">
                <FileCheck className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-sm bg-[var(--color-background)] transition hover:shadow-hover">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-sm text-[var(--color-text-primary)]">Project Published</h4>
                  <span className="text-xs font-medium text-[var(--color-text-secondary)]">5h ago</span>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1"><span className="font-medium text-[var(--color-text-primary)]">"SaaS Dashboard UI"</span> is now live.</p>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="relative pl-8 group">
              <div className="absolute -left-5 top-0 flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-purple-50 text-purple-600 shadow-sm">
                <Activity className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-sm bg-[var(--color-background)] transition hover:shadow-hover">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-sm text-[var(--color-text-primary)]">System Update</h4>
                  <span className="text-xs font-medium text-[var(--color-text-secondary)]">1d ago</span>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">Admin dashboard UI has been updated.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
