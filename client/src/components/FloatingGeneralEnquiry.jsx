import React, { useState, useEffect, useRef } from 'react';
import { GeneralEnquiryPopup } from './GeneralEnquiryPopup';
import './FloatingGeneralEnquiry.css';

/**
 * Floating Persistent General Enquiries Button
 * Fixed on screen across all pages, starts from the top ("up") right below
 * the header/announcement banner, dynamically moves down and up as the user scrolls,
 * and allows devotees to open and submit enquiries unlimited times.
 */
export const FloatingGeneralEnquiry = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollDelta, setScrollDelta] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY || window.pageYOffset || 0;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const progress = Math.min(1, Math.max(0, currentScrollY / maxScroll));
      const delta = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollProgress(progress);
          setScrollDelta(Math.max(-24, Math.min(24, delta * 0.75)));
          setIsScrolling(true);

          if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
          scrollTimeout.current = setTimeout(() => {
            setIsScrolling(false);
            setScrollDelta(0);
          }, 180);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  // Calculate dynamic vertical position:
  // Starts from "up" near the top (~13vh / min-top below navbar & ticker)
  // and smoothly glides down towards the bottom (~84vh) as you scroll down.
  const dynamicTopVh = 13 + scrollProgress * 71;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`floating-general-enquiry-btn ${!isScrolling ? 'is-idle' : 'is-scrolling'}`}
        style={{
          top: `calc(max(var(--min-top, 122px), ${dynamicTopVh}vh) + ${scrollDelta}px)`,
        }}
        aria-label="Open General Enquiries Form"
        title="General enquiries — Click to submit an enquiry"
      >
        <span className="floating-enquiry-text-top">General</span>
        <span className="floating-enquiry-text-bottom">enquiries</span>
      </button>

      {isOpen && <GeneralEnquiryPopup onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default FloatingGeneralEnquiry;
