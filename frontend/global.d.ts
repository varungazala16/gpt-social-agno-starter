import type { IStaticMethods } from "preline/dist";

declare global {
  interface Window {
    // Optional third-party libraries (not needed for basic Preline)
    // Uncomment if you use these libraries
    // _: any;
    // $: typeof import("jquery");
    // jQuery: typeof import("jquery");
    // DataTable: any;
    // Dropzone: any;
    // VanillaCalendarPro: any;

    // Preline UI
    HSStaticMethods: IStaticMethods;
  }
}

export {};
