/* Any copyright is dedicated to the Public Domain.
   https://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

add_task(async function test_slide_only_animates_translate() {
  const manager = gZenCompactModeManager;
  const sidebar = manager.sidebar;
  const marginProperty = manager.sidebarIsOnRight
    ? "marginRight"
    : "marginLeft";
  const animations = [];
  const animate = sidebar.animate;
  sidebar.animate = function (keyframes, options) {
    animations.push(keyframes);
    return animate.call(this, keyframes, options);
  };

  try {
    for (const isCompactMode of [true, false]) {
      animations.length = 0;
      await manager._slideSidebar(200, isCompactMode);

      is(animations.length, 1, "The sidebar is animated once");
      Assert.deepEqual(
        animations[0].map(keyframe => Object.keys(keyframe)),
        [["translate"], ["translate"]],
        "Only translate is animated, so the content is not laid out per frame"
      );
      is(
        sidebar.style[marginProperty],
        isCompactMode ? "-200px" : "",
        "The layout is changed once up front"
      );
      is(sidebar.style.position, "", "The position override is removed");
      is(sidebar.style.zIndex, "", "The z-index override is removed");
      is(
        document.getElementById("browser").style.overflow,
        "",
        "The overflow override is removed"
      );
      sidebar.style[marginProperty] = "";
    }
  } finally {
    delete sidebar.animate;
  }
});
