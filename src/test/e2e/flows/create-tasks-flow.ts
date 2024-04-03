import ms from "ms";
import { EndToEndFlow } from "../util/EndToEndFlow";

export const createTasksFlow: EndToEndFlow = {
  name: "Create tasks",
  fn: async () => {
    const username = "FrankJames";
    const password = "password";

    // Register

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

    const token = registerBody.token;

    // Create house

    const createHouseRes = await fetch("http://localhost:9999/v1/house", {
      method: "POST",
      body: JSON.stringify({ name: "House 1" }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const createHouseBody = await createHouseRes.json();

    if (createHouseRes.status != 201) {
      console.error(
        "Got unexpected status",
        createHouseRes.status,
        createHouseBody
      );
      throw new Error();
    }

    // List my houses

    const listMyHousesRes = await fetch("http://localhost:9999/v1/house/mine", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const listMyHousesBody = await listMyHousesRes.json();

    if (listMyHousesRes.status != 200) {
      console.error(
        "Got unexpected status",
        listMyHousesRes.status,
        listMyHousesBody
      );
      throw new Error();
    }

    if (listMyHousesBody.houses.length != 1) {
      console.error("Expected 1 house, got", listMyHousesBody.houses.length);
      throw new Error();
    }

    const house = listMyHousesBody.houses[0];

    if (house.id != createHouseBody.house.id) {
      console.error(
        "Expected house id",
        createHouseBody.house.id,
        "got",
        house.id
      );
      throw new Error();
    }

    // Create task group

    const createTaskGroupRes = await fetch(
      `http://localhost:9999/v1/group/${house.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ addedGroups: ["group"] }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (createTaskGroupRes.status != 204) {
      console.error(
        "Got unexpected status",
        createTaskGroupRes.status,
        await createTaskGroupRes.json()
      );
      throw new Error();
    }

    // Create first task

    const task1 = {
      name: "Task 1",
      description: "Description 1",
      freqBase: new Date("2024-04-02T00:00:00Z"),
      freqOffset: ms("7d"),
      timeLimit: ms("2d"),
      scheduleOffset: ms("1d"),
      points: ms("3d"),
      penalty: 5,
      responsibleTaskGroup: "group",
    };

    const createTaskRes1 = await fetch(
      `http://localhost:9999/v1/task/${house.id}`,
      {
        method: "POST",
        body: JSON.stringify(task1),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (createTaskRes1.status != 204) {
      console.error(
        "Got unexpected status",
        createTaskRes1.status,
        await createTaskRes1.json()
      );
      throw new Error();
    }

    // List task groups

    const listTaskGroupsRes = await fetch(
      `http://localhost:9999/v1/group/${house.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const listTaskGroupsBody = await listTaskGroupsRes.json();

    if (listTaskGroupsRes.status != 200) {
      console.error(
        "Got unexpected status",
        listTaskGroupsRes.status,
        listTaskGroupsBody
      );
      throw new Error();
    }

    if (listTaskGroupsBody.groups.length != 1) {
      console.error(
        "Expected 1 task group, got",
        listTaskGroupsBody.groups.length
      );
      throw new Error();
    }

    const taskGroup = listTaskGroupsBody.groups[0];

    if (taskGroup.name != "group") {
      console.error("Expected task group name 'group', got", taskGroup.name);
      throw new Error();
    }

    // Add some new task groups and rename the existing one

    const updateTaskGroupRes = await fetch(
      `http://localhost:9999/v1/group/${house.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          addedGroups: ["group2", "group3"],
          renamedGroups: [
            {
              id: taskGroup.id,
              name: "group-renamed",
            },
          ],
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (updateTaskGroupRes.status != 204) {
      console.error(
        "Got unexpected status",
        updateTaskGroupRes.status,
        await updateTaskGroupRes.json()
      );
      throw new Error();
    }

    // List task groups again

    const listTaskGroupsRes2 = await fetch(
      `http://localhost:9999/v1/group/${house.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const listTaskGroupsBody2 = await listTaskGroupsRes2.json();

    if (listTaskGroupsRes2.status != 200) {
      console.error(
        "Got unexpected status",
        listTaskGroupsRes2.status,
        listTaskGroupsBody2
      );
      throw new Error();
    }

    if (listTaskGroupsBody2.groups.length != 3) {
      console.error(
        "Expected 3 task groups, got",
        listTaskGroupsBody2.groups.length
      );
      throw new Error();
    }

    const taskGroup2 = listTaskGroupsBody2.groups.find(
      (group: any) => group.name == "group2"
    );

    if (taskGroup2 == null) {
      console.error("Expected to find group with name 'group2', but did not find in:", listTaskGroupsBody2);
      throw new Error();
    }

    const taskGroup3 = listTaskGroupsBody2.groups.find(
      (group: any) => group.name == "group3"
    );

    if (taskGroup3 == null) {
      console.error("Expected to find group with name 'group3', but did not find in:", listTaskGroupsBody2);
      throw new Error();
    }

    const taskGroupRenamed = listTaskGroupsBody2.groups.find(
      (group: any) => group.name == "group-renamed"
    );

    if (taskGroupRenamed == null) {
      console.error("Expected to find group with name 'group-renamed', but did not find in:", listTaskGroupsBody2);
      throw new Error();
    }

    // Create second task

    const task2 = {
      name: "Task 2",
      description: "Description 2",
      freqBase: new Date("2024-04-02T00:00:00Z"),
      freqOffset: ms("7d"),
      timeLimit: ms("2d"),
      scheduleOffset: ms("1d"),
      points: ms("3d"),
      penalty: 5,
      responsibleTaskGroup: "group2",
    };

    const createTaskRes2 = await fetch(
      `http://localhost:9999/v1/task/${house.id}`,
      {
        method: "POST",
        body: JSON.stringify(task2),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (createTaskRes2.status != 204) {
      console.error(
        "Got unexpected status",
        createTaskRes2.status,
        await createTaskRes2.json()
      );
      throw new Error();
    }

    // Delete task group 3, and rename task group 2

    const updateTaskGroupRes2 = await fetch(
      `http://localhost:9999/v1/group/${house.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          deletedGroupIds: [taskGroup3.id],
          renamedGroups: [
            {
              id: taskGroup2.id,
              name: "group2-renamed",
            },
          ],
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (updateTaskGroupRes2.status != 204) {
      console.error(
        "Got unexpected status",
        updateTaskGroupRes2.status,
        await updateTaskGroupRes2.json()
      );
      throw new Error();
    }

    // List tasks

    const listTasksRes = await fetch(
      `http://localhost:9999/v1/task/${house.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const listTasksBody = await listTasksRes.json();

    if (listTasksRes.status != 200) {
      console.error(
        "Got unexpected status",
        listTasksRes.status,
        listTasksBody
      );
      throw new Error();
    }

    if (listTasksBody.tasks.length != 2) {
      console.error("Expected 2 tasks, got", listTasksBody.tasks.length);
      throw new Error();
    }

    const tasks = listTasksBody.tasks;

    const taskInGroup1 = tasks.find((task: any) => task.responsibleTaskGroup == "group-renamed");

    if (taskInGroup1 == null) {
      console.error("Expected to find task in group 'group-renamed', but did not find in:", tasks);
      throw new Error();
    }

    const taskInGroup2 = tasks.find((task: any) => task.responsibleTaskGroup == "group2-renamed");

    if (taskInGroup2 == null) {
      console.error("Expected to find task in group 'group2-renamed', but did not find in:", tasks);
      throw new Error();
    }

    // Delete task 1

    const deleteTaskRes1 = await fetch(
      `http://localhost:9999/v1/task/${house.id}/${taskInGroup1.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (deleteTaskRes1.status != 204) {
      console.error(
        "Got unexpected status",
        deleteTaskRes1.status,
        await deleteTaskRes1.json()
      );
      throw new Error();
    }

    // Task 2 should still be there

    const listTasksRes2 = await fetch(
      `http://localhost:9999/v1/task/${house.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const listTasksBody2 = await listTasksRes2.json();

    if (listTasksRes2.status != 200) {
      console.error(
        "Got unexpected status",
        listTasksRes2.status,
        listTasksBody2
      );
      throw new Error();
    }

    if (listTasksBody2.tasks.length != 1) {
      console.error("Expected 1 task, got", listTasksBody2.tasks.length);
      throw new Error();
    }

    // Update house name

    const newHouseName = "House 2";

    const updateHouseNameRes = await fetch(
      `http://localhost:9999/v1/house/name`,
      {
        method: "PUT",
        body: JSON.stringify({ houseId: house.id, newName: newHouseName }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (updateHouseNameRes.status != 204) {
      console.error(
        "Got unexpected status",
        updateHouseNameRes.status,
        await updateHouseNameRes.json()
      );
      throw new Error();
    }

    // List my houses again

    const listMyHousesRes2 = await fetch(
      "http://localhost:9999/v1/house/mine",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const listMyHousesBody2 = await listMyHousesRes2.json();

    if (listMyHousesRes2.status != 200) {
      console.error(
        "Got unexpected status",
        listMyHousesRes2.status,
        listMyHousesBody2
      );
      throw new Error();
    }

    if (listMyHousesBody2.houses.length != 1) {
      console.error("Expected 1 house, got", listMyHousesBody2.houses.length);
      throw new Error();
    }

    const house2 = listMyHousesBody2.houses[0];

    if (house2.id != house.id) {
      console.error("Expected house id", house.id, "got", house2.id);
      throw new Error();
    }

    if (house2.name != newHouseName) {
      console.error("Expected house name", newHouseName, "got", house2.name);
      throw new Error();
    }

    // Delete house. Implicitly deletes the last task and the task group.

    const deleteHouseRes = await fetch(`http://localhost:9999/v1/house`, {
      method: "DELETE",
      body: JSON.stringify({ houseId: house.id }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (deleteHouseRes.status != 204) {
      console.error(
        "Got unexpected status",
        deleteHouseRes.status,
        await deleteHouseRes.json()
      );
      throw new Error();
    }

    // Delete account

    const deleteAccountRes = await fetch("http://localhost:9999/v1/account", {
      method: "DELETE",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (deleteAccountRes.status != 204) {
      console.error(
        "Got unexpected status",
        deleteAccountRes.status,
        await deleteAccountRes.json()
      );
      throw new Error();
    }
  },
};
