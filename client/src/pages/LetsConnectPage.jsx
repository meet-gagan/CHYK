import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { contactService, webContentService } from '../services/api';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle,
  MessageSquare,
  Clock,
  ExternalLink,
  Sparkles,
  HeartHandshake,
} from 'lucide-react';
import { formatPhoneInput } from '../utils/phoneUtils';

export const LetsConnectPage = () => {
  const { user, isAuthenticated } = useAuth();

  const [pageData, setPageData] = useState(() => {
    try {
      localStorage.removeItem('cached_cms_chinmaya_lets_connect');
      localStorage.removeItem('cached_cms_chinmaya_lets_connect_v2');
      const cached = localStorage.getItem('cached_cms_chinmaya_lets_connect_v3');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const fetchContent = () => {
    webContentService
      .getPublicPage('chinmaya', 'lets-connect')
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setPageData(res.data.data);
          try {
            localStorage.setItem('cached_cms_chinmaya_lets_connect_v3', JSON.stringify(res.data.data));
          } catch { }
        }
      })
      .catch(() => { });
  };

  useEffect(() => {
    fetchContent();
    window.addEventListener('cms_updated', fetchContent);
    return () => window.removeEventListener('cms_updated', fetchContent);
  }, []);

  const f = pageData?.fieldsMap || {};

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    category: 'General Inquiry',
    message: '',
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName || '',
        email: prev.email || user.email || '',
        phone: prev.phone || (user.phone ? formatPhoneInput(user.phone) : ''),
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      const res = await contactService.submitMessage(formData);
      if (res.data?.success) {
        setStatus({ loading: false, success: true, error: null });
        setFormData({
          fullName: user?.fullName || '',
          email: user?.email || '',
          phone: user?.phone ? formatPhoneInput(user.phone) : '',
          category: 'General Inquiry',
          message: '',
        });
      }
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || 'Failed to send message',
      });
    }
  };

  return (
    <div className="min-h-screen pt-2 sm:pt-4 pb-14 px-4 max-w-7xl mx-auto space-y-8 sm:space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2.5">
        <h1 className="text-4xl sm:text-5xl font-black font-heading text-[var(--text-primary)] leading-tight">
          <span>{f.contact_info?.heading && !f.contact_info.heading.toLowerCase().includes('us') ? f.contact_info.heading : "Let's Connect With"}</span>
          <span className="block text-[var(--orange)] mt-1 sm:mt-2">CHINMAYA MISSION, Adoni</span>
        </h1>
        <p className="text-base text-[var(--text-muted)] font-medium">
          {f.contact_info?.subtitle ? f.contact_info.subtitle.replace(/,\s*Adoni/gi, '') : 'Have questions regarding marathon registration, volunteering opportunities, youth programs, or community activities? Reach out to our Chinmaya Mission team.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-5 glass-card p-7 sm:p-9 rounded-3xl border border-[var(--border-color)] shadow-2xl space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold font-heading text-[var(--text-primary)]">
              JOIN THE MOVEMENT
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Fill out the form below and our volunteer coordination team will get in touch with you.
            </p>
          </div>

          {status.success && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 font-extrabold text-xs flex items-center gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>Message submitted successfully! Our team will contact you shortly.</span>
            </div>
          )}

          {status.error && (
            <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-500 font-extrabold text-xs">
              {status.error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Ramesh Kumar"
                className="w-full py-3 px-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ramesh@example.com"
                  className="w-full py-3 px-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  Contact Number *
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 flex items-center gap-1.5 pointer-events-none text-[var(--text-muted)] border-r border-[var(--border-color)] pr-2.5">
                    <Phone className="w-4 h-4 text-[var(--orange)]" />
                    <span className="text-xs font-bold text-[var(--text-primary)]">+91</span>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: formatPhoneInput(e.target.value) })}
                    placeholder="98765 43210"
                    maxLength={12}
                    className="w-full pl-20 pr-4 py-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                Inquiry / Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full py-3 px-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Volunteering & Event Help">Volunteering & Event Help</option>
                <option value="Marathon Registration Inquiry">Marathon Registration Inquiry</option>
                <option value="Youth Programs & CHYK">Youth Programs & CHYK</option>
                <option value="Spiritual Classes & Discourses">Spiritual Classes & Discourses</option>
                <option value="Community Service">Community Service Offerings</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                Your Message *
              </label>
              <textarea
                name="message"
                rows={4}
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we assist you or how would you like to volunteer?"
                className="w-full py-3 px-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
              />
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className="btn-primary w-full justify-center text-sm py-3.5"
            >
              <Send className="w-4 h-4" />
              <span>{status.loading ? 'SUBMITTING...' : 'SEND MESSAGE'}</span>
            </button>
          </form>
        </div>

        {/* Location & Details Side - 3 Organization Cards in 2-Top, 1-Bottom Centered Structure */}
        <div className="lg:col-span-7">
          {(() => {
            const activeCards = [
              { data: f.contact_info, key: 'contact_info', defaultTitle: 'ORGANIZATION DETAILS' },
              { data: f.contact_card_2, key: 'contact_card_2', defaultTitle: 'Sri Chinmaya Sanjeevaraya Swamy Temple' },
              { data: f.contact_card_3, key: 'contact_card_3', defaultTitle: 'SHRI SHANTAMALLESHWARA SWAMI TEMPLE' },
            ].filter(({ data }) => data?._isEnabled !== false);

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 items-start">
                {activeCards.map(({ data, key, defaultTitle }, idx) => {
                  const isCenteredBottom = idx === 2 && activeCards.length === 3;
                  const title = data?.cardTitle || data?.title || defaultTitle;
                  const address = data?.address || 'Chinmaya Cultural Complex,\nNear Arts College Road,\nAdoni - 518301.';
                  const phone = data?.phone || '+91 7337351555';
                  const email = data?.email || 'contact@chinmayamissionadoni.org';
                  const addressLines = address.split('\n').map((l) => l.trim()).filter(Boolean);

                  return (
                    <div
                      key={key || idx}
                      className={`glass-card p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] shadow-xl space-y-4 sm:space-y-5 w-full ${
                        isCenteredBottom
                          ? 'sm:col-span-2 sm:w-[calc(50%-12px)] sm:justify-self-center'
                          : ''
                      }`}
                    >
                      <h3 className="text-lg sm:text-xl font-black font-heading text-[var(--text-primary)] leading-tight tracking-wide">
                        {title}
                      </h3>

                      <div className="space-y-4 text-xs sm:text-sm text-[var(--text-muted)] font-medium">
                        {/* Address */}
                        <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-2xl bg-[var(--orange)]/15 text-[var(--orange)] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div className="space-y-0.5 pt-0.5">
                            {addressLines.length > 0 ? (
                              addressLines.map((line, lIdx) => (
                                <p key={lIdx} className="m-0 text-xs sm:text-sm font-medium leading-snug">{line}</p>
                              ))
                            ) : (
                              <>
                                <p className="m-0 text-xs sm:text-sm font-medium leading-snug">Chinmaya Cultural Complex,</p>
                                <p className="m-0 text-xs sm:text-sm font-medium leading-snug">Near Arts College Road,</p>
                                <p className="m-0 text-xs sm:text-sm font-medium leading-snug">Adoni - 518301.</p>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-2xl bg-[var(--cyan)]/15 text-[var(--cyan)] flex items-center justify-center flex-shrink-0 shadow-xs">
                            <Phone className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <a
                              href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                              className="hover:text-[var(--orange)] transition-colors text-xs sm:text-sm font-bold text-[var(--text-primary)] tracking-wide truncate block"
                            >
                              {phone}
                            </a>
                          </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center flex-shrink-0 shadow-xs">
                            <Mail className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <a
                              href={`mailto:${email}`}
                              className="hover:text-[var(--orange)] transition-colors text-xs sm:text-sm font-semibold text-[var(--text-primary)] break-all block"
                            >
                              {email}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default LetsConnectPage;
