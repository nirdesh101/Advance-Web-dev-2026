// 1️⃣ DOM references
const actions = document.getElementById("resourceActions");
const resourceNameContainer = document.getElementById("resourceNameContainer");

// Example role
const role = "admin"; // "reserver" | "admin"

// Will hold references to action buttons
let createButton = null;
let updateButton = null;
let deleteButton = null;

// ===============================
// 2️⃣ Button helpers
// ===============================
const BUTTON_BASE_CLASSES =
  "w-full rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-200 ease-out";

const BUTTON_ENABLED_CLASSES =
  "bg-brand-primary text-white hover:bg-brand-dark/80 shadow-soft";

function addButton({ label, type = "button", value, classes = "" }) {
  const btn = document.createElement("button");
  btn.type = type;
  btn.textContent = label;
  btn.name = "action";
  if (value) btn.value = value;

  btn.className = `${BUTTON_BASE_CLASSES} ${classes}`.trim();

  actions.appendChild(btn);
  return btn;
}

function setButtonEnabled(btn, enabled) {
  if (!btn) return;
  btn.disabled = !enabled;
  btn.classList.toggle("cursor-not-allowed", !enabled);
  btn.classList.toggle("opacity-50", !enabled);

  if (!enabled) {
    btn.classList.remove("hover:bg-brand-dark/80");
  } else if (btn.value === "create" || btn.textContent === "Create") {
    btn.classList.add("hover:bg-brand-dark/80");
  }
}

function renderActionButtons(currentRole) {
  if (currentRole === "reserver") {
    createButton = addButton({
      label: "Create",
      type: "submit",
      classes: BUTTON_ENABLED_CLASSES,
    });
  }

  if (currentRole === "admin") {
    createButton = addButton({
      label: "Create",
      type: "submit",
      value: "create",
      classes: BUTTON_ENABLED_CLASSES,
    });

    updateButton = addButton({
      label: "Update",
      value: "update",
      classes: BUTTON_ENABLED_CLASSES,
    });

    deleteButton = addButton({
      label: "Delete",
      value: "delete",
      classes: BUTTON_ENABLED_CLASSES,
    });
  }

  // Initially disabled
  setButtonEnabled(createButton, false);
  setButtonEnabled(updateButton, false);
  setButtonEnabled(deleteButton, false);
}

// ===============================
// 3️⃣ Input creation + validation
// ===============================
function createResourceNameInput(container) {
  const input = document.createElement("input");
  input.id = "resourceName";
  input.name = "resourceName";
  input.type = "text";
  input.placeholder = "e.g., Meeting Room A";
  input.className = `
    mt-2 w-full rounded-2xl border border-black/10 bg-white
    px-4 py-3 text-sm outline-none
    focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30
    transition-all duration-200 ease-out
  `;
  container.appendChild(input);
  return input;
}

function setInputVisualState(input, state) {
  input.classList.remove(
    "border-green-500", "bg-green-100", "focus:ring-green-500/30",
    "border-red-500", "bg-red-100", "focus:ring-red-500/30",
    "focus:border-brand-blue", "focus:ring-brand-blue/30"
  );
  input.classList.add("focus:ring-2");

  if (state === "valid") input.classList.add("border-green-500", "bg-green-100", "focus:ring-green-500/30");
  else if (state === "invalid") input.classList.add("border-red-500", "bg-red-100", "focus:ring-red-500/30");
}

// ✅ Global form validation for BOTH fields
function attachFullFormValidation(nameInput, descriptionInput) {
  const update = () => {
    const nameRaw = nameInput.value.trim();
    const descRaw = descriptionInput.value.trim();

    const nameValid = isResourceNameValid(nameRaw);
    const descValid = isResourceDescriptionValid(descRaw);

    // Visual states
    setInputVisualState(nameInput, nameRaw === "" ? "neutral" : (nameValid ? "valid" : "invalid"));
    setInputVisualState(descriptionInput, descRaw === "" ? "neutral" : (descValid ? "valid" : "invalid"));

    // Enable Create button only if both are valid
    setButtonEnabled(createButton, nameValid && descValid);
  };

  nameInput.addEventListener("input", update);
  descriptionInput.addEventListener("input", update);

  update(); // initial check
}

// ===============================
// 4️⃣ Bootstrapping
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  renderActionButtons(role);

  const resourceNameInput = createResourceNameInput(resourceNameContainer);
  const descriptionInput = document.getElementById("resourceDescription");

  if (!resourceNameInput || !descriptionInput) {
    console.error("Resource inputs not found!");
    return;
  }

  attachFullFormValidation(resourceNameInput, descriptionInput);
});

// ------------------------------
// Full form validation function
// ------------------------------
function attachFullFormValidation(nameInput, descriptionInput) {
  const update = () => {
    const nameRaw = nameInput.value.trim();
    const descRaw = descriptionInput.value.trim();

    const nameValid = isResourceNameValid(nameRaw);
    const descValid = isResourceDescriptionValid(descRaw);

    // Update visual state
    setInputVisualState(nameInput, nameRaw === "" ? "neutral" : (nameValid ? "valid" : "invalid"));
    setInputVisualState(descriptionInput, descRaw === "" ? "neutral" : (descValid ? "valid" : "invalid"));

    // Enable Create button only if BOTH valid
    setButtonEnabled(createButton, nameValid && descValid);
  };

  nameInput.addEventListener("input", update);
  descriptionInput.addEventListener("input", update);

  update(); // initial check
}

// ------------------------------
// Visual state function
// ------------------------------
function setInputVisualState(input, state) {
  input.classList.remove(
    "border-green-500", "bg-green-100", "focus:ring-green-500/30",
    "border-red-500", "bg-red-100", "focus:ring-red-500/30",
    "focus:border-brand-blue", "focus:ring-brand-blue/30"
  );

  input.classList.add("focus:ring-2");

  if (state === "valid") {
    input.classList.add("border-green-500", "bg-green-100", "focus:ring-green-500/30");
  } else if (state === "invalid") {
    input.classList.add("border-red-500", "bg-red-100", "focus:ring-red-500/30");
  }
}


