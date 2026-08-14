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
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in flex min-h-full items-center justify-center p-3 sm:p-6 text-center"
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#EAEAEA] rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-lg w-full shadow-2xl relative animate-scale-in text-left my-auto max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto max-h-[calc(90vh-2rem)] pr-1">
          {submitted ? (
            <div className="text-center py-6 sm:py-8 space-y-3 sm:space-y-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#111]">Enquiry Received!</h3>
              <p className="text-xs sm:text-sm text-[#666] leading-relaxed">
                Thank you for reaching out regarding <strong className="text-[#111]">{projectName}</strong>. Our team will contact you shortly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="mt-4 sm:mt-6 bg-[#111] text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#333] transition"
              >
                Close
              </button>
            </div>
          ) : (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D8C494] block mb-1">
                GET IN TOUCH
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#111] mb-1 sm:mb-2 pr-6">Enquire About {projectName}</h2>
              <p className="text-xs sm:text-sm text-[#666] mb-4 sm:mb-6">Fill out the details below to receive pricing, demo credentials, or custom solutions.</p>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-[#111] uppercase mb-1">Your Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-[#EAEAEA] text-sm focus:outline-none focus:border-black transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-[#111] uppercase mb-1">Email *</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-[#EAEAEA] text-sm focus:outline-none focus:border-black transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-[#111] uppercase mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 234 567 890"
                      className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-[#EAEAEA] text-sm focus:outline-none focus:border-black transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-[#111] uppercase mb-1">Message</label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-[#EAEAEA] text-sm focus:outline-none focus:border-black transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black hover:bg-[#D8C494] text-white py-3.5 sm:py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 text-sm cursor-pointer"
                >
                  <Send className="w-4 h-4" /> {loading ? "Sending..." : "Submit Enquiry"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
