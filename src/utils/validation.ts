const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

export function isValidEmail(email: string) {
  // TODO: I may pull this into zod once we finalize validation requirements.
  return emailRegex.test(email.trim());
}

export function getEmailError(email: string) {
  if (!email.trim()) {
    return 'Email is required';
  }

  if (!isValidEmail(email)) {
    return 'Enter a valid company email';
  }

  return null;
}
