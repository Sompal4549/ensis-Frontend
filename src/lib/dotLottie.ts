import { DotLottieReact, setWasmUrl } from "@lottiefiles/dotlottie-react";

// Serve WASM runtime locally from public/dotlottie-player.wasm instead of CDN
setWasmUrl("/dotlottie-player.wasm");

export { DotLottieReact };
