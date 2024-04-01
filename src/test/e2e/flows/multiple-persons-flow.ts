import { EndToEndFlow } from "../EndToEndFlow";

export const multiplePersonsFlow: EndToEndFlow = {
  name: "Multiple Persons Flow",
  fn: async () => {
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

    // List persons

    const personListRes1 = await fetch(
      `http://localhost:9999/v1/person/${createHouseBody1.house.id}`,
      {
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    const personListBody1 = await personListRes1.json();

    if (personListRes1.status != 200) {
      console.error(
        "Got unexpected status",
        personListRes1.status,
        personListBody1
      );
      throw new Error();
    }

    if (personListBody1.persons.length != 3) {
      console.error(
        "Expected 3 persons, got",
        personListBody1.persons.length,
        personListBody1
      );
      throw new Error();
    }

    const person1Id = personListBody1.persons.find(
      (person: any) => person.name === user1
    ).id;

    const person2Id = personListBody1.persons.find(
      (person: any) => person.name === user2
    ).id;

    const person3Id = personListBody1.persons.find(
      (person: any) => person.name === user3
    ).id;

    // Update house name

    const updateHouseNameRes1 = await fetch(
      `http://localhost:9999/v1/house/name`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token2}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          houseId: createHouseBody1.house.id,
          newName: "John's house",
        }),
      }
    );

    if (updateHouseNameRes1.status != 204) {
      console.error(
        "Got unexpected status",
        updateHouseNameRes1.status,
        await updateHouseNameRes1.json()
      );
      throw new Error();
    }

    // Reflect name change

    const listHousesRes2 = await fetch(`http://localhost:9999/v1/house/mine`, {
      headers: {
        Authorization: `Bearer ${token3}`,
      },
    });

    const listHousesBody2 = await listHousesRes2.json();

    if (listHousesRes2.status != 200) {
      console.error(
        "Got unexpected status",
        listHousesRes2.status,
        listHousesBody2
      );
      throw new Error();
    }

    const johnsHouse = listHousesBody2.houses.find(
      (house: any) => house.id === createHouseBody1.house.id
    );

    if (johnsHouse == null) {
      console.error("John's house not found.");
      throw new Error();
    }

    if (johnsHouse.name != "John's house") {
      console.error("Expected John's house, got", johnsHouse.name);
      throw new Error();
    }

    // Get detailed information about person

    const personRes1 = await fetch(
      `http://localhost:9999/v1/person/${createHouseBody1.house.id}/${person2Id}`,
      {
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    const personBody1 = await personRes1.json();

    if (personRes1.status != 200) {
      console.error("Got unexpected status", personRes1.status, personBody1);
      throw new Error();
    }

    if (personBody1.person.name != user2) {
      console.error("Expected", user2, "got", personBody1.person.name);
      throw new Error();
    }

    // Kick someone out

    const removePerson1 = await fetch(
      `http://localhost:9999/v1/person/${createHouseBody1.house.id}/${person2Id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    if (removePerson1.status != 204) {
      console.error(
        "Got unexpected status",
        removePerson1.status,
        await removePerson1.json()
      );
      throw new Error();
    }

    // List persons again

    const personListRes2 = await fetch(
      `http://localhost:9999/v1/person/${createHouseBody1.house.id}`,
      {
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    const personListBody2 = await personListRes2.json();

    if (personListRes2.status != 200) {
      console.error(
        "Got unexpected status",
        personListRes2.status,
        personListBody2
      );
      throw new Error();
    }

    if (personListBody2.persons.length != 2) {
      console.error(
        "Expected 2 persons, got",
        personListBody2.persons.length,
        personListBody2
      );
      throw new Error();
    }

    // Leave house

    const removePerson2 = await fetch(
      `http://localhost:9999/v1/person/${createHouseBody1.house.id}/${person3Id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token3}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ houseId: createHouseBody1.house.id }),
      }
    );

    if (removePerson2.status != 204) {
      console.error(
        "Got unexpected status",
        removePerson2.status,
        await removePerson2.json()
      );
      throw new Error();
    }

    // List persons again

    const personListRes3 = await fetch(
      `http://localhost:9999/v1/person/${createHouseBody1.house.id}`,
      {
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    const personListBody3 = await personListRes3.json();

    if (personListRes3.status != 200) {
      console.error(
        "Got unexpected status",
        personListRes3.status,
        personListBody3
      );
      throw new Error();
    }

    if (personListBody3.persons.length != 1) {
      console.error(
        "Expected 1 person, got",
        personListBody3.persons.length,
        personListBody3
      );
      throw new Error();
    }

    // Delete house

    const deleteHouseRes1 = await fetch(`http://localhost:9999/v1/house`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token1}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ houseId: createHouseBody1.house.id }),
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
