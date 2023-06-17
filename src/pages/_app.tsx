import { useEffect } from "react";
import Cookies from "js-cookie";
import { FeatureFlags, growthbook, initializeGrowthbook, sendTrackEvent, TrackEventType } from "@/utils";
import Script from "next/script";
import { AppProps } from "next/app";
import { cookieConsentScript, listenConsentChange } from "@/utils/cookies";
import { GoogleAdsContextProvider, googleAnalyticsScript, googleTagManagerScript, useGoogleAds } from "@/utils/google";
import { GrowthBookProvider, useFeatureValue } from "@growthbook/growthbook-react";

export default function MyApp({ Component, pageProps }: AppProps) {
  const { adsAreInitialized, initializeAds } = useGoogleAds();

  useEffect(() => {
    const sessionId = Cookies.get("sessionId");
    sendTrackEvent(TrackEventType.DisplayPage, { sessionId: sessionId });
  }, []);

  useEffect(() => {
    document.addEventListener("consentChange", listenConsentChange);
    return () => {
      document.removeEventListener("consentChange", listenConsentChange);
    };
  }, []);

  useEffect(() => {
    initializeAds();
  }, []);

  useEffect(() => {
    initializeGrowthbook();
  }, []);

  return (
    <>
      {/* Start setup Google Analytics */}
      <Script strategy="afterInteractive" async src="https://www.googletagmanager.com/gtag/js?id=G-E5CQMYKSER"></Script>
      <Script
        strategy="afterInteractive"
        id="google-analytics"
        dangerouslySetInnerHTML={{ __html: googleAnalyticsScript }}
      />
      {/* End setup Google Analytics */}
      {/* Start initialize Google Tag Manager */}
      <Script id="google-tag-manager" dangerouslySetInnerHTML={{ __html: googleTagManagerScript }} />
      {/* End initialize Google Tag Manager */}
      {/* Start setup Iubenda */}
      <Script id="cookie-consent" dangerouslySetInnerHTML={{ __html: cookieConsentScript }} />
      <Script src="//cdn.iubenda.com/cs/gpp/stub.js" />
      <Script src="//cdn.iubenda.com/cs/iubenda_cs.js" charSet="UTF-8" async />
      {/* End setup Iubenda */}
      {/* Start setup Google Ads */}
      <Script
        type="text/plain"
        class="_iub_cs_activate"
        data-iub-purposes="5"
        data-suppressedsrc="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
      />
      <Script id="initialize-google-ads">{`window.googletag = window.googletag || { cmd: [] }`}</Script>
      {/* End setup Google Ads */}
      <GrowthBookProvider growthbook={growthbook}>
        <GoogleAdsContextProvider adsAreInitialized={adsAreInitialized}>
          <Component {...pageProps} />
        </GoogleAdsContextProvider>
      </GrowthBookProvider>
    </>
  );
}
