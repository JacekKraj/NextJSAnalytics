import { useContext, useEffect } from "react";
import { getAdSlot, GoogleAdsContext, useResizeGoogleAd } from "@/utils/google";

interface AdvertisementProps {
  width: number;
  height: number;
}

interface AdSlot {
  adSlotId: string;
}

const AD_UNIT_PATH = "/6355419/Travel/Europe/France/Paris";

// this showAd method could be useful when for example loading new ads in in infinite scroll.
// When count of ads is know since the first render, all slots should be defined together to be able to batch
// their requests. Example of batching here: https://developers.google.com/publisher-tag/guides/ad-best-practices
const showAd = ({ width, height, adSlotId }: AdvertisementProps & AdSlot) => {
  googletag.cmd.push(() => {
    // Define an ad slot
    const googleAdSlot = googletag.defineSlot(AD_UNIT_PATH, [width, height], adSlotId)?.addService(googletag.pubads());

    // Define size mapping explained here: https://developers.google.com/publisher-tag/guides/ad-sizes#responsive_ads
    const mapping = googletag.sizeMapping().addSize([960, 540], [300, 250]).addSize([0, 0], []).build();
    googleAdSlot?.defineSizeMapping(mapping);

    // Request and render an ad for the slot
    googletag.display(adSlotId);
  });
};

const removeAd = (adSlotId: string) => {
  googletag.cmd.push(() => {
    // find related slot
    const slot = getAdSlot(adSlotId);

    // remove existing slot
    if (!slot) return;

    googletag.destroySlots([slot]);
  });
};

export const Advertisement = ({ width, height }: AdvertisementProps) => {
  const { adsAreInitialized } = useContext(GoogleAdsContext);
  const adSlotId = AD_UNIT_PATH;

  useResizeGoogleAd(adSlotId);

  useEffect(() => {
    if (adsAreInitialized) {
      showAd({ width, height, adSlotId });
    }

    return () => {
      removeAd(adSlotId);
    };
  }, [adsAreInitialized]);

  return <div id={adSlotId}></div>;
};
