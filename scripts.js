let isDragging = false;
let startDragX;
let initialScroll;
const wrapper = document.getElementById("wrapper");
const snapThreshold = 100; // snap after dragging 100px

wrapper.addEventListener("mousedown", function (e) {
  isDragging = true;
  startDragX = e.clientX;
  initialScroll = this.scrollLeft;
});

document.addEventListener("mousemove", function (e) {
  if (isDragging) {
    let dx = e.clientX - startDragX;
    let newScroll = initialScroll - dx;
    wrapper.scrollLeft = newScroll;
  }
});

document.addEventListener("mouseup", function () {
  if (isDragging) {
    let dx = startDragX - event.clientX;

    // If dragged more than half the window width
    if (Math.abs(dx) > snapThreshold) {
      // Determine direction and snap accordingly
      if (dx > 0) {
        // Snap to the end (page.html)
        smoothScrollTo(wrapper, window.innerWidth);
      } else {
        // Snap to the start (index.html)
        smoothScrollTo(wrapper, 0);
      }
    } else {
      // Snap back to the original position
      smoothScrollTo(wrapper, initialScroll);
    }

    isDragging = false;
    updateButtonHighlight();
  }
});

// Smooth scroll function
function smoothScrollTo(element, target) {
  let start = element.scrollLeft;
  let change = target - start;
  let startTime = performance.now();
  let duration = 300; // Duration in ms

  function animateScroll(currentTime) {
    let timeElapsed = currentTime - startTime;
    let progress = timeElapsed / duration;

    if (progress > 1) progress = 1;

    element.scrollLeft = start + change * easeInOutQuad(progress);

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    } else {
      // After scrolling animation completes, update button highlight
      updateButtonHighlight();
    }
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  requestAnimationFrame(animateScroll);
}

// Optional: Prevent highlighting while dragging
wrapper.addEventListener("selectstart", function (e) {
  e.preventDefault();
});

// ... Existing Code ...

document.addEventListener("mouseup", function () {
  if (isDragging) {
    let dx = startDragX - event.clientX;

    // ... Existing logic ...

    // After the snapping logic, highlight the appropriate button
    if (wrapper.scrollLeft >= window.innerWidth / 2) {
      document.getElementById("indexBtn").classList.remove("active");
      document.getElementById("pageBtn").classList.add("active");
    } else {
      document.getElementById("pageBtn").classList.remove("active");
      document.getElementById("indexBtn").classList.add("active");
    }
  }
});

// Event listeners for navbar buttons
document.getElementById("indexBtn").addEventListener("click", function () {
  smoothScrollTo(wrapper, 0);
  document.getElementById("indexBtn").classList.add("active");
  document.getElementById("pageBtn").classList.remove("active");
});

document.getElementById("pageBtn").addEventListener("click", function () {
  smoothScrollTo(wrapper, window.innerWidth);
  document.getElementById("pageBtn").classList.add("active");
  document.getElementById("indexBtn").classList.remove("active");
});
function updateButtonHighlight() {
  if (wrapper.scrollLeft >= window.innerWidth / 2) {
    document.getElementById("indexBtn").classList.remove("active");
    document.getElementById("pageBtn").classList.add("active");
  } else {
    document.getElementById("pageBtn").classList.remove("active");
    document.getElementById("indexBtn").classList.add("active");
  }
}
