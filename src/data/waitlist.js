// Where waitlist signups go.
//
// Until this is set, the form renders in a visibly disabled state rather than
// silently swallowing addresses — a signup form that accepts an email and drops
// it is worse than no form, because you lose the signup AND the person thinks
// they're on the list.
//
// To connect it: create a free form at https://formspree.io (or Tally, Buttondown,
// ConvertKit — anything that accepts a POST with JSON), then paste the endpoint
// URL below. The shape posted is { email, species, source }.
//
// The conversion rate on this form is the "waitlist conversion from strangers"
// evidence the pitch deck names as the biggest Round 1 gap, so it is worth
// wiring to something that reports numbers rather than to an inbox.

export const WAITLIST_ENDPOINT = null; // e.g. "https://formspree.io/f/xxxxxxxx"

export const isWaitlistLive = () =>
  typeof WAITLIST_ENDPOINT === "string" && WAITLIST_ENDPOINT.startsWith("http");
