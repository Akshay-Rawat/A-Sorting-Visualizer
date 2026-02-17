const arrayContainer = document.getElementById("array");
let arr = [];
let delay = 50;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateArray(size = 40) {
  arr = [];
  arrayContainer.innerHTML = "";

  for (let i = 0; i < size; i++) {
    let value = Math.floor(Math.random() * 300) + 20;
    arr.push(value);

    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value}px`;
    arrayContainer.appendChild(bar);
  }
}

function updateBars() {
  const bars = document.querySelectorAll(".bar");
  bars.forEach((bar, i) => {
    bar.style.height = `${arr[i]}px`;
  });
}

/* ---------------- Bubble Sort ---------------- */
async function bubbleSort() {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        updateBars();
        await sleep(delay);
      }
    }
  }
}

/* ---------------- Selection Sort ---------------- */
async function selectionSort() {
  for (let i = 0; i < arr.length; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[min]) {
        min = j;
      }
    }
    [arr[i], arr[min]] = [arr[min], arr[i]];
    updateBars();
    await sleep(delay);
  }
}

/* ---------------- Merge Sort ---------------- */
async function mergeSortWrapper() {
  await mergeSort(0, arr.length - 1);
}

async function mergeSort(left, right) {
  if (left >= right) return;

  const mid = Math.floor((left + right) / 2);
  await mergeSort(left, mid);
  await mergeSort(mid + 1, right);
  await merge(left, mid, right);
}

async function merge(left, mid, right) {
  let temp = [];
  let i = left, j = mid + 1;

  while (i <= mid && j <= right) {
    if (arr[i] < arr[j]) {
      temp.push(arr[i++]);
    } else {
      temp.push(arr[j++]);
    }
  }

  while (i <= mid) temp.push(arr[i++]);
  while (j <= right) temp.push(arr[j++]);

  for (let k = left; k <= right; k++) {
    arr[k] = temp[k - left];
    updateBars();
    await sleep(delay);
  }
}

/* ---------------- Quick Sort ---------------- */
async function quickSortWrapper() {
  await quickSort(0, arr.length - 1);
}

async function quickSort(low, high) {
  if (low < high) {
    let pi = await partition(low, high);
    await quickSort(low, pi - 1);
    await quickSort(pi + 1, high);
  }
}

async function partition(low, high) {
  let pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      updateBars();
      await sleep(delay);
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  updateBars();
  await sleep(delay);

  return i + 1;
}

generateArray();
