let isDragging = false;
let startDragX;
let initialScroll;
const wrapper = document.getElementById("wrapper");
const snapThreshold = 100;

// Functions for dragging
function startDrag(event) {
  if (event.touches) {
    event = event.touches[0];
  }

  isDragging = true;
  startDragX = event.clientX;
  initialScroll = wrapper.scrollLeft;
}

function duringDrag(event) {
  if (!isDragging) return;

  let clientX;
  if (event.touches) {
    event.preventDefault();
    clientX = event.touches[0].clientX;
  } else {
    clientX = event.clientX;
  }

  let dx = clientX - startDragX;
  let newScroll = initialScroll - dx;
  wrapper.scrollLeft = newScroll;
}

function endDrag(event) {
  if (isDragging) {
    let dx =
      startDragX -
      (event.changedTouches ? event.changedTouches[0].clientX : event.clientX);
    const screenWidth = window.innerWidth;

    if (Math.abs(dx) > snapThreshold) {
      if (dx > 0) {
        if (wrapper.scrollLeft < 1.5 * screenWidth) {
          smoothScrollTo(wrapper, screenWidth);
        } else {
          smoothScrollTo(wrapper, 2 * screenWidth);
        }
      } else {
        if (wrapper.scrollLeft > screenWidth / 2) {
          smoothScrollTo(wrapper, screenWidth);
        } else {
          smoothScrollTo(wrapper, 0);
        }
      }
    } else {
      smoothScrollTo(wrapper, initialScroll);
    }

    updateButtonHighlight();
  }
  isDragging = false;
}

function updateButtonHighlight() {
  const screenWidth = window.innerWidth;
  if (wrapper.scrollLeft < screenWidth / 2) {
    setHighlight("indexBtn");
  } else if (wrapper.scrollLeft < 1.5 * screenWidth) {
    setHighlight("page1Btn");
  } else {
    setHighlight("page2Btn");
  }
}

function setHighlight(activeId) {
  ["indexBtn", "page1Btn", "page2Btn"].forEach((id) => {
    document.getElementById(id).classList.remove("active");
  });
  document.getElementById(activeId).classList.add("active");
}

// Smooth scroll function
function smoothScrollTo(element, target) {
  let start = element.scrollLeft;
  let change = target - start;
  let startTime = performance.now();
  let duration = 300;

  function animateScroll(currentTime) {
    let timeElapsed = currentTime - startTime;
    let progress = timeElapsed / duration;

    if (progress > 1) progress = 1;

    element.scrollLeft = start + change * easeInOutQuad(progress);

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    } else {
      updateButtonHighlight();
    }
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  requestAnimationFrame(animateScroll);
}

// Add event listeners
wrapper.addEventListener("mousedown", startDrag);
wrapper.addEventListener("touchstart", startDrag);

document.addEventListener("mousemove", duringDrag);
document.addEventListener("touchmove", duringDrag, { passive: false });

document.addEventListener("mouseup", endDrag);
document.addEventListener("touchend", endDrag);

// Optional: Prevent highlighting while dragging
wrapper.addEventListener("selectstart", function (e) {
  e.preventDefault();
});

// Event listeners for navbar buttons
document.getElementById("indexBtn").addEventListener("click", function () {
  smoothScrollTo(wrapper, 0);
});

document.getElementById("page1Btn").addEventListener("click", function () {
  smoothScrollTo(wrapper, window.innerWidth);
});

document.getElementById("page2Btn").addEventListener("click", function () {
  smoothScrollTo(wrapper, 2 * window.innerWidth);
});
