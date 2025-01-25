
import { useAuth } from '../../context/AuthContext';

export default function ParentProfile() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Parent Profile</h1>
      <p>Welcome {user?.email}</p>
      {/* Add more profile content here */}
    </div>
  );
}