// test_boundedqueue_bcc.js
import assert from 'assert';
import { BoundedQueue } from './BoundedQueue.js';

// ---- Base Case: all Base blocks ----
try {
  const q = new BoundedQueue(3); // Base capacity
  q.enqueue(1); // Base element
  q.enqueue(2);
  assert.strictEqual(q.size, 2);
  const out1 = q.dequeue();
  const out2 = q.dequeue();
  assert.strictEqual(out1, 1);
  assert.strictEqual(out2, 2);
  assert.strictEqual(q.is_empty(), true);
  console.log("Base Case passed: all Base blocks work correctly");
} catch (e) {
  console.log("Base Case failed:", e.message);
}

// ---- C-B1: capacity < 0 ----
try {
  new BoundedQueue(-1);
  console.log("C-B1 failed: expected 'capacity < 0' error not thrown");
} catch (e) {
  assert.strictEqual(e.message, "capacity is less than 0");
  console.log("C-B1 passed");
}

// ---- C-B2: capacity = 0 ----
try {
  const q = new BoundedQueue(0); // Base block for other vars
  q.enqueue(10);
  console.log("C-B2 failed: expected 'queue is full' error not thrown");
} catch (e) {
  assert.strictEqual(e.message, "queue is full");
  console.log("C-B2 passed");
}


// **C-B3: capacity = 1 (最小非零容量)**
try {
  const q = new BoundedQueue(1);
  q.enqueue(5);
  assert.strictEqual(q.size, 1);
  const out = q.dequeue();
  assert.strictEqual(out, 5);
  assert.strictEqual(q.is_empty(), true);
  console.log("C-B3 passed: capacity = 1 works correctly");
} catch (e) {
  console.log("C-B3 failed:", e.message);
}


// ---- E-B1: element invalid ----
try {
  const q = new BoundedQueue(3); // Base capacity
  q.enqueue("abc"); // Non-Base element
  console.log("E-B1 failed: expected 'element is invalid' error not thrown");
} catch (e) {
  assert.strictEqual(e.message, "element is invalid");
  console.log("E-B1 passed");
}


// ---- Size-B1: dequeue from empty queue ----
try {
  const q = new BoundedQueue(3); // Base capacity
  q.dequeue(); // Non-Base size = 0
  console.log("Size-B1 failed: expected 'queue is empty' error not thrown");
} catch (e) {
  assert.strictEqual(e.message, "queue is empty");
  console.log("Size-B1 passed");
}

// ---- Size-B3: enqueue into full queue (size = capacity) ----
try {
  const q = new BoundedQueue(3); // Base capacity
  q.enqueue(1);
  q.enqueue(2);
  q.enqueue(3); // full queue
  q.enqueue(10); // should throw
  console.log("Size-B3 failed: expected 'queue is full' error not thrown");
} catch (e) {
  assert.strictEqual(e.message, "queue is full");
  console.log("Size-B3 passed");
}

// Size-B4: queue size = 1 (one-away from empty)
try {
  const q = new BoundedQueue(3);
  q.enqueue(10); // size = 1
  assert.strictEqual(q.size, 1);
  assert.strictEqual(q.is_empty(), false);
  assert.strictEqual(q.is_full(), false);
  console.log("Size-B4 passed: size = 1 (one-away from empty) works correctly");
} catch (e) {
  console.log("Size-B2 failed:", e.message);
}


// ---- Front/Back: wrap around ----
try {
  const q = new BoundedQueue(3);
  q.enqueue(1);
  q.enqueue(2);
  q.dequeue(); // front moves to 1
  q.enqueue(3); // back wraps to 0
  assert.strictEqual(q.elements[q.back - 1 < 0 ? q.capacity - 1 : q.back - 1], 3);
  console.log("Front/Back-B2 passed");
} catch (e) {
  console.log("Front/Back-B2 failed:", e.message);
}

const queueStates = ["empty", "partial", "full"];
const elements = ["valid", "string", "NaN"];

for (const state of queueStates) {
  for (const elemType of elements) {
    try {
      const q = new BoundedQueue(3);
      if (state !== "empty") q.enqueue(1);
      if (state === "full") { q.enqueue(2); q.enqueue(3); }

      const elem =
        elemType === "valid" ? 10 :
        elemType === "string" ? "abc" :
        NaN;

      q.enqueue(elem);
      console.log(`MCC(${state}, ${elemType}) passed`);
    } catch (e) {
      console.log(`MCC(${state}, ${elemType}) -> ${e.message}`);
    }
  }
}