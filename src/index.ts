declare global {
  interface JQuery {
    parallaxBackground(arg: Partial<OptionsType>): void;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let gsap: any;

import Scroller from "@lemehovskiy/scroller";

enum AnimationTypes {
  Shift = "SHIFT",
  Rotate = "ROTATE",
}

enum EventTypes {
  Mouse = "MOUSE",
  Scroll = "SCROLL",
  Gyro = "GYRO",
}

enum DeviceOrientationTypes {
  Landscape = "LANDSCAPE",
  Portrait = "PORTRAIT",
}

type OptionsType = {
  events: Array<EventTypes>;
  animationType: AnimationTypes;
  zoom: number;
  rotatePerspective: number;
  animateDuration: number;
  ignoreZIndex: boolean;
  gyroscopeEvent: boolean;
};

type AnimationParamsType = {
  x?: string;
  y?: string;
  rotationX?: number;
  rotationY?: number;
};

export default class ParallaxBackground {
  element: HTMLElement;
  elementInner: HTMLElement;
  settings: OptionsType;
  elementSize: [number, number];
  innerSize: number;
  coef: number;
  shift: number;
  doubleShift: number;
  deviceOrientation: DeviceOrientationTypes | undefined;

  constructor(element: HTMLElement, options: Partial<OptionsType>) {
    this.settings = {
      events: [EventTypes.Scroll],
      animationType: AnimationTypes.Shift,
      zoom: 20,
      rotatePerspective: 1400,
      animateDuration: 1,
      ignoreZIndex: false,
      gyroscopeEvent: true,
      ...options,
    };

    this.element = element;
    this.elementInner = this.element.getElementsByTagName("div")[0];
    const dataOptions = JSON.parse(
      this.element.getAttribute("data-parallax-background"),
    );
    this.settings = { ...this.settings, ...dataOptions };

    this.innerSize = this.settings.zoom + 100;
    this.elementSize = [0, 0];
    this.coef = this.innerSize / 100;
    this.shift = this.settings.zoom / 2 / this.coef;
    this.doubleShift = this.shift * 2;

    this.deviceOrientation = undefined;

    this.init();
  }

  private init() {
    if (typeof gsap === "undefined") {
      console.warn(
        "Gsap library is required... https://gsap.com/docs/v3/Installation/",
      );
      return;
    }

    this.setElementsStyles();

    new Set(this.settings.events).forEach((event) => {
      if (event === EventTypes.Scroll) {
        this.subscribeScrollEvent();
      } else if (event === EventTypes.Mouse) {
        this.subscribeMouseMoveEvent();
      } else if (event === EventTypes.Gyro) {
        this.subscribeGyroEvent();
      }
    });
  }

  private updateElementSize() {
    const { width, height } = this.element.getBoundingClientRect();
    this.elementSize = [width, height];
  }

  private setElementsStyles() {
    this.element.style["overflow"] = "hidden";

    this.elementInner.style["top"] = -this.settings.zoom / 2 + "%";
    this.elementInner.style["left"] = -this.settings.zoom / 2 + "%";
    this.elementInner.style["height"] = this.innerSize + "%";
    this.elementInner.style["width"] = this.innerSize + "%";
    this.elementInner.style["position"] = "absolute";
    this.elementInner.style["zIndex"] = "-1";

    if (this.settings.animationType === AnimationTypes.Rotate) {
      gsap.set(this.element, {
        perspective: this.settings.rotatePerspective,
      });
      gsap.set(this.elementInner, { transformStyle: "preserve-3d" });
    }
  }

  private updateOrientation() {
    if (window.innerWidth > window.innerHeight) {
      this.deviceOrientation = DeviceOrientationTypes.Landscape;
    } else {
      this.deviceOrientation = DeviceOrientationTypes.Portrait;
    }
  }

  private subscribeGyroEvent() {
    let isVisible = false;
    this.updateOrientation();

    const maxRange = 30;

    let lastGamma = 0,
      lastBeta = 0,
      rangeGamma = 0,
      rangeBeta = 0;

    const observer = new IntersectionObserver(
      (e) => {
        isVisible = e[0].isIntersecting;
      },
      { root: null, rootMargin: "0px" },
    );
    observer.observe(this.element);

    window.addEventListener("resize", () => {
      this.updateOrientation();
    });

    window.addEventListener(
      "deviceorientation",
      (e) => {
        if (!isVisible) return;
        const roundedGamma = Math.round(e.gamma || 0),
          roundedBeta = Math.round(e.beta || 0);

        let x = 0;
        let y = 0;

        if (roundedGamma > lastGamma && rangeGamma < maxRange) {
          rangeGamma++;
        } else if (roundedGamma < lastGamma && rangeGamma > 0) {
          rangeGamma--;
        }

        if (roundedBeta > lastBeta && rangeBeta < maxRange) {
          rangeBeta++;
        } else if (roundedBeta < lastBeta && rangeBeta > 0) {
          rangeBeta--;
        }

        lastGamma = roundedGamma;
        lastBeta = roundedBeta;

        const gammaProgress = rangeGamma / maxRange;
        const betaProgress = rangeBeta / maxRange;

        if (this.deviceOrientation === DeviceOrientationTypes.Landscape) {
          x = betaProgress;
          y = gammaProgress;
        } else {
          x = gammaProgress;
          y = betaProgress;
        }

        this.animate(-y, -x);
      },
      true,
    );
  }

  private animate(progressY: number, progressX?: number) {
    const y = -this.shift + this.doubleShift * progressY;
    const x = -this.shift + this.doubleShift * progressX;

    let params: AnimationParamsType = { y: y + "%" };
    if (progressX !== undefined) {
      params.x = x + "%";
    }

    if (this.settings.animationType === AnimationTypes.Rotate) {
      params = { rotationX: -y };
      if (progressX !== undefined) {
        params.rotationY = x;
      }
    }

    gsap.to(this.elementInner, this.settings.animateDuration, params);
  }

  private subscribeMouseMoveEvent() {
    this.updateElementSize();

    window.addEventListener("resize", () => {
      this.updateElementSize();
    });

    this.element.addEventListener("mousemove", (e: MouseEvent) => {
      const { clientY, clientX } = e;
      const { x, y } = this.element.getBoundingClientRect();

      const yProgress = (clientY - y) / this.elementSize[1];
      const xProgress = (clientX - x) / this.elementSize[0];

      this.animate(yProgress, xProgress);
    });

    this.element.addEventListener("mouseleave", () => {
      this.animate(0.5, 0.5);
    });
  }

  private subscribeScrollEvent() {
    const scroller = new Scroller(this.element, {
      autoAdjustScrollOffset: true,
      scrollTriggerOffset: { start: 0, end: 0 },
    });

    scroller.progressChanged.on((progress) => {
      this.animate(progress);
    });
  }
}

(function ($) {
  $.fn.parallaxBackground = function (
    ...params: [Partial<OptionsType>] | Array<string>
  ) {
    const opt = params[0];
    const args = Array.prototype.slice.call(params, 1);
    const length = this.length;
    let ret = undefined;
    for (let i = 0; i < length; i++) {
      if (typeof opt === "object" || typeof opt === "undefined") {
        this[i].parallaxBackground = new ParallaxBackground(this[i], opt);
      } else {
        // eslint-disable-next-line prefer-spread
        ret = this[i].parallaxBackground[opt].apply(
          this[i].parallaxBackground,
          args,
        );
      }
      if (typeof ret !== "undefined") return ret;
    }
    return this;
  };
})(jQuery);
