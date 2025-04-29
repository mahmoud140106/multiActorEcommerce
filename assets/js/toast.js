export function showToast(message, type = "success") { 
  const toastElement = document.createElement("div");
  toastElement.classList.add(
    "toast",
    "show",
    "align-items-center",
    "text-white"
  );

  if (type === "success") {
    toastElement.classList.add("bg-success");
  } else if (type === "error") {
    toastElement.classList.add("bg-danger");
  }

  toastElement.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;

  document.getElementById("toast-container").appendChild(toastElement);
  const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
  toast.show();
}
