/**
 * Utility to format opportunity deadlines gracefully.
 * Replaces raw snake_case developer strings with human-readable text in Hindi & English,
 * and formats ISO dates cleanly into localized date strings.
 */
export function formatDeadlineText(
  deadline: string | undefined,
  daysRemaining: number | undefined,
  language: string,
  daysRemainingLabel: string = 'days remaining'
): string {
  if (daysRemaining !== undefined && daysRemaining > 0) {
    return `${daysRemaining} ${daysRemainingLabel}`;
  }

  if (!deadline) {
    return language === 'hi' ? 'निरंतर चालू' : 'Ongoing';
  }

  if (deadline === 'UPCOMING_ANNUAL_CYCLE') {
    return language === 'hi' ? 'वार्षिक कैलेंडर (आगामी चक्र)' : 'Annual Cycle (Upcoming)';
  }

  if (deadline === 'OPEN_ROUND') {
    return language === 'hi' ? 'वर्ष भर उपलब्ध' : 'Open Round (Year-Round)';
  }

  // Format YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
    try {
      const [year, month, day] = deadline.split('-');
      const d = new Date(Number(year), Number(month) - 1, Number(day));
      const formatted = d.toLocaleDateString(language === 'hi' ? 'hi-IN-u-nu-latn' : 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      return formatted.replace(/[०-९]/g, (digit) => String('०१२३४५६७८९'.indexOf(digit)));
    } catch {
      return deadline;
    }
  }

  return deadline;
}

/**
 * Checks whether an opportunity's application closing deadline has already elapsed in the past.
 * Returns true only for expired ISO dates (YYYY-MM-DD), allowing a grace period until end of the deadline day.
 * Perpetual opportunities (OPEN_ROUND, UPCOMING_ANNUAL_CYCLE, ONGOING) never expire automatically.
 */
export function isOpportunityDeadlinePassed(deadline?: string): boolean {
  if (!deadline) return false;
  if (
    deadline === 'OPEN_ROUND' ||
    deadline === 'UPCOMING_ANNUAL_CYCLE' ||
    deadline === 'ONGOING'
  ) {
    return false;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
    const [year, month, day] = deadline.split('-').map(Number);
    // End of the deadline day (23:59:59.999 local time)
    const deadlineEnd = new Date(year, month - 1, day, 23, 59, 59, 999);
    return Date.now() > deadlineEnd.getTime();
  }

  return false;
}
