<template>
  <div class="admin-dashboard">
    <aside class="sidebar">
      <div class="sidebar-logo">
        <img
          src="https://res.cloudinary.com/djp2xd5rl/image/upload/v1699784268/da-net7/hefi0ey2dxsir0kvzuba.png"
          alt="Ibommarket Logo"
        />
      </div>
      <nav class="sidebar-nav">
        <RouterLink to="/admin" class="nav-link" exact-active-class="active"
          ><span>Dashboard</span></RouterLink
        >
        <RouterLink
          to="/admin/posts"
          class="nav-link"
          exact-active-class="active"
          ><span>Posts</span></RouterLink
        >
        <RouterLink
          to="/admin/businesses"
          class="nav-link"
          exact-active-class="active"
          ><span>Businesses</span></RouterLink
        >
        <RouterLink
          to="/admin/categories"
          class="nav-link"
          exact-active-class="active"
          ><span>Categories</span></RouterLink
        >
        <RouterLink
          to="/admin/managers"
          class="nav-link"
          exact-active-class="active"
          ><span>Managers</span></RouterLink
        >
        <RouterLink
          to="/admin/roles"
          class="nav-link"
          exact-active-class="active"
          ><span>Roles</span></RouterLink
        >
        <RouterLink
          to="/admin/urgent-requests"
          class="nav-link"
          exact-active-class="active"
          ><span>Urgent Requests</span></RouterLink
        >
        <RouterLink
          to="/admin/advert-slides"
          class="nav-link"
          exact-active-class="active"
          ><span>Advert Slides</span></RouterLink
        >
        <RouterLink
          to="/admin/uiconfig"
          class="nav-link"
          exact-active-class="active"
          ><span>UI Config</span></RouterLink
        >
        <RouterLink
          to="/admin/settings"
          class="nav-link"
          exact-active-class="active"
          ><span>Settings</span></RouterLink
        >
        <div class="nav-link logout" @click="logout"><span>Logout</span></div>
      </nav>
    </aside>
    <main class="dashboard-main">
      <header class="dashboard-header">
        <h1>Admin Dashboard</h1>
      </header>
      <section class="dashboard-shortcuts">
        <h2>Quick Shortcuts</h2>
        <div class="shortcut-grid">
          <RouterLink to="/admin" class="shortcut-card primary"
            >Dashboard</RouterLink
          >
          <RouterLink to="/admin/posts" class="shortcut-card secondary"
            >Posts</RouterLink
          >
          <RouterLink to="/admin/businesses" class="shortcut-card primary"
            >Businesses</RouterLink
          >
          <RouterLink to="/admin/categories" class="shortcut-card secondary"
            >Categories</RouterLink
          >
          <RouterLink to="/admin/managers" class="shortcut-card primary"
            >Managers</RouterLink
          >
          <RouterLink to="/admin/roles" class="shortcut-card secondary"
            >Roles</RouterLink
          >
          <RouterLink to="/admin/urgent-requests" class="shortcut-card primary"
            >Urgent Requests</RouterLink
          >
          <RouterLink to="/admin/advert-slides" class="shortcut-card secondary"
            >Advert Slides</RouterLink
          >
          <RouterLink to="/admin/uiconfig" class="shortcut-card primary"
            >UI Config</RouterLink
          >
          <RouterLink to="/admin/settings" class="shortcut-card secondary"
            >Settings</RouterLink
          >
        </div>
      </section>
      <section class="dashboard-stats">
        <div class="stat-card primary">Total Posts</div>
        <div class="stat-card secondary">Total Businesses</div>
        <div class="stat-card primary">Total Categories</div>
        <div class="stat-card secondary">Total Managers</div>
        <div class="stat-card primary">Urgent Requests</div>
      </section>
      <section class="dashboard-content">
        <div class="dashboard-section">Recent Posts (Table Placeholder)</div>
        <div class="dashboard-section">
          Recent Businesses (Table Placeholder)
        </div>
        <div class="dashboard-section">
          Recent Urgent Requests (Table Placeholder)
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
function logout() {
  localStorage.removeItem("ibmManagementToken");
  router.push("/login");
}
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
}
.sidebar {
  width: 240px;
  background: #006838;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0 1rem 0;
}
.sidebar-logo img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 2rem;
  background: #fff;
  padding: 6px;
}
.sidebar-nav {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.nav-link {
  width: 100%;
  padding: 0.9rem 2rem;
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  border-left: 4px solid transparent;
  transition: background 0.2s, border 0.2s, color 0.2s;
  cursor: pointer;
}
.nav-link.active,
.nav-link:hover {
  background: #f7941d;
  color: #fff;
  border-left: 4px solid #fff;
}
.logout {
  margin-top: 2rem;
  color: #fff;
  background: #e53e3e;
  border-radius: 6px;
  text-align: center;
}
.dashboard-main {
  flex: 1;
  padding: 2rem 2.5rem;
  background: #f8fafc;
}
.dashboard-header {
  margin-bottom: 2rem;
}
.dashboard-header h1 {
  color: #006838;
  font-size: 2rem;
  font-weight: 700;
}
.dashboard-shortcuts {
  margin-bottom: 2rem;
}
.dashboard-shortcuts h2 {
  color: #006838;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  font-weight: 600;
}
.shortcut-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.shortcut-card {
  flex: 1 1 140px;
  min-width: 120px;
  background: #fff;
  border-radius: 10px;
  padding: 1rem 0.5rem;
  text-align: center;
  font-weight: 600;
  font-size: 1rem;
  color: #006838;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(0, 104, 56, 0.08);
  border: 2px solid #006838;
  transition: background 0.2s, color 0.2s, border 0.2s;
  cursor: pointer;
}
.shortcut-card.secondary {
  color: #f7941d;
  border-color: #f7941d;
}
.shortcut-card:hover {
  background: #006838;
  color: #fff;
  border-color: #006838;
}
.shortcut-card.secondary:hover {
  background: #f7941d;
  color: #fff;
  border-color: #f7941d;
}
.dashboard-stats {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}
.stat-card {
  flex: 1 1 180px;
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 104, 56, 0.08);
  text-align: center;
}
.stat-card.primary {
  border-left: 6px solid #006838;
}
.stat-card.secondary {
  border-left: 6px solid #f7941d;
}
.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.dashboard-section {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 104, 56, 0.06);
  min-height: 120px;
}
@media (max-width: 900px) {
  .admin-dashboard {
    flex-direction: column;
  }
  .sidebar {
    width: 100vw;
    flex-direction: row;
    justify-content: space-around;
    padding: 1rem 0;
  }
  .sidebar-logo {
    display: none;
  }
  .sidebar-nav {
    flex-direction: row;
    gap: 0.2rem;
  }
  .nav-link {
    padding: 0.7rem 1rem;
    font-size: 0.95rem;
  }
  .shortcut-grid {
    flex-direction: column;
    gap: 0.7rem;
  }
}
</style>
