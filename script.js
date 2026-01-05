const container = document.getElementById("arrayContainer");

const generateBtn = document.getElementById("generateBtn");
const sortBtn = document.getElementById("sortBtn");
const pauseBtn = document.getElementById("pauseBtn");
const stopBtn = document.getElementById("stopBtn");

const sizeSlider = document.getElementById("sizeSlider");
const speedSlider = document.getElementById("speedSlider");
const sizeLabel = document.getElementById("sizeLabel");
const speedLabel = document.getElementById("speedLabel");

let array = [];
let bars = [];

let running = false;
let paused = false;
let stopRequested = false;

// ---------- Utils ----------
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitIfPaused() {
  while (paused && !stopRequested) {
    await sleep(50);
  }
}

function setUI(isRunning) {
  sizeSlider.disabled = isRunning;
  generateBtn.disabled = isRunning;
  sortBtn.disabled = isRunning;

  pauseBtn.disabled = !isRunning;
  stopBtn.disabled = !isRunning;

  pauseBtn.textContent = paused ? "Resume" : "Pause";
}

function getSpeed() {
  return Number(speedSlider.value);
}

function clearBarClasses() {
  bars.forEach((b) => b.classList.remove("compare", "write", "sorted"));
}

// ---------- Generate ----------
function generateArray() {
  const n = Number(sizeSlider.value);
  array = [];
  container.innerHTML = "";
  bars = [];

  for (let i = 0; i < n; i++) {
    const val = Math.floor(Math.random() * 320) + 30;
    array.push(val);

    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${val}px`;

    container.appendChild(bar);
    bars.push(bar);
  }

  clearBarClasses();
}

sizeSlider.addEventListener("input", () => {
  sizeLabel.textContent = sizeSlider.value;
});
speedSlider.addEventListener("input", () => {
  speedLabel.textContent = speedSlider.value;
});

// ---------- Merge Sort (Recursive) ----------
async function mergeSort(l, r) {
  if (stopRequested) return;
  if (l >= r) return;

  const mid = Math.floor((l + r) / 2);
  await mergeSort(l, mid);
  await mergeSort(mid + 1, r);
  await merge(l, mid, r);
}

async function merge(l, mid, r) {
  if (stopRequested) return;

  const left = array.slice(l, mid + 1);
  const right = array.slice(mid + 1, r + 1);

  let i = 0;
  let j = 0;
  let k = l;

  // highlight range being merged
  for (let x = l; x <= r; x++) {
    bars[x].classList.add("compare");
  }
  await sleep(getSpeed());

  while (i < left.length && j < right.length) {
    if (stopRequested) return;
    await waitIfPaused();

    // mark writing position
    bars[k].classList.remove("compare");
    bars[k].classList.add("write");

    await sleep(getSpeed());

    if (left[i] <= right[j]) {
      array[k] = left[i++];
    } else {
      array[k] = right[j++];
    }

    bars[k].style.height = `${array[k]}px`;
    bars[k].classList.remove("write");
    bars[k].classList.add("compare");

    k++;
    await sleep(Math.max(10, getSpeed() / 2));
  }

  while (i < left.length) {
    if (stopRequested) return;
    await waitIfPaused();

    bars[k].classList.remove("compare");
    bars[k].classList.add("write");
    await sleep(getSpeed());

    array[k] = left[i++];
    bars[k].style.height = `${array[k]}px`;

    bars[k].classList.remove("write");
    bars[k].classList.add("compare");
    k++;
  }

  while (j < right.length) {
    if (stopRequested) return;
    await waitIfPaused();

    bars[k].classList.remove("compare");
    bars[k].classList.add("write");
    await sleep(getSpeed());

    array[k] = right[j++];
    bars[k].style.height = `${array[k]}px`;

    bars[k].classList.remove("write");
    bars[k].classList.add("compare");
    k++;
  }

  // remove highlight after merge
  for (let x = l; x <= r; x++) {
    bars[x].classList.remove("compare", "write");
  }
}

// ---------- Run / Controls ----------
async function startSort() {
  if (running) return;

  running = true;
  paused = false;
  stopRequested = false;

  clearBarClasses();
  setUI(true);

  await mergeSort(0, array.length - 1);

  // if not stopped, mark sorted
  if (!stopRequested) {
    bars.forEach((b) => b.classList.add("sorted"));
  } else {
    clearBarClasses();
  }

  running = false;
  paused = false;
  stopRequested = false;
  setUI(false);
}

generateBtn.addEventListener("click", generateArray);

sortBtn.addEventListener("click", startSort);

pauseBtn.addEventListener("click", () => {
  if (!running) return;
  paused = !paused;
  pauseBtn.textContent = paused ? "Resume" : "Pause";
});

stopBtn.addEventListener("click", () => {
  if (!running) return;
  stopRequested = true;
  paused = false;
});

// ---------- Init ----------
sizeLabel.textContent = sizeSlider.value;
speedLabel.textContent = speedSlider.value;
generateArray();
