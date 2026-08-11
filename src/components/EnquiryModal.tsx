"use client";

import { useState } from "react";
import { X, Send, CheckCircle } from "lucide-react";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName?: string;
  projectId?: string;
  defaultSubject?: string;
}

export default function EnquiryModal({
  isOpen,
  onClose,
  projectName = "General Enquiry",
  projectId,
  defaultSubject = "Project Cost Enquiry",
}: EnquiryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: defaultSubject,
    message: `Hello, I am interested in ${projectName}. Please provide pricing and details.`,
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send notification or store inquiry
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "ENQUIRY",
          title: `New Enquiry for ${projectName}`,
          message: `From: ${formData.name} (${formData.email}, ${formData.phone})\nSubject: ${formData.subject}\nMessage: ${formData.message}`,
          metadata: { projectId, projectName, ...formData },
        }),
      });

      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert("Failed to send enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-[#EAEAEA] rounded-3xl p-8 max-w-lg w-full shadow-2xl relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#111]">Enquiry Received!</h3>
            <p className="text-sm text-[#666] leading-relaxed">
              Thank you for reaching out regarding <strong className="text-[#111]">{projectName}</strong>. Our team will contact you shortly.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-6 bg-[#111] text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#333] transition"
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D8C494] block mb-1">
              GET IN TOUCH
            </span>
            <h2 className="text-2xl font-bold text-[#111] mb-2">Enquire About {projectName}</h2>
            <p className="text-sm text-[#666] mb-6">Fill out the details below to receive pricing, demo credentials, or custom solutions.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#111] uppercase mb-1">Your Name *</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-[#EAEAEA] text-sm focus:outline-none focus:border-black transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#111] uppercase mb-1">Email *</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-[#EAEAEA] text-sm focus:outline-none focus:border-black transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#111] uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 234 567 890"
                    className="w-full px-4 py-3 rounded-xl border border-[#EAEAEA] text-sm focus:outline-none focus:border-black transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111] uppercase mb-1">Message</label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#EAEAEA] text-sm focus:outline-none focus:border-black transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-[#D8C494] text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> {loading ? "Sending..." : "Submit Enquiry"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
