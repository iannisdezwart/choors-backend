import { EndToEndFlow } from "../EndToEndFlow";

export const registerFlow: EndToEndFlow = {
  name: "Register Flow",
  fn: async () => {
    const username = "FrankJames";
    const password = "password";

    const registerRes = await fetch("http://localhost:9999/v1/account", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const registerBody = await registerRes.json();

    if (registerRes.status != 201) {
      console.error("Got unexpected status", registerRes.status, registerBody);
      throw new Error();
    }

    if (registerBody.token == null) {
      console.error("Token is null.");
      throw new Error();
    }

    // Can't register with the same username again.

    const registerAgainRes = await fetch("http://localhost:9999/v1/account", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const registerAgainBody = await registerAgainRes.json();

    if (registerAgainRes.status != 409) {
      console.error(
        "Got unexpected status",
        registerAgainRes.status,
        registerAgainBody
      );
      throw new Error();
    }

    // Can't login with the wrong password.

    const loginRes = await fetch("http://localhost:9999/v1/account/login", {
      method: "POST",
      body: JSON.stringify({ username, password: "wrong" }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const loginBody = await loginRes.json();

    if (loginRes.status != 401) {
      console.error("Got unexpected status", loginRes.status, loginBody);
      throw new Error();
    }

    // Can login with the correct password.

    const loginRes2 = await fetch("http://localhost:9999/v1/account/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const loginBody2 = await loginRes2.json();

    if (loginRes2.status != 200) {
      console.error("Got unexpected status", loginRes2.status, loginBody2);
      throw new Error();
    }

    if (loginBody2.token == null) {
      console.error("Token is null.");
      throw new Error();
    }
  },
};
