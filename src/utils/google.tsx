import { createContext, ReactNode, useEffect, useState } from "react";

export const googleTagManagerScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MH5XDMB')`;

export const useGoogleAds = () => {
  const [adsAreInitialized, setAdsAreInitialized] = useState(false);

  const initializeAds = () => {
    googletag.cmd.push(() => {
      // targeting key-value pairs explained here: https://support.google.com/admanager/answer/188092
      googletag.pubads().setTargeting("page", ["whatever"]);
      // single request explained here: https://developers.google.com/publisher-tag/guides/ad-best-practices
      googletag.pubads().enableSingleRequest();
      // collapse empty divs explained here: https://developers.google.com/publisher-tag/samples/collapse-empty-ad-slots
      googletag.pubads().collapseEmptyDivs();
      // enables all GPT services that have been defined for ad slots on the page
      googletag.enableServices();

      setAdsAreInitialized(true);
    });
  };

  return { adsAreInitialized, initializeAds };
};

export const getAdSlot = (adSlotId: string) => {
  return googletag
    .pubads()
    .getSlots()
    .find((slot) => slot.getSlotElementId() === adSlotId);
};

// when initialize ads with sizeMapping, we need to refresh the ads when the viewport size changes, to manually
// adjust our ads to correct size. This event listener should be rather handled somewhere globally if possible
// to refresh all ads at once, to avoid having separate listener for each ad.
const handleScreenResizeEvent = (adSlotId: string) => {
  googletag.cmd.push(() => {
    const slot = getAdSlot(adSlotId);

    if (!slot) return;

    googletag.pubads().refresh([slot]);
  });
};

export const useResizeGoogleAd = (adSlotId: string) => {
  return useEffect(() => {
    const screenResizeEventHandler = () => handleScreenResizeEvent(adSlotId);

    const mediaQuery = window.matchMedia("(min-width: 960px)");

    mediaQuery.addEventListener("change", screenResizeEventHandler);

    return () => {
      mediaQuery.removeEventListener("change", screenResizeEventHandler);
    };
  }, []);
};

export const GoogleAdsContext = createContext({ adsAreInitialized: false });

export const GoogleAdsContextProvider = ({
  children,
  adsAreInitialized,
}: {
  children: ReactNode;
  adsAreInitialized: boolean;
}) => <GoogleAdsContext.Provider value={{ adsAreInitialized }}>{children}</GoogleAdsContext.Provider>;

export const googleAnalyticsScript = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-E5CQMYKSER');
`;
