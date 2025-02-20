import { invoke } from "@crabnebula/taurify-api/core";

export function setupIpcDemo(
  responseElement: HTMLDivElement,
  triggerElement: HTMLButtonElement
) {
  const callIpc = async () => {
    // invoke a backend command
    invoke("create_hello_file", {
      contents: "hello world!",
    })
      .then((data) => {
        responseElement.innerHTML = JSON.stringify(data);
      })
      .catch((error) => {
        responseElement.innerHTML = "error: " + JSON.stringify(error);
      });
  };
  triggerElement.addEventListener("click", () => callIpc());
}
