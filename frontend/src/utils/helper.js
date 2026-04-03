export const validateName = (fullName) => {
  if (!fullName || !fullName.trim()) return "Enter full name.";
  const nameRegex = /^[A-Za-z]+([ '-][A-Za-z]+)*$/;
  if (!nameRegex.test(fullName)) return "Please enter a valid full name.";
  return "";
};
export const validateEmail = (email) => {
  if (!email || !email.trim()) return "Email is required.";
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address.";
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/(?=.*[a-z])/.test(password))
    return "Password must contain at least one lowercase letter";
  if (!/(?=.*[A-Z])/.test(password))
    return "Password must contain at least one uppercase letter";
  if (!/(?=.*\d)/.test(password))
    return "Password must contain at least one number";
  return "";
};

export const validateAvatar = (file) => {
  if (!file) return "Avatar (Profile Picture) is required"; // Avatar is not optional
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return "Avatar must be a .jpeg, .jpg, .webp or .png file";
  }
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return "Avatar must be less than 5MB";
  }
  return "";
};

export const getInitials = (name) => {
  if (!name || typeof name !== "string") return "NA";
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join(" ")
    .toUpperCase()
    .slice(0, 2);
};

// Helper to format date for input type="date"
export const formatDate = (date) => {
  if (!date) return "";
  try {
    if (
      typeof date === "string" &&
      date.length === 10 &&
      date.match(/^\d{4}-\d{2}-\d{2}$/)
    )
      return date;
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
  } catch (err) {
    console.error("[Date Format Error]", { date, error: err?.message });
    return "";
  }
};
