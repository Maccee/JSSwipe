let isDragging = false;
let startDragX;
let initialScroll;
const wrapper = document.getElementById("wrapper");
const snapThreshold = 100;

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

  let clientX = event.touches ? event.touches[0].clientX : event.clientX;
  let dx = clientX - startDragX;
  wrapper.scrollLeft = initialScroll - dx;
}

function endDrag() {
  const screenWidth = window.innerWidth;
  if (isDragging) {
    const currentScroll = wrapper.scrollLeft;
    const relativeScroll = currentScroll % screenWidth;

    if (relativeScroll < snapThreshold) {
      smoothScrollTo(wrapper, currentScroll - relativeScroll);
    } else if (relativeScroll > screenWidth - snapThreshold) {
      smoothScrollTo(wrapper, currentScroll + (screenWidth - relativeScroll));
    } else if (
      relativeScroll >= snapThreshold &&
      relativeScroll <= screenWidth / 2
    ) {
      smoothScrollTo(wrapper, currentScroll - relativeScroll);
    } else {
      smoothScrollTo(wrapper, currentScroll + (screenWidth - relativeScroll));
    }
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
