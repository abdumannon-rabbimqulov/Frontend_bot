export function getDriverToken() {
  return localStorage.getItem('driver_access_token');
}

export function setDriverSession(payload) {
  localStorage.setItem('driver_access_token', payload.access_token);
  if (payload.refresh_token != null && payload.refresh_token !== '') {
    localStorage.setItem('driver_refresh_token', payload.refresh_token);
  }
  localStorage.setItem('driver_user', JSON.stringify(payload));
}

export function clearDriverSession() {
  localStorage.removeItem('driver_access_token');
  localStorage.removeItem('driver_refresh_token');
  localStorage.removeItem('driver_user');
  localStorage.removeItem('driver_profile_completed');
}

export function getDriverUser() {
  const raw = localStorage.getItem('driver_user');
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isDriverLoggedIn() {
  return !!getDriverToken();
}
