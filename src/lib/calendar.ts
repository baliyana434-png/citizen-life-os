import { Opportunity } from '@/types';

/**
 * Generates an official 1-click Google Calendar Event URL for an opportunity's deadline.
 * Pre-populates the event title, start/end dates, issuing authority, circular number,
 * and the verified official portal URL.
 */
export function generateGoogleCalendarUrl(
  opportunity: Opportunity,
  localizedTitle: string,
  localizedAuthority: string
): string {
  let startDate = '20261015T043000Z'; // default 10:00 AM IST
  let endDate = '20261015T123000Z';   // default 06:00 PM IST

  // Parse YYYY-MM-DD deadline if valid
  if (opportunity.deadline && /^\d{4}-\d{2}-\d{2}$/.test(opportunity.deadline)) {
    const rawDate = opportunity.deadline.replace(/-/g, '');
    startDate = `${rawDate}T043000Z`;
    endDate = `${rawDate}T123000Z`;
  } else {
    // If deadline is OPEN_ROUND or rolling, set alert for 7 days ahead
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const yyyymmdd = nextWeek.toISOString().slice(0, 10).replace(/-/g, '');
    startDate = `${yyyymmdd}T043000Z`;
    endDate = `${yyyymmdd}T123000Z`;
  }

  const portalUrl = opportunity.gazette?.officialPortalUrl || 'https://pib.gov.in';
  const circularNo = opportunity.gazette?.circularNumber || 'Official Circular';

  const eventTitle = `[Deadline Alert] ${localizedTitle}`;
  const details = [
    `Official Deadline Reminder for: ${localizedTitle}`,
    `Issuing Authority: ${localizedAuthority}`,
    `Notice/Circular: ${circularNo}`,
    `Official Direct Portal: ${portalUrl}`,
    '',
    'Verified via Citizen Life OS (Zero-Commission, Zero-Scam Official Gateway).'
  ].join('\n');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventTitle,
    dates: `${startDate}/${endDate}`,
    details,
    location: portalUrl,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
