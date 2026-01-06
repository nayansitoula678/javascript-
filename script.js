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
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitIfPaused() {
  while (paused && !stopRequested) {
    await sleep(50);
  }
}

function getSpeed() {
  return Number(speedSlider.value);
}

function setUI(isRunning) {
  sizeSlider.disabled = isRunning;
  generateBtn.disabled = isRunning;
  sortBtn.disabled = isRunning;

  pauseBtn.disabled = !isRunning;
  stopBtn.disabled = !isRunning;

  pauseBtn.textContent = paused ? "Resume" : "Pause";
}

function clearClasses() {
  bars.forEach(b => b.classList.remove("pivot", "compare", "swap", "sorted"));
}

function paintRangeNormal(l, r) {
  for (let i = l; i <= r; i++) {
    bars[i].classList.remove("pivot", "compare", "swap");
  }
}

function swap(i, j) {
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;

  bars[i].style.height = `${array[i]}px`;
  bars[j].style.height = `${array[j]}px`;
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

  clearClasses();
}

sizeSlider.addEventListener("input", () => {
  sizeLabel.textContent = sizeSlider.value;
});
speedSlider.addEventListener("input", () => {
  speedLabel.textContent = speedSlider.value;
});

// ---------- Quick Sort (Recursive) ----------
async function quickSort(l, r) {
  if (stopRequested) return;
  if (l >= r) {
    if (l === r) bars[l]?.classList.add("sorted");
    return;
  }

  const pivotIndex = r;           // pivot = last element (simple + common)
  const pivotValue = array[pivotIndex];
  bars[pivotIndex].classList.add("pivot");
  await sleep(getSpeed());

  let i = l; // place for smaller elements

  for (let j = l; j < r; j++) {
    if (stopRequested) return;
    await waitIfPaused();

    bars[j].classList.add("compare");
    await sleep(getSpeed());

    if (array[j] < pivotValue) {
      bars[i].classList.add("swap");
      bars[j].classList.add("swap");
      await sleep(Math.max(10, getSpeed() / 2));

      swap(i, j);

      await sleep(Math.max(10, getSpeed() / 2));
      bars[i].classList.remove("swap");
      bars[j].classList.remove("swap");

      i++;
    }

    bars[j].classList.remove("compare");
  }

  // final pivot swap into correct position
  bars[i].classList.add("swap");
  bars[pivotIndex].classList.add("swap");
  await sleep(getSpeed());

  swap(i, pivotIndex);

  await sleep(getSpeed());
  paintRangeNormal(l, r);

  bars[i].classList.remove("pivot", "swap", "compare");
  bars[i].classList.add("sorted");

  // recurse left and right partitions
  await quickSort(l, i - 1);
  await quickSort(i + 1, r);
}

// ---------- Run / Controls ----------
async function startSort() {
  if (running) return;

  running = true;
  paused = false;
  stopRequested = false;

  clearClasses();
  setUI(true);

  await quickSort(0, array.length - 1);

  if (!stopRequested) {
    bars.forEach(b => b.classList.add("sorted"));
  } else {
    clearClasses();
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
