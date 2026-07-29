"use client";

import { useState, useEffect } from "react";
import { Users, Mail, Phone, ExternalLink, Calendar, Search } from "lucide-react";
import Link from "next/link";

export default function CollabsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        const json = await res.json();
        if (json.success) {
          setUsers(json.data);
        }
      } catch (error) {
        console.error("Failed to load users", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) || 
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-playfair font-medium flex items-center gap-3 text-white">
            <Users className="w-8 h-8 text-[#D8C494]" /> Collabs
          </h1>
          <p className="text-[#999] text-sm mt-2 font-light tracking-wide">Manage clients and collaborators</p>
        </div>
        
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
          <input 
            type="text" 
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#111] border border-[#333] rounded-full text-sm text-white focus:outline-none focus:border-[#D8C494] transition"
          />
        </div>
      </div>

      <div className="bg-[#111] border border-[#333] rounded-2xl shadow-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#666] font-medium">Loading collaborators...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-[#666]">
            No collaborators found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0a0a0a] border-b border-[#333]">
                  <th className="px-6 py-4 text-xs font-semibold text-[#888] uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#888] uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#888] uppercase tracking-wider">Project ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#888] uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333]">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-[#1a1a1a] transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#222] text-[#D8C494] flex items-center justify-center font-playfair font-bold text-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-white">{user.name}</div>
                          <div className="text-xs text-[#666] mt-1">{user.notes ? (user.notes.length > 30 ? user.notes.substring(0, 30) + '...' : user.notes) : 'No notes provided'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <a href={`mailto:${user.email}`} className="flex items-center gap-2 text-sm text-[#999] hover:text-[#D8C494] transition">
                          <Mail className="w-3 h-3" /> {user.email}
                        </a>
                        {user.mobile && (
                          <a href={`tel:${user.mobile}`} className="flex items-center gap-2 text-sm text-[#999] hover:text-[#D8C494] transition">
                            <Phone className="w-3 h-3" /> {user.mobile}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.projectId ? (
                        <Link href={`/admin/projects/${user.projectId}/edit`} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#222] text-[#D8C494] text-xs font-medium rounded-full hover:bg-[#333] transition">
                          View Project <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : (
                        <span className="text-[#666] text-xs">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-[#999]">
                        <Calendar className="w-4 h-4" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
