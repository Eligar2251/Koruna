// Older saved settings used privacyReady for both document readiness and form availability.
export function requestIntakeEnabled(settings = {}) {
  return Object.hasOwn(settings, "requestsEnabled")
    ? settings.requestsEnabled === true
    : settings.privacyReady === true;
}

export function mergeSiteSettings(data, defaults) {
  return {
    ...defaults,
    ...data,
    privacyReady: data.privacyReady === true,
    requestsEnabled: requestIntakeEnabled(data),
    fields: { ...defaults.fields, ...data.fields },
  };
}
