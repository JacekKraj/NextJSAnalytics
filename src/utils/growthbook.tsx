import { GrowthBook } from "@growthbook/growthbook";
import { getGoogleAnalyticsClientId } from "@/utils/cookies";

const GROWTHBOOK_CLIENT_KEY = "sdk-UE7jZytifuAEM1Sd";
const GROWTHBOOK_API_HOST = "https://cdn.growthbook.io";

export const growthbook = new GrowthBook({
  apiHost: GROWTHBOOK_API_HOST,
  clientKey: GROWTHBOOK_CLIENT_KEY,
  enableDevMode: true,
  trackingCallback: (experiment, result) => {
    if ("gtag" in window) {
      window.gtag("event", "experiment_viewed", {
        event_category: "experiment",
        experiment_id: experiment.key,
        variation_id: result.variationId,
      });
    }
  },
});

export const initializeGrowthbook = () => {
  growthbook.loadFeatures();

  // values below should contain real targeting attribute values, to enable
  // target feature flags based on user attributes
  growthbook.setAttributes({
    id: "fsssas",
    deviceId: "foo",
    company: "foo",
    loggedIn: true,
    employee: true,
    country: "foo",
    browser: "foo",
    url: "foo",
    attributes: {
      clientId: getGoogleAnalyticsClientId(),
    },
  });
};

export enum FeatureFlags {
  ShowTitle = "show-title",
  HideTitle = "hide-title",
}
