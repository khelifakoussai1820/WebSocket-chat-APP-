export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getOtpExpiration() {
  const expiration = new Date();

  expiration.setMinutes(expiration.getMinutes() + 10);

  return expiration;
}
