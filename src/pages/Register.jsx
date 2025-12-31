import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    photo: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 6) errors.push("At least 6 characters");
    if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      const passwordErrors = validatePassword(value);
      setErrors({ ...errors, password: passwordErrors });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const passwordErrors = validatePassword(form.password);

    if (passwordErrors.length > 0) {
      toast.error(`Password requirements: ${passwordErrors.join(", ")}`);
      return;
    }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      if (form.name || form.photo) {
        await updateProfile(cred.user, {
          displayName: form.name || null,
          photoURL: form.photo || null,
        });
      }
      toast.success("🎉 Account created successfully! Welcome to BookHub!", {
        duration: 3000,
        style: {
          background: "linear-gradient(135deg, #10b981, #059669)",
          color: "white",
          fontWeight: "600",
        },
      });
      nav("/");
    } catch (err) {
      toast.error(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("🎉 Welcome to BookHub!");
      nav("/");
    } catch (err) {
      toast.error(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <form onSubmit={submit} className="auth-form">
          <div>
            <input
              name="name"
              className="input"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
            />
          </div>

          <div>
            <input
              name="email"
              className="input"
              value={form.email}
              onChange={handleChange}
              required
              type="email"
              placeholder="Email Address"
            />
          </div>

          <div>
            <input
              name="photo"
              className="input"
              value={form.photo}
              onChange={handleChange}
              type="url"
              placeholder="Photo URL (optional)"
            />
          </div>

          <div>
            <input
              name="password"
              className="input"
              value={form.password}
              onChange={handleChange}
              required
              type="password"
              placeholder="Password"
            />
            {errors.password && errors.password.length > 0 && (
              <div className="mt-2 text-sm text-red-400">
                <p className="mb-1">Password must include:</p>
                <ul className="list-disc list-inside space-y-1">
                  {errors.password.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            className="btn w-full flex items-center justify-center gap-2"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                {/* <LoadingSpinner size={10} /> */}
                Creating Account ...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>
        <hr className="auth-divider" />
        <button
          className="btn w-full bg-white text-black hover:bg-gray-100"
          onClick={google}
          disabled={loading}
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </span>
        </button>
        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
