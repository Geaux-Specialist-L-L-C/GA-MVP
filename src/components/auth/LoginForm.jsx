// ...existing code...
const handleGoogleLogin = async () => {
  try {
    await loginWithGoogle();
    navigate("/dashboard"); // This should redirect to dashboard
  } catch (error) {
    setError(error.message);
  }
};
// ...existing code...
