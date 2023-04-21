import ffi from "ffi-napi";

const image_processing_lib = ffi.Library("./modules/image_processing_lib.so", {
  // check if image exists first
  // load the image && display
  // ...
});
