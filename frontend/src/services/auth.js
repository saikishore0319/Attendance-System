import { cognitoConfig } from "./cognitoConfig";

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

export function isFaceEnrolled() {
  return localStorage.getItem("faceEnrolled") === "true";
}

export function login(token) {
  localStorage.setItem("token", token);
}

export function logout() {
  localStorage.clear();

  const logoutUrl =
    `${cognitoConfig.domain}/logout` +
    `?client_id=${cognitoConfig.clientId}` +
    `&logout_uri=${encodeURIComponent(cognitoConfig.redirectUri)}`;

  window.location.href = logoutUrl;
}