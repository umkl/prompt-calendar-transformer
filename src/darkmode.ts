document.documentElement.classList.toggle(
  "dark",
  localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
);

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  if (!("theme" in localStorage)) {
    document.documentElement.classList.toggle("dark", e.matches);
  }
});