import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";
import { setupIpcDemo } from "./ipc.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="trigger" type="button">Call IPC</button>
    </div>
    <div id="response">
    </div>
  </div>
`;

setupIpcDemo(
  document.querySelector<HTMLDivElement>("#response")!,
  document.querySelector<HTMLButtonElement>("#trigger")!
);
