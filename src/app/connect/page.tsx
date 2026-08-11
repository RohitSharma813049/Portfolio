"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

function ConnectContent() {
  const searchParams = useSearchParams();
  const initialProject = searchParams?.get("project") || "";
  const initialType = searchParams?.get("type") || "general";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    project: initialProject,
    type: initialType === "demo" ? "Book Demo" : initialType === "preview" ? "Live Preview" : "General Enquiry",
    message: initialProject ? `Interested in ${initialProject}. Please send pricing and demo details.` : "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "CONNECT_ENQUIRY",
          title: `Connect Request: ${formData.type} (${formData.name})`,
          message: `From: ${formData.name} <${formData.email}>\nPhone: ${formData.phone}\nProject: ${formData.project}\nMessage: ${formData.message}`,
          metadata: formData,
        }),
      });

      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-8 pt-24 pb-12 text-center animate-fade-in-up">
        <span className="inline-block py-1.5 px-4 rounded-full bg-gray-100 text-[10px] font-bold uppercase tracking-widest mb-6 text-[#D8C494]">
          GET IN TOUCH
        </span>
        <h1 className="text-5xl md:text-6xl font-playfair font-medium tracking-tight mb-6 leading-tight text-[#111]">
          Connect With <span className="text-[#D8C494] italic">Our Team</span>
        </h1>
        <p className="text-lg text-[#666] font-light max-w-2xl mx-auto">
          Have a question about our software projects, pricing, or custom development? Send us a message and we will respond promptly.
        </p>
      </section>

      {/* Main Grid */}
      <section className="max-w-6xl mx-auto px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Details */}
          <div className="space-y-8 bg-[#FAFAFA] p-8 rounded-3xl border border-[#EAEAEA]">
            <h3 className="font-bold text-xl text-[#111] mb-6">Contact Information</h3>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white border border-[#EAEAEA] flex items-center justify-center text-[#D8C494] flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs uppercase font-bold text-[#888] mb-1">Email Us</h4>
                <p className="text-sm font-semibold text-[#111]">contact@webbeside.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white border border-[#EAEAEA] flex items-center justify-center text-[#D8C494] flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs uppercase font-bold text-[#888] mb-1">Call Us</h4>
                <p className="text-sm font-semibold text-[#111]">+91 81304 90000</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white border border-[#EAEAEA] flex items-center justify-center text-[#D8C494] flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs uppercase font-bold text-[#888] mb-1">Office Location</h4>
                <p className="text-sm font-semibold text-[#111]">Webbeside Technology HQ</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white border border-[#EAEAEA] rounded-3xl p-8 shadow-sm">
            {submitted ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#111]">Message Sent Successfully!</h3>
                <p className="text-sm text-[#666] max-w-md mx-auto">
                  Thank you for connecting with us. One of our technical consultants will reach out to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 bg-black text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#D8C494] transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="font-bold text-xl text-[#111] border-b border-[#EAEAEA] pb-4">Send a Message</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-[#111] uppercase mb-2">Your Name *</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-[#EAEAEA] text-sm focus:outline-none focus:border-black transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#111] uppercase mb-2">Email Address *</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-[#EAEAEA] text-sm focus:outline-none focus:border-black transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-[#111] uppercase mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 234 567 890"
                      className="w-full px-4 py-3 rounded-xl border border-[#EAEAEA] text-sm focus:outline-none focus:border-black transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#111] uppercase mb-2">Inquiry Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#EAEAEA] text-sm focus:outline-none focus:border-black transition bg-white"
                    >
                      <option value="General Enquiry">General Enquiry</option>
                      <option value="Book Demo">Book Demo Request</option>
                      <option value="Live Preview">Live Preview Request</option>
                      <option value="Custom Development">Custom Software Development</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111] uppercase mb-2">Project Name (Optional)</label>
                  <input
                    type="text"
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                    placeholder="e.g. Travel Booking System"
                    className="w-full px-4 py-3 rounded-xl border border-[#EAEAEA] text-sm focus:outline-none focus:border-black transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111] uppercase mb-2">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your project or requirement..."
                    className="w-full px-4 py-3 rounded-xl border border-[#EAEAEA] text-sm focus:outline-none focus:border-black transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-black hover:bg-[#D8C494] text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" /> {loading ? "Sending..." : "Submit Inquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ConnectPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading Connect...</div>}>
      <ConnectContent />
    </Suspense>
  );
}
