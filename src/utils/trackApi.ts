export enum TrackEventType {
  GetPageRequest = "Get page request",
  FinishBuildPage = "Finish building page",
  DisplayPage = "Display page",
}

interface Payload {
  sessionId: string | undefined;
  [key: string]: any;
}

export const sendTrackEvent = (event: TrackEventType, payload: Payload) => {
  // fake analytics api call
  const trackApiCall = new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, 250);
  });

  return trackApiCall;
};
