# Admin vs User Interface Separation

## Overview

Reviwa implements a complete separation between admin and regular user interfaces to ensure role-appropriate functionality and security.

## User Roles

### Regular Users (role: "user")

**Purpose**: Report waste issues, earn eco points, compete on leaderboard

**Accessible Routes:**

- `/` - Landing Page (redirects to `/dashboard` if logged in)
- `/dashboard` - Personal stats, eco points, reports overview
- `/reports` - Browse all public reports
- `/map` - Interactive map view of reports
- `/leaderboard` - Community rankings
- `/create-report` - Submit new waste reports
- `/profile` - Edit personal information
- `/reports/:id` - View report details

**Navigation Items:**

- Dashboard
- Reports
- Map
- Leaderboard
- Report Waste
- Profile

**Features:**

- ✅ Create reports
- ✅ Earn eco points (10/20/50)
- ✅ Appear on leaderboard
- ✅ View community stats
- ❌ Cannot access admin panel
- ❌ Cannot modify report statuses
- ❌ Cannot manage users

---

### Admins (role: "admin")

**Purpose**: Moderate platform, manage reports, oversee users

**Accessible Routes:**

- `/` - Landing Page (redirects to `/admin` if logged in)
- `/admin` - Admin Control Panel (dashboard, users, reports management)
- `/reports` - Browse all reports (public view)
- `/map` - Interactive map view (essential for geographical oversight)
- `/profile` - Edit personal information
- `/reports/:id` - View report details (with admin notes)

**Navigation Items:**

- Admin Control Panel
- Reports
- Map
- Profile

**Features:**

- ✅ View all reports with filters
- ✅ View reports on interactive map (geographical visualization)
- ✅ Update report statuses (assigned → verifying → in-progress → resolved)
- ✅ Add internal admin notes to reports
- ✅ Manage user roles (promote/demote)
- ✅ View platform statistics
- ❌ Cannot create reports
- ❌ Do not earn eco points
- ❌ Not shown on leaderboard
- ❌ No access to user dashboard
- ❌ No access to "Create Report" page

---

## Login Behavior

### Regular User Login

1. User logs in at `/login`
2. Redirected to `/dashboard`
3. Sees full user navigation (Dashboard, Reports, Map, Leaderboard, Create Report)

### Admin Login

1. Admin logs in at `/login`
2. Redirected to `/admin`
3. Sees minimal navigation (only "Admin Control Panel")
4. Attempting to visit `/dashboard` or `/create-report` redirects back to `/admin`

---

## Route Protection

### UserRoute (Regular Users Only)

Wraps routes that admins should NOT access:

- `/dashboard` - Admin has their own panel
- `/create-report` - Admins don't create reports

**Behavior:**

- Unauthenticated → Redirect to `/login`
- Admin user → Redirect to `/admin`
- Regular user → Allow access ✅

### AdminRoute (Admins Only)

Wraps `/admin` route

**Behavior:**

- Unauthenticated → Redirect to `/login`
- Regular user → Redirect to `/dashboard`
- Admin user → Allow access ✅

### PrivateRoute (Both)

Wraps routes accessible to all authenticated users:

- `/profile` - Both can edit their profiles

---

## Navigation Logic

### Desktop Navigation (Navbar)

```javascript
if (user.role === "admin") {
  // Show: Admin Control Panel, Reports, Map
} else {
  // Show: Dashboard, Reports, Map, Leaderboard, Create Report
}
```

### Mobile Navigation (Hamburger Menu)

Same logic as desktop, fully responsive

---

## Why This Separation?

### Security

- Admins shouldn't participate in gamification (unfair advantage)
- Users shouldn't access moderation tools
- Clear separation prevents privilege escalation

### User Experience

- Admins see only relevant controls
- Users see only community features
- No clutter from irrelevant options

### Logical Consistency

- Admin = Platform Manager (behind-the-scenes)
- User = Community Participant (front-facing)
- Their goals are fundamentally different

---

## Implementation Files

### Route Protection

- `client/src/components/AdminRoute.jsx` - Admin-only wrapper
- `client/src/components/UserRoute.jsx` - Regular user-only wrapper
- `client/src/components/PrivateRoute.jsx` - Shared authenticated wrapper

### Navigation

- `client/src/components/Navbar.jsx` - Role-based navigation display

### Context

- `client/src/context/AuthContext.jsx` - Returns user role in login
- `client/src/pages/Login.jsx` - Redirects based on role
- `client/src/pages/LandingPage.jsx` - Redirects logged-in users

### Routing

- `client/src/App.jsx` - Applies route protectors

---

## Testing Checklist

### Regular User Tests

- [ ] Login redirects to `/dashboard`
- [ ] Can create reports
- [ ] Earns eco points for reports
- [ ] Appears on leaderboard
- [ ] Cannot access `/admin` (redirects to `/dashboard`)
- [ ] Sees full navigation menu

### Admin Tests

- [ ] Login redirects to `/admin`
- [ ] Cannot create reports (no access to `/create-report`)
- [ ] Does not earn eco points
- [ ] Does not appear on leaderboard
- [ ] Cannot access `/dashboard` (redirects to `/admin`)
- [ ] Can update report statuses
- [ ] Can add admin notes
- [ ] Can manage user roles
- [ ] Sees only "Admin Control Panel" in navigation

### Shared Tests

- [ ] Both can access `/profile`
- [ ] Both can view `/reports` and `/map`
- [ ] Unauthenticated users cannot access protected routes
