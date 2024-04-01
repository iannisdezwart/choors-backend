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

    // Delete the account now.

    const deleteRes = await fetch("http://localhost:9999/v1/account", {
      method: "DELETE",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (deleteRes.status != 204) {
      console.error("Got unexpected status", deleteRes.status, await deleteRes.json());
      throw new Error();
    }

    // Can't login with the same username again.

    const loginRes3 = await fetch("http://localhost:9999/v1/account/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const loginBody3 = await loginRes3.json();

    if (loginRes3.status != 404) {
      console.error("Got unexpected status", loginRes3.status, loginBody3);
      throw new Error();
    }

    // Can't delete the account again.

    const deleteRes2 = await fetch("http://localhost:9999/v1/account", {
      method: "DELETE",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (deleteRes2.status != 404) {
      console.error("Got unexpected status", deleteRes2.status);
      throw new Error();
    }
  },
};
