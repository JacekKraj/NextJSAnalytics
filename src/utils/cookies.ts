import { NextRequest, NextResponse } from "next/server";
import { SESSION_ID } from "@/utils/consts";
import { v4 as uuidv4 } from "uuid";
import { sendTrackEvent, TrackEventType } from "@/utils/trackApi";
import Cookies from "js-cookie";

enum CookieConsentStatus {
  Pending,
  Accepted,
  Rejected,
}

const getCookieConsentStatus = (request: NextRequest) => {
  const cookieConsent = request.cookies.get("_iub_cs-80193945");
  const preferences = cookieConsent ? JSON.parse(decodeURI(cookieConsent.value)) : undefined;

  if (!preferences) return CookieConsentStatus.Pending;
  if (preferences.purposes["4"] && preferences.purposes["5"]) return CookieConsentStatus.Accepted;
  return CookieConsentStatus.Rejected;
};

export const initializeCookies = (request: NextRequest, response: NextResponse) => {
  const consentStatus = getCookieConsentStatus(request);
  const sessionId = request.cookies.get(SESSION_ID)?.value || uuidv4();
  let expirationDate: Date | undefined;

  if (consentStatus === CookieConsentStatus.Accepted) {
    expirationDate = new Date(new Date().getTime() + 30 * 60000); // 30 minutes
  }

  if (consentStatus === CookieConsentStatus.Pending) {
    expirationDate = undefined;
  }

  if (consentStatus !== CookieConsentStatus.Rejected) {
    response.cookies.set(SESSION_ID, sessionId, { expires: expirationDate });
    response.headers.set(SESSION_ID, sessionId);
  }

  sendTrackEvent(TrackEventType.GetPageRequest, { sessionId: sessionId });
};

export const listenConsentChange = (e: CustomEvent<{ consentWasGiven: boolean }>) => {
  const consentWasGiven = e.detail.consentWasGiven;
  const sessionId = Cookies.get(SESSION_ID) || uuidv4();

  if (consentWasGiven) {
    Cookies.set(SESSION_ID, sessionId, { expires: new Date(new Date().getTime() + 30 * 60000) });
  } else {
    Cookies.remove(SESSION_ID);
  }
};

export const getGoogleAnalyticsClientId = () => {
  const cookie = document.cookie.match(/_ga=(.+?);/);

  if (cookie instanceof Array) {
    return cookie[1].split(".").slice(-2).join(".");
  }

  return "UNKNOWN";
};

export const cookieConsentScript = `
        var _iub = _iub || [];
        
        {_iub.csConfiguration = {
        "askConsentAtCookiePolicyUpdate": true,
        "countryDetection": true,
        "callback": {
            "onPreferenceExpressed": function(preference) {
                const consentWasGiven = preference.purposes['4'] && preference.purposes['5'];
                const event = new CustomEvent("consentChange", { detail: { consentWasGiven } })
                document.dispatchEvent(event);

                dataLayer.push({
                  event: 'iubenda_cookie_consent_changed',
                  cookie_consent: consentWasGiven ? 'accepted' : 'rejected'
                });
            },  
        },
        "enableLgpd": true,
        "enableUspr": true,
        "floatingPreferencesButtonDisplay": "anchored-top-right",
        "lang": "en",
        "lgpdAppliesGlobally": false,
        "perPurposeConsent": true,
        "whitelabel": false,
        "cookiePolicyId": 80193945,
        "siteId": 3060623,
        "banner": {
            "acceptButtonDisplay": true,
            "closeButtonDisplay": false,
            "customizeButtonDisplay": true,
            "explicitWithdrawal": true,
            "listPurposes": true,
            "position": "bottom",
            "rejectButtonDisplay": true,
            "showPurposesToggles": true
        }
    }}`;
