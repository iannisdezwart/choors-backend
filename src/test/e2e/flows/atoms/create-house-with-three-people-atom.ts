import { EndToEndFlowAtom } from "../../util/EndToEndFlowAtom";

export const createHouseWithThreePeopleAtom: EndToEndFlowAtom<{
  user1: string;
  user2: string;
  user3: string;
  password: string;
  token1: string;
  token2: string;
  token3: string;
  houseId: string;
}> = {
  setup: async () => {
    const user1 = "FrankJames";
    const user2 = "JohnDoe";
    const user3 = "JaneDoe";

    const password = "password";

    // Register users

    const registerRes1 = await fetch("http://localhost:9999/v1/account", {
      method: "POST",
      body: JSON.stringify({ username: user1, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const registerBody1 = await registerRes1.json();

    if (registerRes1.status != 201) {
      console.error(
        "Got unexpected status",
        registerRes1.status,
        registerBody1
      );
      throw new Error();
    }

    const token1 = registerBody1.token;

    const registerRes2 = await fetch("http://localhost:9999/v1/account", {
      method: "POST",
      body: JSON.stringify({ username: user2, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const registerBody2 = await registerRes2.json();

    if (registerRes2.status != 201) {
      console.error(
        "Got unexpected status",
        registerRes2.status,
        registerBody2
      );
      throw new Error();
    }

    const token2 = registerBody2.token;

    const registerRes3 = await fetch("http://localhost:9999/v1/account", {
      method: "POST",
      body: JSON.stringify({ username: user3, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const registerBody3 = await registerRes3.json();

    if (registerRes3.status != 201) {
      console.error(
        "Got unexpected status",
        registerRes3.status,
        registerBody3
      );
      throw new Error();
    }

    const token3 = registerBody3.token;

    // Create house

    const createHouseRes1 = await fetch("http://localhost:9999/v1/house", {
      method: "POST",
      body: JSON.stringify({ name: "Frank's house" }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token1}`,
      },
    });

    const createHouseBody1 = await createHouseRes1.json();

    if (createHouseRes1.status != 201) {
      console.error(
        "Got unexpected status",
        createHouseRes1.status,
        createHouseBody1
      );
      throw new Error();
    }

    // List Frank's houses

    const listHousesRes1 = await fetch(`http://localhost:9999/v1/house/mine`, {
      headers: {
        Authorization: `Bearer ${token1}`,
      },
    });

    const listHousesBody1 = await listHousesRes1.json();

    if (listHousesRes1.status != 200) {
      console.error(
        "Got unexpected status",
        listHousesRes1.status,
        listHousesBody1
      );
      throw new Error();
    }

    const franksHouse = listHousesBody1.houses.find(
      (house: any) => house.id === createHouseBody1.house.id
    );

    if (franksHouse == null) {
      console.error("Frank's house not found.");
      throw new Error();
    }

    const inviteCode = franksHouse.inviteCode;

    // Join house

    const joinHouseRes2 = await fetch(`http://localhost:9999/v1/house/join`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token2}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inviteCode }),
    });

    if (joinHouseRes2.status != 204) {
      console.error(
        "Got unexpected status",
        joinHouseRes2.status,
        await joinHouseRes2.json()
      );
      throw new Error();
    }

    const joinHouseRes3 = await fetch(`http://localhost:9999/v1/house/join`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token3}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inviteCode }),
    });

    if (joinHouseRes3.status != 204) {
      console.error(
        "Got unexpected status",
        joinHouseRes3.status,
        await joinHouseRes3.json()
      );
      throw new Error();
    }

    return {
      user1,
      user2,
      user3,
      password,
      token1,
      token2,
      token3,
      houseId: createHouseBody1.house.id,
    };
  },
  teardown: async ({ user1, user2, user3, password, token1, houseId }) => {
    // Delete house

    const deleteHouseRes1 = await fetch(`http://localhost:9999/v1/house`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token1}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ houseId: houseId }),
    });

    if (deleteHouseRes1.status != 204) {
      console.error(
        "Got unexpected status",
        deleteHouseRes1.status,
        await deleteHouseRes1.json()
      );
      throw new Error();
    }

    // Delete accounts

    const deleteRes1 = await fetch("http://localhost:9999/v1/account", {
      method: "DELETE",
      body: JSON.stringify({ username: user1, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (deleteRes1.status != 204) {
      console.error(
        "Got unexpected status",
        deleteRes1.status,
        await deleteRes1.json()
      );
      throw new Error();
    }

    const deleteRes2 = await fetch("http://localhost:9999/v1/account", {
      method: "DELETE",
      body: JSON.stringify({ username: user2, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (deleteRes2.status != 204) {
      console.error(
        "Got unexpected status",
        deleteRes2.status,
        await deleteRes2.json()
      );
      throw new Error();
    }

    const deleteRes3 = await fetch("http://localhost:9999/v1/account", {
      method: "DELETE",
      body: JSON.stringify({ username: user3, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (deleteRes3.status != 204) {
      console.error(
        "Got unexpected status",
        deleteRes3.status,
        await deleteRes3.json()
      );
      throw new Error();
    }
  },
};
