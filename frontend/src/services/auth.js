import { cognitoConfig } from "./cognitoConfig";

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function login(token) {
  localStorage.setItem("token", token);
}

export function logout() {
  localStorage.removeItem("token");

  const logoutUrl =
    `${cognitoConfig.domain}/logout` +
    `?client_id=${cognitoConfig.clientId}` +
    `&logout_uri=${encodeURIComponent(cognitoConfig.redirectUri)}`;

  window.location.href = logoutUrl;
}