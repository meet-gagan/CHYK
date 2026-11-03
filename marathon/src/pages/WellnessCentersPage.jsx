import React, { useState, useMemo, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  UserCheck,
  Search,
  Filter,
  Copy,
  Check,
  Sparkles,
  Info,
  ShieldCheck,
  Stethoscope,
  X,
  ExternalLink,
} from 'lucide-react';
import { WELLNESS_CENTERS, DISTRICT_OPTIONS } from '../data/wellnessCentersData';

export const WellnessCentersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [copiedAddressId, setCopiedAddressId] = useState(null);

  useEffect(() => {
    document.title = 'Wellness Centers | Anti-Drug Movement Marathon Run 2026';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Summary statistics derived directly from dataset
  const stats = useMemo(() => {
    const total = WELLNESS_CENTERS.length;
    const government = WELLNESS_CENTERS.filter((c) => c.type === 'Government').length;
    const ngo = WELLNESS_CENTERS.filter((c) => c.type === 'NGO').length;
    return { total, government, ngo };
  }, []);

  // Filtered centers based on search query and district selection
  const filteredCenters = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return WELLNESS_CENTERS.filter((center) => {
      // District filter
      if (selectedDistrict !== 'All Districts' && center.district !== selectedDistrict) {
        return false;
      }

      // Search query filter (matches center name, district, organization, doctor, address, contact numbers, additional info)
      if (query) {
        const matchesName = center.name.toLowerCase().includes(query);
        const matchesDistrict = center.district.toLowerCase().includes(query);
        const matchesOrg = center.organization.toLowerCase().includes(query);
        const matchesDoctor = center.doctor.toLowerCase().includes(query);
        const matchesAddress = center.address.toLowerCase().includes(query);
        const matchesInfo = center.additionalInfo.toLowerCase().includes(query);
        const matchesPhone = center.contactNumbers.some((num) => num.includes(query));
        const matchesDocPhone = center.doctorPhone.includes(query);

        return (
          matchesName ||
          matchesDistrict ||
          matchesOrg ||
          matchesDoctor ||
          matchesAddress ||
          matchesInfo ||
          matchesPhone ||
          matchesDocPhone
        );
      }

      return true;
    });
  }, [searchTerm, selectedDistrict]);

  // Copy address to clipboard handler
  const handleCopyAddress = async (id, address) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(address);
        setCopiedAddressId(id);
        setTimeout(() => setCopiedAddressId(null), 2000);
      }
    } catch (_) {
      // Fallback if clipboard API is constrained
      setCopiedAddressId(id);
      setTimeout(() => setCopiedAddressId(null), 2000);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedDistrict('All Districts');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary,#FFFDF9)] py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        
        {/* ======================================================== */}
        {/* PAGE HEADER */}
        {/* ======================================================== */}
        <header className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-[var(--text-primary,#0B2340)] tracking-tight">
            Wellness Centers
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-[var(--text-muted,#64748B)] font-medium leading-relaxed">
            Find government hospitals and NGO support centers nearby.
          </p>
        </header>

        {/* ======================================================== */}
        {/* SUMMARY STATISTICS (Derived dynamically from dataset) */}
        {/* ======================================================== */}
        <section
          aria-label="Centers Overview Statistics"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto"
        >
          {/* Total Centers */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[var(--border-color,#E5E7EB)] shadow-[0_1px_3px_rgba(11,35,64,0.04),0_6px_16px_rgba(11,35,64,0.04)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--orange,#FF6600)]/10 text-[var(--orange,#FF6600)] flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[var(--text-muted)] block">
                Total Centers
              </span>
              <p className="text-2xl sm:text-3xl font-black font-heading text-[var(--text-primary)]">
                {stats.total}
              </p>
            </div>
          </div>

          {/* Government Centers */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[var(--border-color,#E5E7EB)] shadow-[0_1px_3px_rgba(11,35,64,0.04),0_6px_16px_rgba(11,35,64,0.04)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[var(--text-muted)] block">
                Government Centers
              </span>
              <p className="text-2xl sm:text-3xl font-black font-heading text-emerald-700">
                {stats.government}
              </p>
            </div>
          </div>

          {/* NGO Centers */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[var(--border-color,#E5E7EB)] shadow-[0_1px_3px_rgba(11,35,64,0.04),0_6px_16px_rgba(11,35,64,0.04)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[var(--text-muted)] block">
                NGO Centers
              </span>
              <p className="text-2xl sm:text-3xl font-black font-heading text-indigo-700">
                {stats.ngo}
              </p>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SEARCH & FILTERS */}
        {/* ======================================================== */}
        <section
          aria-label="Search and Filter Centers"
          className="p-4 sm:p-6 rounded-3xl bg-white border border-[var(--border-color,#E5E7EB)] shadow-sm space-y-4 max-w-5xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 sm:gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by center, district, organization, doctor, or address..."
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[var(--bg-primary,#FFFDF9)] border border-[var(--border-color,#E5E7EB)] focus:border-[var(--orange)] focus:ring-2 focus:ring-[var(--orange)]/20 outline-hidden text-xs sm:text-sm font-semibold text-[var(--text-primary)] transition-all placeholder:text-[var(--text-muted)]/70"
                aria-label="Search wellness centers"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                  title="Clear search input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* District Filter Dropdown */}
            <div className="relative w-full md:w-64 shrink-0">
              <Filter className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full pl-10 pr-8 py-3 rounded-2xl bg-[var(--bg-primary,#FFFDF9)] border border-[var(--border-color,#E5E7EB)] focus:border-[var(--orange)] focus:ring-2 focus:ring-[var(--orange)]/20 outline-hidden text-xs sm:text-sm font-bold text-[var(--text-primary)] cursor-pointer transition-all appearance-none"
                aria-label="Filter by district"
              >
                {DISTRICT_OPTIONS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)]">
                ▼
              </div>
            </div>

          </div>

          {/* Active Filter Pills Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2 text-[var(--text-muted)] font-semibold">
              <span>Showing:</span>
              <span className="font-extrabold text-[var(--text-primary)]">
                {filteredCenters.length} of {WELLNESS_CENTERS.length} Centers
              </span>
              {selectedDistrict !== 'All Districts' && (
                <span className="px-2 py-0.5 rounded-full bg-[var(--orange)]/10 text-[var(--orange)] font-bold text-[11px]">
                  District: {selectedDistrict}
                </span>
              )}
              {searchTerm && (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[var(--text-primary)] font-bold text-[11px] truncate max-w-[150px]">
                  "{searchTerm}"
                </span>
              )}
            </div>

            {(searchTerm || selectedDistrict !== 'All Districts') && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-[11px] font-bold text-[var(--orange)] hover:underline cursor-pointer bg-transparent border-0 p-0"
              >
                Clear all filters
              </button>
            )}
          </div>
        </section>

        {/* ======================================================== */}
        {/* CARD GRID (3 cols desktop, 2 cols tablet, 1 col mobile) */}
        {/* ======================================================== */}
        {filteredCenters.length > 0 ? (
          <section
            aria-label="Wellness Centers List"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch"
          >
            {filteredCenters.map((center) => {
              const isGovt = center.type === 'Government';
              const isCopied = copiedAddressId === center.id;

              return (
                <article
                  key={center.id}
                  className="rounded-3xl bg-white border border-[var(--border-color,#E5E7EB)] shadow-[0_1px_3px_rgba(11,35,64,0.04),0_8px_24px_rgba(11,35,64,0.06)] hover:shadow-[0_4px_12px_rgba(11,35,64,0.08),0_16px_32px_rgba(11,35,64,0.08)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden"
                >
                  {/* Card Header & Badges */}
                  <div className="p-5 sm:p-6 space-y-4">
                    
                    {/* Top Badges: Type and District */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                          isGovt
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}
                      >
                        {isGovt ? (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <Stethoscope className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        )}
                        <span>{center.type}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--text-muted)] bg-slate-50 px-2.5 py-0.5 rounded-lg border border-slate-200/80">
                        <MapPin className="w-3 h-3 text-[var(--orange)] shrink-0" />
                        <span>{center.district}</span>
                      </span>
                    </div>

                    {/* Hospital / Center Name */}
                    <div>
                      <h2 className="text-lg sm:text-xl font-black font-heading text-[var(--text-primary)] leading-snug">
                        {center.name}
                      </h2>

                      {/* Organization Name (if provided) */}
                      {center.organization && (
                        <p className="text-xs font-bold text-[var(--orange)] mt-1 flex items-start gap-1.5 leading-snug">
                          <Building2 className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-80" />
                          <span>{center.organization}</span>
                        </p>
                      )}
                    </div>

                    {/* Complete Address */}
                    <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-[var(--text-muted)]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[var(--orange)]" />
                          <span>Address</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyAddress(center.id, center.address)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--orange)] hover:underline cursor-pointer bg-transparent border-0 p-0"
                          title="Copy address to clipboard"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-[var(--text-primary)]/90 font-medium leading-relaxed break-words">
                        {center.address}
                      </p>
                    </div>

                    {/* Primary Center Contact Numbers */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-black uppercase tracking-wider text-[var(--text-muted)] block">
                        Center Contact Numbers
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {center.contactNumbers.map((num, idx) => (
                          <a
                            key={idx}
                            href={`tel:${num.replace(/\s+/g, '')}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-extrabold text-[var(--text-primary)] hover:border-[var(--orange)] hover:text-[var(--orange)] transition-colors text-decoration-none shadow-xs"
                            title={`Call ${num}`}
                          >
                            <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>{num}</span>
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Doctor & Additional Contact (where provided) */}
                    {(center.doctor || center.doctorPhone) && (
                      <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-1.5">
                        <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>Doctor / Specialist In-Charge</span>
                        </span>
                        
                        <div className="text-xs text-[var(--text-primary)] font-bold flex flex-wrap items-center justify-between gap-2">
                          <span>{center.doctor || 'Doctor on duty'}</span>
                          {center.doctorPhone && (
                            <a
                              href={`tel:${center.doctorPhone.replace(/\s+/g, '')}`}
                              className="inline-flex items-center gap-1 text-[11px] font-black text-amber-900 bg-amber-200/60 hover:bg-amber-200 px-2.5 py-1 rounded-lg text-decoration-none transition-colors"
                              title={`Call ${center.doctor || 'Doctor'}: ${center.doctorPhone}`}
                            >
                              <Phone className="w-2.5 h-2.5 text-amber-800" />
                              <span>{center.doctorPhone}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Additional Medical Staff / Duty Details (where provided) */}
                    {center.additionalInfo && (
                      <div className="p-3 rounded-2xl bg-cyan-50/50 border border-cyan-200/60 space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-cyan-800 flex items-center gap-1">
                          <Info className="w-3 h-3 text-cyan-600 shrink-0" />
                          <span>Medical Support & Duty Staff</span>
                        </span>
                        <p className="text-[11px] text-[var(--text-primary)]/85 font-medium leading-relaxed">
                          {center.additionalInfo}
                        </p>
                      </div>
                    )}

                  </div>

                  {/* Card Bottom Accent Strip */}
                  <div
                    className={`h-1.5 w-full ${
                      isGovt ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                    }`}
                  />
                </article>
              );
            })}
          </section>
        ) : (
          /* Empty State */
          <div className="max-w-md mx-auto text-center p-10 sm:p-12 rounded-3xl bg-white border border-[var(--border-color)] shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
              <Search className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-heading font-black text-lg text-[var(--text-primary)]">
                No Centers Found
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                No wellness or de-addiction centers matched your search query or selected district. Try adjusting your search term.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClearFilters}
              className="btn-primary py-2.5 px-6 text-xs font-bold inline-flex items-center gap-1.5 shadow-md"
            >
              <span>Clear All Filters</span>
            </button>
          </div>
        )}

        {/* Source Attribution Note */}
        <div className="pt-2 sm:pt-4 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/80 border border-[var(--border-color)] text-xs text-[var(--text-muted)] shadow-sm">
            <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="font-bold text-[var(--text-primary)]">Note:</span>
            <span>All information has been fetched from:</span>
            <a
              href="https://eagle.appolice.gov.in/de-addiction-centres"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--orange)] hover:underline font-semibold inline-flex items-center gap-1 break-all"
            >
              https://eagle.appolice.gov.in/de-addiction-centres
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WellnessCentersPage;

