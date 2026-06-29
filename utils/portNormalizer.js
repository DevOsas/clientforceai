/**
 * Normalizes port values in email account data to ensure they are numbers
 * @param {Object} data - The email account data
 * @returns {Object} - The normalized data with port values as numbers
 */
export function normalizeEmailAccountPorts(data) {
  const normalized = { ...data }

  // Normalize SMTP settings port
  if (normalized.smtpSettings && normalized.smtpSettings.port !== null && normalized.smtpSettings.port !== undefined && normalized.smtpSettings.port !== '') {
    console.log('Normalizing SMTP port from:', normalized.smtpSettings.port, 'type:', typeof normalized.smtpSettings.port)
    normalized.smtpSettings = {
      ...normalized.smtpSettings,
      port: Number(normalized.smtpSettings.port)
    }
    console.log('Normalized SMTP port to:', normalized.smtpSettings.port, 'type:', typeof normalized.smtpSettings.port)
  }

  // Normalize IMAP settings port
  if (normalized.imapSettings && normalized.imapSettings.port !== null && normalized.imapSettings.port !== undefined && normalized.imapSettings.port !== '') {
    console.log('Normalizing IMAP port from:', normalized.imapSettings.port, 'type:', typeof normalized.imapSettings.port)
    normalized.imapSettings = {
      ...normalized.imapSettings,
      port: Number(normalized.imapSettings.port)
    }
    console.log('Normalized IMAP port to:', normalized.imapSettings.port, 'type:', typeof normalized.imapSettings.port)
  }

  console.log('Final normalized data:', JSON.stringify(normalized, null, 2))
  return normalized
}
