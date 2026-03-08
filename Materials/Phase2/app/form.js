
// ===============================
// Form handling for resources page
// ===============================

// -------------- Helpers --------------
function $(id) {
  return document.getElementById(id);
}

function logSection(title, data) {
  console.group(title);
  console.log(data);
  console.groupEnd();
}

// -------------- Form wiring --------------
function isResourceNameValid(value) {
  const trimmed = value.trim();
  const allowedPattern = /^[a-zA-Z0-9äöåÄÖÅ ]+$/;

  return trimmed.length >= 5 &&
         trimmed.length <= 30 &&
         allowedPattern.test(trimmed);
}

function isResourceDescriptionValid(value) {
  const trimmed = value.trim();
  const allowedPattern = /^[a-zA-Z0-9äöåÄÖÅ ]+$/;

  return trimmed.length >= 10 &&
         trimmed.length <= 50 &&
         allowedPattern.test(trimmed);
}


document.addEventListener("DOMContentLoaded", () => {
  const form = $("resourceForm");
  if (!form) {
    console.warn("resourceForm not found. Ensure the form has id=\"resourceForm\".");
    return;
  }

  form.addEventListener("submit", onSubmit);
});

async function onSubmit(event) {

  event.preventDefault();

  const submitter = event.submitter;
  const actionValue = submitter && submitter.value ? submitter.value : "create";

  // Trim values first
  const name = $("resourceName")?.value.trim() ?? "";
  const description = $("resourceDescription")?.value.trim() ?? "";

  // Validate BEFORE sending
  if (!isResourceNameValid(name) || !isResourceDescriptionValid(description)) {

    console.warn("Invalid form data. Request NOT sent.");

    alert("Please enter valid resource name and description.");

    return; // STOP — do not send request
  }

  // Clean values back into form
  $("resourceName").value = name;
  $("resourceDescription").value = description;

  const payload = {
    action: actionValue,
    resourceName: name,
    resourceDescription: description,
    resourceAvailable: $("resourceAvailable")?.checked ?? false,
    resourcePrice: $("resourcePrice")?.value ?? "",
    resourcePriceUnit: document.querySelector('input[name="resourcePriceUnit"]:checked')?.value ?? ""
  };

  logSection("Sending payload to httpbin.org/post", payload);

  try {

    const response = await fetch("https://httpbin.org/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    console.log("SUCCESS:", data);

    alert("Resource created successfully!");

  } catch (err) {

    console.error("POST error:", err);

    alert("Server error. Please try again.");
  }
}
