import React, { useState, useEffect, useRef } from 'react';
import { GeneralEnquiryPopup } from './GeneralEnquiryPopup';
import './FloatingGeneralEnquiry.css';

/**
 * Constant Floating General Enquiries Button & Corner Widget
 * Stays constant at the right bottom corner (no scrolling movements).
 * Auto-pops up for 10 seconds on website entry (unless already filled and submitted).
 * When clicked, opens a compact square popup box directly at the right bottom corner
 * while leaving the rest of the website visible and interactive.
 */
export const FloatingGeneralEnquiry = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAutoOpened, setIsAutoOpened] = useState(false);
  const autoCloseTimerRef = useRef(null);

  // Auto-pop up for 10 seconds on initial website load if not already submitted
  useEffect(() => {
    try {
      const alreadySubmitted =
        localStorage.getItem('chinmaya_general_enquiry_submitted') === 'true';

      if (!alreadySubmitted) {
        // Small initial delay so page loads smoothly before showing the 10s popup
        const openTimer = setTimeout(() => {
          setIsOpen(true);
          setIsAutoOpened(true);

          autoCloseTimerRef.current = setTimeout(() => {
            setIsOpen(false);
            setIsAutoOpened(false);
          }, 10000);
        }, 1200);

        return () => {
          clearTimeout(openTimer);
          if (autoCloseTimerRef.current) {
            clearTimeout(autoCloseTimerRef.current);
          }
        };
      }
    } catch (e) {
      console.warn('LocalStorage error in FloatingGeneralEnquiry:', e);
    }
  }, []);

  const handleOpenManually = () => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    setIsAutoOpened(false);
    setIsOpen(true);
  };

  const handleClose = () => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    setIsOpen(false);
    setIsAutoOpened(false);
  };

  const handleUserInteracted = () => {
    // If the user starts interacting or typing, cancel the 10-second auto-close
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    setIsAutoOpened(false);
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={handleOpenManually}
          className="floating-general-enquiry-btn"
          aria-label="Open General Enquiries Form"
          title="General enquiries — Click to submit an enquiry"
        >
          <span className="floating-enquiry-text-top">General</span>
          <span className="floating-enquiry-text-bottom">enquiries</span>
        </button>
      )}

      {isOpen && (
        <GeneralEnquiryPopup
          onClose={handleClose}
          onUserInteracted={handleUserInteracted}
          isAutoOpened={isAutoOpened}
        />
      )}
    </>
  );
};

export default FloatingGeneralEnquiry;
