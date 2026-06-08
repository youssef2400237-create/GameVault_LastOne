const signupForm = document.getElementById("signupForm");
const fullnameInput = document.getElementById("fullname");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirmPassword");

const nameError = document.querySelector(".error-name");
const emailError = document.querySelector(".error-email");
const passwordError = document.querySelector(".error-password");
const confirmError = document.querySelector(".error-confirm");

// ── Toggle password visibility ──
document.getElementById("togglePassword").addEventListener("click", () => {
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;
  document.getElementById("togglePassword").classList.toggle("fa-eye");
  document.getElementById("togglePassword").classList.toggle("fa-eye-slash");
});

document.getElementById("toggleConfirm").addEventListener("click", () => {
  const type = confirmInput.type === "password" ? "text" : "password";
  confirmInput.type = type;
  document.getElementById("toggleConfirm").classList.toggle("fa-eye");
  document.getElementById("toggleConfirm").classList.toggle("fa-eye-slash");
});

// ── Helper: show/clear error ──
function showError(input, errorEl, message) {
  errorEl.textContent = message;
  input.classList.add("input--error");
  input.classList.remove("input--success");
}

function clearError(input, errorEl) {
  errorEl.textContent = "";
  input.classList.remove("input--error");
  input.classList.add("input--success");
}

// ── Validators ──
function validateName() {
  const value = fullnameInput.value.trim();
  if (!value) {
    showError(fullnameInput, nameError, "Full name is required.");
    return false;
  }
  if (value.length < 3) {
    showError(fullnameInput, nameError, "Name must be at least 3 characters.");
    return false;
  }
  clearError(fullnameInput, nameError);
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value) {
    showError(emailInput, emailError, "Email is required.");
    return false;
  }
  if (!emailRegex.test(value)) {
    showError(emailInput, emailError, "Please enter a valid email address.");
    return false;
  }
  clearError(emailInput, emailError);
  return true;
}

function validatePassword() {
  const value = passwordInput.value;
  if (!value) {
    showError(passwordInput, passwordError, "Password is required.");
    return false;
  }
  if (value.length < 6) {
    showError(passwordInput, passwordError, "Password must be at least 6 characters.");
    return false;
  }
  if (!/\d/.test(value)) {
    showError(passwordInput, passwordError, "Password must contain at least one number.");
    return false;
  }
  clearError(passwordInput, passwordError);
  return true;
}

function validateConfirm() {
  const value = confirmInput.value;
  if (!value) {
    showError(confirmInput, confirmError, "Please confirm your password.");
    return false;
  }
  if (value !== passwordInput.value) {
    showError(confirmInput, confirmError, "Passwords do not match.");
    return false;
  }
  clearError(confirmInput, confirmError);
  return true;
}

// ── Live validation on blur ──
fullnameInput.addEventListener("blur", validateName);
emailInput.addEventListener("blur", validateEmail);
passwordInput.addEventListener("blur", validatePassword);
confirmInput.addEventListener("blur", validateConfirm);

// ── Form submit ──
signupForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isConfirmValid = validateConfirm();

  if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmValid) return;

  const btn = signupForm.querySelector(".btn");
  btn.disabled = true;
  btn.textContent = "Creating Account...";

  try {
    const response = await fetch("/api/users/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // إصلاح: الـ backend يتوقع "userName" مش "name"
        userName: fullnameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Show backend validation errors if any
      if (data.errors) {
        data.errors.forEach((err) => {
          if (err.field === "email")
            showError(emailInput, emailError, err.message);
          if (err.field === "password")
            showError(passwordInput, passwordError, err.message);
          if (err.field === "name" || err.field === "userName")
            showError(fullnameInput, nameError, err.message);
        });
      } else if (data.message) {
        // عرض رسالة الخطأ العامة
        showError(emailInput, emailError, data.message);
      }
      btn.disabled = false;
      btn.textContent = "Create Account";
      return;
    }

    // Success — redirect to login page (EJS route)
    window.location.href = "/";
  } catch (err) {
    console.error("Signup error:", err);
    btn.disabled = false;
    btn.textContent = "Create Account";
  }
});
