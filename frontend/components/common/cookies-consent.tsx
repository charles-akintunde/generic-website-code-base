'use client';
import React, { useEffect, useState } from 'react';
import CookieConsent, { Cookies } from 'react-cookie-consent';

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
        background: 'hsl(var(--primary))',
        color: 'hsl(var(--primary-foreground))',
        boxShadow: `0px 4px 15px hsla(var(--foreground), 0.3)`,
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      buttonStyle={{
        background: 'hsl(var(--secondary))',
        color: 'hsl(var(--secondary-foreground))',
        fontSize: '13px',
        border: 'none',
        borderRadius: 'var(--radius)',
        padding: '0.5rem 1rem',
      }}
      declineButtonStyle={{
        background: 'hsl(var(--destructive))',
        color: 'hsl(var(--destructive-foreground))',
        fontSize: '13px',
        border: 'none',
        borderRadius: 'var(--radius)',
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
      <a
        href="/cookie-policy"
        style={{ color: 'hsl(var(--primary-foreground))' }}
      >
        Learn More
      </a>
    </CookieConsent>
  );
};

export default CookieConsentBanner;
