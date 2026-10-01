import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { TextPlugin } from "gsap/TextPlugin"
import { Flip } from "gsap/Flip"
import { Observer } from "gsap/Observer"
import { CustomEase } from "gsap/CustomEase"

let isInitialized = false

export function initGSAP(): typeof gsap {
  if (typeof window !== "undefined" && !isInitialized) {
    gsap.registerPlugin(
      ScrollTrigger,
      ScrollToPlugin,
      TextPlugin,
      Flip,
      Observer,
      CustomEase
    )

    gsap.defaults({
      ease: "power3.out",
      duration: 0.8,
    })

    gsap.ticker.lagSmoothing(1000, 16)

    isInitialized = true
  }

  return gsap
}

export {
  gsap,
  ScrollTrigger,
  ScrollToPlugin,
  TextPlugin,
  Flip,
  Observer,
  CustomEase,
}
