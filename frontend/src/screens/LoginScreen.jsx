import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "../components";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";
import styles from "../effects/form.module.css";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { user, login, isLoading } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      toast.error(err?.message);
    }
  };
  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>Sign In</h1>
      <form onSubmit={submitHandler} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email Address
          </label>
          <input
            type="email"
            id="email"
            placeholder="email@mail.co"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="****"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        {isLoading && <Loader />}

        <button type="submit" className={styles.submitButton}>
          Sign In
        </button>

        <div className={styles.loginPrompt}>
          New Customer?{" "}
          <Link to="/register" className={styles.loginLink}>
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginScreen;
