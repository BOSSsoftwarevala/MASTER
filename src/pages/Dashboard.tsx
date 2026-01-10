import { Navigate } from 'react-router-dom';

// Single dashboard route - all users go to /dashboard/boss
// Role-based content is handled within BossOverviewPage
export default function Dashboard() {
  return <Navigate to="/dashboard/boss" replace />;
}
