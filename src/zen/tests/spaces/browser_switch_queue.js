/* Any copyright is dedicated to the Public Domain.
   https://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

add_task(async function test_overlapping_switches_settle_on_last_space() {
  await gZenWorkspaces.createAndSaveWorkspace("Queue A");
  await gZenWorkspaces.createAndSaveWorkspace("Queue B");
  await gZenWorkspaces.createAndSaveWorkspace("Queue C");
  const spaces = gZenWorkspaces.getWorkspaces();
  const [first, second, third] = spaces.slice(-3);

  const switches = [
    gZenWorkspaces.changeWorkspace(first),
    gZenWorkspaces.changeWorkspace(second),
    gZenWorkspaces.changeWorkspace(second),
    gZenWorkspaces.changeWorkspace(third),
  ];
  await Promise.all(switches);
  await new Promise(resolve => setTimeout(resolve, 500));

  Assert.equal(
    gZenWorkspaces.activeWorkspace,
    third.uuid,
    "The last requested space is active."
  );
  const shown = spaces.filter(space => {
    const transform = gZenWorkspaces.workspaceElement(space.uuid).style
      .transform;
    return (
      transform === "" || transform.replace(/\s/g, "") === "translateX(0%)"
    );
  });
  Assert.deepEqual(
    shown.map(space => space.uuid),
    [third.uuid],
    "Only the active space has its tab strip in view."
  );

  for (const space of [first, second, third]) {
    await gZenWorkspaces.removeWorkspace(space.uuid);
  }
});
