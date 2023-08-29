let isDragging = false;
let startDragX;
let initialScroll;
const wrapper = document.getElementById("wrapper");
const snapThreshold = 100;

// Functions for dragging
function startDrag(event) {
  if (event.touches) {
    // if it's a touch event
    event = event.touches[0]; // take the first touch point
  }

  isDragging = true;
  startDragX = event.clientX;
  initialScroll = wrapper.scrollLeft;
}

function duringDrag(event) {
  if (!isDragging) return;

  let clientX;
  if (event.touches) {
    // if it's a touch event
    event.preventDefault(); // prevent default to stop the usual scroll
    clientX = event.touches[0].clientX; // take the first touch point
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

    if (Math.abs(dx) > snapThreshold) {
      if (dx > 0) {
        smoothScrollTo(wrapper, window.innerWidth);
      } else {
        smoothScrollTo(wrapper, 0);
      }
    } else {
      smoothScrollTo(wrapper, initialScroll);
    }

    updateButtonHighlight();
  }
  isDragging = false;
}

function updateButtonHighlight() {
  if (wrapper.scrollLeft >= window.innerWidth / 2) {
    document.getElementById("indexBtn").classList.remove("active");
    document.getElementById("pageBtn").classList.add("active");
  } else {
    document.getElementById("pageBtn").classList.remove("active");
    document.getElementById("indexBtn").classList.add("active");
  }
}

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

document.getElementById("pageBtn").addEventListener("click", function () {
  smoothScrollTo(wrapper, window.innerWidth);
});
