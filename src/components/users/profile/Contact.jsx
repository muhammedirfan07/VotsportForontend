import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, X, Send } from 'lucide-react';

const ContactModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="w-12 h-12 rounded-xl bg-emerald-700/20 flex items-center justify-center mb-4">
          <Zap className="text-emerald-500" size={22} />
        </div>

        <h2 className="text-xl font-bold mb-4">VoltSpot HQ</h2>

        <div className="space-y-4 text-zinc-400 text-sm">
          <div className="flex items-start gap-3">
            <MapPin className="text-emerald-500 shrink-0" size={18} />
            <span>123, Main Road, New City, State, Country</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="text-emerald-500 shrink-0" size={18} />
            <span>evStaion@gmail.com</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="text-emerald-500 shrink-0" size={18} />
            <span>+91 1234567890</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const Contact = () => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // wire to commonAPI once backend route is ready
    console.log(form);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-16">
      {/* Hero */}
      <div className="relative h-[45vh] min-h-[320px] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1611095973362-ffa279a4d5fe?w=1600&q=80"
          alt="VoltSpot charging network at night"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/30" />

        <div className="relative z-10 h-full container mx-auto px-4 flex flex-col justify-end pb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-zinc-300 hover:text-emerald-500 transition-colors mb-6 w-fit"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Get in <span className="text-emerald-500">Touch</span>
          </h1>
          <p className="text-zinc-300 max-w-xl">
            Questions about a station, booking, or partnering with VoltSpot?
            We usually reply within 24 hours.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Info card */}
          <div className="bg-zinc-900/95 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 flex flex-col justify-between shadow-xl shadow-black/30">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-700/20 flex items-center justify-center shrink-0">
                  <MapPin className="text-emerald-500" size={18} />
                </div>
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-zinc-400 text-sm">123, Main Road, New City, State, Country</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-700/20 flex items-center justify-center shrink-0">
                  <Mail className="text-emerald-500" size={18} />
                </div>
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-zinc-400 text-sm">evStaion@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-700/20 flex items-center justify-center shrink-0">
                  <Phone className="text-emerald-500" size={18} />
                </div>
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-zinc-400 text-sm">+91 1234567890</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="mt-8 py-2 px-6 rounded-lg bg-emerald-700 hover:bg-emerald-600 transition-colors w-fit"
            >
              View Full Details
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-4"
          >
            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-600 transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-600 transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-600 transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 transition-colors"
            >
              <Send size={16} />
              Send Message
            </button>
          </form>
        </div>
      </div>

      {showModal && <ContactModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Contact;