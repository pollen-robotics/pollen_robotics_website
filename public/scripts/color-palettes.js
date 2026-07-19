/*
 * Lightweight color palette helper for self-contained article embeds.
 * Exposes `window.ColorPalettes` with a small, dependency-free API compatible
 * with the research-article-template conventions:
 *   - getPrimary()                      -> brand accent (reads --article-primary)
 *   - getColors(kind, n)                -> array of n colors
 *                                          kind: 'categorical'|'sequential'|'diverging'
 *   - getTextStyleForBackground(bg)     -> { color } readable over bg
 *   - refresh() / notify()              -> re-read theme + emit 'palettes:updated'
 * Colors follow the theme via the --article-* CSS variables. Embeds must read
 * colors from here instead of hardcoding them.
 */
(function () {
  "use strict";
  if (window.ColorPalettes) return;

  var FALLBACK_PRIMARY = "#FF9500";

  function cssVar(name, fallback) {
    var scope = document.querySelector(".article-root") || document.documentElement;
    var v = getComputedStyle(scope).getPropertyValue(name);
    v = (v || "").trim();
    return v || fallback;
  }

  function getPrimary() {
    return cssVar("--article-primary", FALLBACK_PRIMARY);
  }

  // Parse a CSS color (hex or rgb[a]) into {r,g,b} 0-255.
  function toRgb(color) {
    if (!color) return { r: 255, g: 149, b: 0 };
    color = color.trim();
    if (color[0] === "#") {
      var hex = color.slice(1);
      if (hex.length === 3) hex = hex.replace(/./g, "$&$&");
      var n = parseInt(hex, 16);
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
    }
    var m = color.match(/rgba?\(([^)]+)\)/);
    if (m) {
      var p = m[1].split(",").map(function (x) { return parseFloat(x); });
      return { r: p[0], g: p[1], b: p[2] };
    }
    return { r: 255, g: 149, b: 0 };
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    }
    return { h: h, s: s, l: l };
  }

  function hslToCss(h, s, l) {
    return "hsl(" + Math.round(((h % 360) + 360) % 360) + ", " + Math.round(s * 100) + "%, " + Math.round(l * 100) + "%)";
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function categorical(n) {
    var base = rgbToHsl(toRgb(getPrimary()).r, toRgb(getPrimary()).g, toRgb(getPrimary()).b);
    var out = [];
    // Even hue rotation around the color wheel, anchored on the brand hue.
    for (var i = 0; i < n; i++) {
      var h = base.h + (360 / Math.max(n, 1)) * i;
      var s = Math.min(0.85, Math.max(0.45, base.s || 0.7));
      var l = i % 2 === 0 ? 0.55 : 0.45;
      out.push(hslToCss(h, s, l));
    }
    return out;
  }

  function sequential(n) {
    var c = rgbToHsl(toRgb(getPrimary()).r, toRgb(getPrimary()).g, toRgb(getPrimary()).b);
    var out = [];
    for (var i = 0; i < n; i++) {
      var t = n === 1 ? 0.5 : i / (n - 1);
      out.push(hslToCss(c.h, lerp(0.35, 0.9, t), lerp(0.85, 0.32, t)));
    }
    return out;
  }

  function diverging(n) {
    var c = rgbToHsl(toRgb(getPrimary()).r, toRgb(getPrimary()).g, toRgb(getPrimary()).b);
    var coolH = (c.h + 200) % 360;
    var out = [];
    for (var i = 0; i < n; i++) {
      var t = n === 1 ? 0.5 : i / (n - 1);
      if (t < 0.5) out.push(hslToCss(coolH, 0.6, lerp(0.4, 0.92, t / 0.5)));
      else out.push(hslToCss(c.h, 0.7, lerp(0.92, 0.45, (t - 0.5) / 0.5)));
    }
    return out;
  }

  function getColors(kind, n) {
    n = Math.max(1, n | 0);
    if (kind === "sequential") return sequential(n);
    if (kind === "diverging") return diverging(n);
    return categorical(n);
  }

  function relLuminance(rgb) {
    var a = [rgb.r, rgb.g, rgb.b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }

  function getTextStyleForBackground(bg) {
    var lum = relLuminance(toRgb(bg));
    return { color: lum > 0.55 ? "#111111" : "#ffffff" };
  }

  function notify() {
    window.dispatchEvent(new CustomEvent("palettes:updated"));
  }

  window.ColorPalettes = {
    getPrimary: getPrimary,
    getColors: getColors,
    getTextStyleForBackground: getTextStyleForBackground,
    refresh: notify,
    notify: notify,
  };
})();
