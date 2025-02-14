'use client';
import React, { useEffect, useState } from 'react';
import CookieConsent, { Cookies } from 'react-cookie-consent';
import Link from 'next/link';

const CookieConsentBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = Cookies.get('userConsent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    Cookies.set('userConsent', 'true', { expires: 150 });
    // Add any additional logic for enabling cookies
  };

  const handleDeclineCookies = () => {
    Cookies.remove('userConsent');
    // Add any additional logic for disabling cookies
  };

  if (!visible) {
    return null;
  }

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      cookieName="userConsent"
      style={{
        background: '#F4F6FA', // Muted light background to blend with the page
        color: '#2B2D42', // Dark gray for the text to ensure readability
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)', // Soft shadow for depth
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      buttonStyle={{
        background: '#3B82F6', // Eye-catching but soft blue for the accept button
        color: '#FFFFFF', // White text for contrast
        fontSize: '13px',
        border: 'none',
        borderRadius: '8px',
        padding: '0.5rem 1rem',
      }}
      declineButtonStyle={{
        background: '#EF4444', // Muted red for the decline button
        color: '#FFFFFF', // White text for contrast
        fontSize: '13px',
        border: 'none',
        borderRadius: '8px',
        padding: '0.5rem 1rem',
        marginLeft: '1rem',
      }}
      expires={150}
      onAccept={handleAcceptCookies}
      onDecline={handleDeclineCookies}
      enableDeclineButton
    >
      We use cookies to improve your experience. By using our site, you consent
      to cookies.{' '}
      <Link
        href="/cookie-policy"
        style={{ color: '#3B82F6', textDecoration: 'underline' }}
      >
        Learn More
      </Link>
    </CookieConsent>
  );
};

export default CookieConsentBanner;
