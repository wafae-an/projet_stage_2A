"use client"

export function logout() {
  localStorage.removeItem("token")
  window.location.href = "/login" // Redirection vers la page de login
}
