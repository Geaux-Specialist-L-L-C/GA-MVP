import { fireEvent, render, screen } from "@testing-library/react";
import StudentDashboard from "../profile/StudentProfile/StudentDashboard";
import { getStudentProfile } from "../../services/profileService";

const mockNavigate = jest.fn();
const mockUseParams = jest.fn();
const mockUseAuth = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams()
}));

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth()
}));

jest.mock('../../services/profileService', () => ({
  getStudentProfile: jest.fn()
}));

describe('StudentDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders setup state when student id is missing and user is authenticated', () => {
    mockUseParams.mockReturnValue({ id: undefined });
    mockUseAuth.mockReturnValue({ currentUser: { uid: 'parent-123' } });

    render(<StudentDashboard />);

    expect(screen.getByRole('heading', { name: /student profile not found/i })).toBeInTheDocument();
    expect(screen.getByText(/needs a student profile before it can load/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to parent dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add student/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    expect(getStudentProfile).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /back to parent dashboard/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/parent-dashboard');

    fireEvent.click(screen.getByRole('button', { name: /add student/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/create-student');
  });

  test('renders setup state with login CTA when user is not authenticated', () => {
    mockUseParams.mockReturnValue({ id: undefined });
    mockUseAuth.mockReturnValue({ currentUser: null });

    render(<StudentDashboard />);

    expect(screen.getByRole('heading', { name: /student profile not found/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to login/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /add student/i })).not.toBeInTheDocument();
    expect(getStudentProfile).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /go to login/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
