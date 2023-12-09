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
}

enum DeviceOrientationTypes {
  Landscape = "LANDSCAPE",
  Portrait = "PORTRAIT",
}

type OptionsType = {
  event: EventTypes.Scroll;
  animationType: AnimationTypes;
  zoom: number;
  rotatePerspective: number;
  animateDuration: number;
  ignoreZIndex: boolean;
  gyroscopeEvent: boolean;
};

type EvenMouseMoveType = {
  pageX: number;
  pageY: number;
};

type AnimationParamsType = {
  x?: string;
  y?: string;
  rotationX?: string;
  rotationY?: string;
};

export class ParallaxBackground {
  $element: JQuery<HTMLElement>;
  $elementInner: JQuery<HTMLElement>;
  dataOptions: OptionsType;
  settings: OptionsType;
  innerSize: number;
  coef: number;
  shift: number;
  deviceOrientation: DeviceOrientationTypes | undefined;
  viewportTop: number;
  viewportBottom: number;
  ww: number;
  wh: number;

  constructor(element: JQuery<HTMLElement>, options: Partial<OptionsType>) {
    const self = this;

    //extend by function call
    self.settings = $.extend(
      true,
      {
        event: EventTypes.Scroll,
        animationType: AnimationTypes.Shift,
        zoom: 20,
        rotatePerspective: 1400,
        animateDuration: 1,
        ignoreZIndex: false,
        gyroscopeEvent: true,
      },
      options,
    );

    self.$element = $(element);
    self.$elementInner = self.$element.find(".parallax-inner");

    //extend by data options
    self.dataOptions = self.$element.data("parallax-background");
    self.settings = $.extend(true, self.settings, self.dataOptions);

    self.innerSize = self.settings.zoom + 100;
    self.coef = self.innerSize / 100;
    self.shift = self.settings.zoom / 2 / self.coef;

    self.deviceOrientation = undefined;
    self.viewportTop = 0;
    self.viewportBottom = 0;

    self.init();
  }

  private init() {
    if (typeof gsap === "undefined") {
      console.warn(
        "Gsap library is required... https://gsap.com/docs/v3/Installation/",
      );
      return;
    }

    const self = this;

    self.setElementsStyles();

    self.updateWindowSize();
    self.updateOrientation();

    $(window).on("resize", function () {
      self.updateWindowSize();
      self.updateOrientation();
    });

    if (self.settings.event === EventTypes.Scroll) {
      self.updateViewports();

      $(window).on("scroll", function () {
        self.updateViewports();
      });
    }

    if (self.settings.event === EventTypes.Scroll) {
      self.subscribeScrollEvent();
    } else if (self.settings.event === EventTypes.Mouse) {
      self.subscribeMouseMoveEvent();
    }

    if (self.settings.gyroscopeEvent) {
      self.subscribeGyroEvent();
    }
  }

  private updateWindowSize() {
    this.ww = window.innerWidth;
    this.wh = window.innerHeight;
  }

  private updateViewports() {
    this.viewportTop = $(window).scrollTop() || 0;
    this.viewportBottom = this.viewportTop + this.wh;
  }

  private setElementsStyles() {
    this.$element.css({
      overflow: "hidden",
    });

    this.$elementInner.css({
      top: -this.settings.zoom / 2 + "%",
      left: -this.settings.zoom / 2 + "%",
      height: this.innerSize + "%",
      width: this.innerSize + "%",
      position: "absolute",
    });

    if (this.settings.animationType === AnimationTypes.Rotate) {
      gsap.set(this.$element, {
        perspective: this.settings.rotatePerspective,
      });
      gsap.set(this.$elementInner, { transformStyle: "preserve-3d" });
    }
  }

  private updateOrientation() {
    if (this.ww > this.wh) {
      this.deviceOrientation = DeviceOrientationTypes.Landscape;
    } else {
      this.deviceOrientation = DeviceOrientationTypes.Portrait;
    }
  }

  private subscribeGyroEvent() {
    const maxRange = 30;

    let lastGamma = 0,
      lastBeta = 0,
      rangeGamma = 0,
      rangeBeta = 0;

    window.addEventListener(
      "deviceorientation",
      (e) => {
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
    const y = this.shift * progressY;
    const x = this.shift * progressX;

    let params: AnimationParamsType = { y: y + "%" };
    if (progressX) {
      params.x = x + "%";
    }

    if (this.settings.animationType === AnimationTypes.Rotate) {
      params = { rotationX: -y + "%" };
      if (progressX) {
        params.rotationY = x + "%";
      }
    }

    gsap.to(this.$elementInner, this.settings.animateDuration, params);
  }

  private getCursorShiftByElement(
    $element: JQuery<HTMLElement>,
    cursorX: number,
    cursorY: number,
  ) {
    const offset = $element.offset(),
      sectionWidth = $element.outerWidth(),
      sectionHeight = $element.outerHeight(),
      pageX = cursorX - offset.left - $element.width() * 0.5,
      pageY = cursorY - offset.top - $element.height() * 0.5,
      cursorPercentPositionX = (pageX / sectionWidth) * 2,
      cursorPercentPositionY = (pageY / sectionHeight) * 2;

    return { x: cursorPercentPositionX, y: cursorPercentPositionY };
  }

  private isCursorOnElement(
    $element: JQuery<HTMLElement>,
    cursorX: number,
    cursorY: number,
  ) {
    const offset = $element.offset();
    const top = offset.top;
    const left = offset.left;
    const right = left + $element.outerWidth();
    const bottom = top + $element.outerHeight();

    return (
      cursorX > left && cursorX < right && cursorY > top && cursorY < bottom
    );
  }

  private subscribeMouseMoveEvent() {
    const self = this;

    if (self.settings.ignoreZIndex) {
      let isCursorOnElement = false;
      $(document).on("mousemove", function (e: EvenMouseMoveType) {
        if (self.isCursorOnElement(self.$element, e.pageX, e.pageY)) {
          const cursorShift = self.getCursorShiftByElement(
            self.$element,
            e.pageX,
            e.pageY,
          );
          self.animate(cursorShift.y, cursorShift.x);
          isCursorOnElement = true;
        } else {
          if (isCursorOnElement) {
            self.animate(0, 0);
            isCursorOnElement = false;
          }
        }
      });
    } else {
      self.$element.on("mousemove", function (e) {
        const cursorShift = self.getCursorShiftByElement(
          self.$element,
          e.pageX,
          e.pageY,
        );
        self.animate(cursorShift.y, cursorShift.x);
      });

      self.$element.mouseleave(function () {
        self.animate(0, 0);
      });
    }
  }

  private subscribeScrollEvent() {
    const scroller = new Scroller(this.$element[0], {
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
