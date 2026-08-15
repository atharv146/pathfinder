"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

/**
 * Single registration point for GSAP plugins.
 *
 * Registering in more than one module is harmless but makes it easy to forget
 * one and get a silent no-op tween, so everything imports GSAP from here.
 *
 * All of these (SplitText, DrawSVG, ScrollSmoother) became free in GSAP 3.13
 * after the Webflow acquisition — no Club licence, commercial use included.
 */
gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP);

/** Shared easing so every reveal on the site moves with the same personality. */
export const EASE_OUT = "power3.out";
export const EASE_EXPO = "expo.out";

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP };
