const role = localStorage.getItem("role");

// الأزرار
const adminPanelBtn = document.getElementById("adminPanelBtn");
const addAnnouncementBtn = document.getElementById("addAnnouncementBtn");
const staffTasksBtn = document.getElementById("staffTasksBtn");

// نخبي الكل افتراضيا
if (adminPanelBtn) adminPanelBtn.style.display = "none";
if (addAnnouncementBtn) addAnnouncementBtn.style.display = "none";
if (staffTasksBtn) staffTasksBtn.style.display = "none";

// owner + admin
if (role === "owner" || role === "admin") {
  if (adminPanelBtn) adminPanelBtn.style.display = "block";
  if (addAnnouncementBtn) addAnnouncementBtn.style.display = "block";
  if (staffTasksBtn) staffTasksBtn.style.display = "block";
}

// support (غير مهام الموظفين)
if (role === "support") {
  if (staffTasksBtn) staffTasksBtn.style.display = "block";
}
