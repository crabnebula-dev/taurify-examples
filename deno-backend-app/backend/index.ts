//! Taurify backend entry point.
//! Notice how you can use any `npm:@crabnebula/taurify-api` or `Deno` interface!

import { defaultWindowIcon } from "npm:@crabnebula/taurify-api/app";
import { appConfigDir } from "npm:@crabnebula/taurify-api/path";
import { listen, emit } from "npm:@crabnebula/taurify-api/event";
import { TrayIcon } from "npm:@crabnebula/taurify-api/tray";
import {
  registerCommand,
  runEventLoop,
} from "npm:@crabnebula/taurify-api/deno";
import { join } from "node:path";
import { Menu } from "npm:@crabnebula/taurify-api/menu";
import { WebviewWindow } from "npm:@crabnebula/taurify-api/webviewWindow";

// create a test file leveraging Deno APIs
async function createTestFile(contents: string) {
  const configDir = await appConfigDir();

  await Deno.makeTempDir();

  await Deno.mkdir(configDir, { recursive: true });

  const jsonResponse = await fetch("https://api.github.com/users/denoland");
  const jsonData = await jsonResponse.json();
  console.log(jsonData);

  const filePath = join(configDir, "hello-taurify.txt");

  const encoder = new TextEncoder();
  const data = encoder.encode(contents);
  await Deno.writeFile(filePath, data);

  const bytes = await Deno.readFile(filePath);
  console.log(filePath, "file contents", new TextDecoder().decode(bytes));
}

// create an app tray icon directly from the backend
async function createTrayIcon() {
  await TrayIcon.new({
    title: "Deno",
    icon: await defaultWindowIcon(),
    menu: await Menu.new({
      items: [
        {
          text: "App",
          action: (e) => {
            console.log("item clicked", e);
          },
        },
      ],
    }),
    action: (e) => {
      console.log("tray event", e);
    },
  });
}

registerCommand<{ contents: string }>("create_hello_file", async (payload) => {
  // emit Taurify events to the app window
  await emit("creating_hello_file");

  await createTestFile(payload.contents);

  return {
    response: "file created",
    request: payload,
  };
});

// listen to Taurify events
await listen("deno_trigger", (event) => {
  console.log("got deno trigger event", event);
}).catch(console.error);

await createTrayIcon();

// create a new Taurify window
new WebviewWindow("deno", {
  url: "https://deno.com/",
  x: 50,
  y: 200,
  focus: false,
});

// an example of running a custom worker to run code in a separate thread
const worker = new Worker(new URL("./worker.ts", import.meta.url).href, {
  type: "module",
});
worker.postMessage({
  hello: "world",
});

// run the Taurify event loop to get IPC messages and events
runEventLoop();
