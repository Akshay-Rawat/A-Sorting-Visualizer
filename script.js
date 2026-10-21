
const arrayContainer = document.getElementById("array");
const sizeSlider = document.getElementById("sizeSlider");
const speedSlider = document.getElementById("speedSlider");

const generateBtn = document.getElementById("generateBtn");
const sortButtons = document.querySelectorAll("[data-sort]");

let arr = [];
let delay = Number(speedSlider.value);
let comparisons = 0;
let swaps = 0;
let isSorting = false;
let animationToken = 0;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function updateStats() {
  document.getElementById("comparisons").textContent = comparisons;
  document.getElementById("swaps").textContent = swaps;
}

function resetStats() {
  comparisons = 0;
  swaps = 0;
  updateStats();
}

function setStatus(message) {
  document.getElementById("status").textContent = message;
}

function setAlgorithmName(name) {
  document.getElementById("algorithmName").textContent = name;
  document.getElementById("chartDescription").textContent =
    name === "Unsorted Array"
      ? "Generate an array and choose an algorithm."
      : `Visualizing ${name}.`;
}

function setControlsDisabled(disabled) {
  generateBtn.disabled = disabled;
  sizeSlider.disabled = disabled;
  sortButtons.forEach(button => {
    button.disabled = disabled;
  });
}

function generateArray(size = Number(sizeSlider.value)) {
  if (isSorting) return;

  animationToken++;
  arr = Array.from(
    { length: size },
    () => Math.floor(Math.random() * 280) + 20
  );

  resetStats();
  setStatus("Ready");
  setAlgorithmName("Unsorted Array");
  renderBars();
}

function renderBars(highlight = [], sortedIndices = []) {
  arrayContainer.innerHTML = "";

  const maxValue = Math.max(...arr, 1);
  const fragment = document.createDocumentFragment();

  arr.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${(value / maxValue) * 100}%`;
    bar.title = String(value);

    if (highlight.includes(index)) {
      bar.classList.add("comparing");
    }

    if (sortedIndices.includes(index)) {
      bar.classList.add("sorted");
    }

    fragment.appendChild(bar);
  });

  arrayContainer.appendChild(fragment);
}

async function visualize(highlight = [], sortedIndices = []) {
  renderBars(highlight, sortedIndices);
  await sleep(delay);
}

function assertCurrent(token) {
  if (token !== animationToken) {
    throw new Error("Sorting cancelled");
  }
}

async function startSort(sortFunction, name) {
  if (isSorting || arr.length === 0) return;

  isSorting = true;
  const token = ++animationToken;

  setControlsDisabled(true);
  resetStats();
  setStatus("Sorting...");
  setAlgorithmName(name);

  try {
    await sortFunction(token);
    assertCurrent(token);

    renderBars([], arr.map((_, index) => index));
    setStatus("Completed");
    document.getElementById("chartDescription").textContent =
      `${name} finished sorting the array.`;
  } catch (error) {
    if (error.message !== "Sorting cancelled") {
      console.error(error);
      setStatus("Error");
    }
  } finally {
    isSorting = false;
    setControlsDisabled(false);
  }
}

/* Bubble Sort */
async function bubbleSort(token) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      assertCurrent(token);
      comparisons++;
      updateStats();

      await visualize([j, j + 1]);

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;
        updateStats();
      }
    }

    renderBars([], arr.map((_, index) => index >= n - i - 1 ? index : -1)
      .filter(index => index >= 0));
  }
}

/* Selection Sort */
async function selectionSort(token) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < n; j++) {
      assertCurrent(token);
      comparisons++;
      updateStats();

      await visualize([minIndex, j]);

      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      swaps++;
      updateStats();
    }

    renderBars([i], Array.from({ length: i }, (_, k) => k));
    await sleep(delay);
  }
}

/* Merge Sort */
async function mergeSortWrapper(token) {
  await mergeSort(0, arr.length - 1, token);
}

async function mergeSort(left, right, token) {
  assertCurrent(token);
  if (left >= right) return;

  const mid = Math.floor((left + right) / 2);

  await mergeSort(left, mid, token);
  await mergeSort(mid + 1, right, token);
  await merge(left, mid, right, token);
}

async function merge(left, mid, right, token) {
  const leftPart = arr.slice(left, mid + 1);
  const rightPart = arr.slice(mid + 1, right + 1);

  let i = 0;
  let j = 0;
  let k = left;

  while (i < leftPart.length && j < rightPart.length) {
    assertCurrent(token);
    comparisons++;
    updateStats();

    if (leftPart[i] <= rightPart[j]) {
      arr[k] = leftPart[i++];
    } else {
      arr[k] = rightPart[j++];
    }

    swaps++;
    updateStats();
    await visualize([k]);
    k++;
  }

  while (i < leftPart.length) {
    assertCurrent(token);
    arr[k] = leftPart[i++];
    swaps++;
    updateStats();
    await visualize([k]);
    k++;
  }

  while (j < rightPart.length) {
    assertCurrent(token);
    arr[k] = rightPart[j++];
    swaps++;
    updateStats();
    await visualize([k]);
    k++;
  }
}

/* Quick Sort */
async function quickSortWrapper(token) {
  await quickSort(0, arr.length - 1, token);
}

async function quickSort(low, high, token) {
  assertCurrent(token);
  if (low >= high) return;

  const pivotIndex = await partition(low, high, token);
  await quickSort(low, pivotIndex - 1, token);
  await quickSort(pivotIndex + 1, high, token);
}

async function partition(low, high, token) {
  const pivot = arr[high];
  let i = low;

  for (let j = low; j < high; j++) {
    assertCurrent(token);
    comparisons++;
    updateStats();

    await visualize([j, high]);

    if (arr[j] < pivot) {
      if (i !== j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        swaps++;
        updateStats();
      }

      i++;
    }
  }

  if (i !== high) {
    [arr[i], arr[high]] = [arr[high], arr[i]];
    swaps++;
    updateStats();
  }

  await visualize([i]);
  return i;
}

/* Event listeners */
generateBtn.addEventListener("click", () => {
  generateArray();
});

sortButtons.forEach(button => {
  button.addEventListener("click", () => {
    const sortName = button.dataset.sort;
    const names = {
      bubbleSort: "Bubble Sort",
      selectionSort: "Selection Sort",
      mergeSortWrapper: "Merge Sort",
      quickSortWrapper: "Quick Sort"
    };

    startSort(window[sortName], names[sortName]);
  });
});

sizeSlider.addEventListener("input", () => {
  document.getElementById("sizeValue").textContent = sizeSlider.value;
  generateArray(Number(sizeSlider.value));
});

speedSlider.addEventListener("input", () => {
  delay = Number(speedSlider.value);
  document.getElementById("speedValue").textContent = delay;
});

generateArray();
