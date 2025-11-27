import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginLocal } from "../redux/auth/authThunk";
import { startSignIn, initGoogle } from "../api/googleAuth"; 

export default function LoginPage() {
  const dispatch = useDispatch<any>();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    
    try {
      initGoogle(() => {}); 
    } catch {
      
    }
  }, []);

  const submit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErr(null);

    if (!email.trim()) return setErr("Please enter email");
    if (!pass.trim()) return setErr("Please enter password");

    try {
      setLoading(true);
      await dispatch(loginLocal(email.trim(), pass));
      setLoading(false);
      
      nav("/");
    } catch (error: any) {
      setLoading(false);
      setErr(error?.message || "Login failed");
    }
  };

  const google = () => {
    try {
      startSignIn();
    } catch (e) {
      console.error("Google not initialized:", e);
      setErr("Google sign-in not ready. Try refreshing.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#fafafa",
        p: 2,
      }}
    >
      <Paper sx={{ width: 460, maxWidth: "95%", p: 4, boxShadow: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Sign in to YouStream
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Welcome back — sign in to continue. You can also continue with a Google account.
        </Typography>

        <form onSubmit={submit} noValidate>
          <TextField
            label="Email"
            size="small"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            size="small"
            fullWidth
            margin="normal"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />

          <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
            <FormControlLabel
              sx={{ mr: 0 }}
              control={
                <Checkbox
                  checked={remember}
                  size="small"
                  onChange={(e) => setRemember(e.target.checked)}
                />
              }
              label={<Typography variant="body2">Remember me</Typography>}
            />
            <Button component={Link} to="/forgot" variant="text" size="small">
              Forgot password
            </Button>
          </Box>

          {err && (
            <Typography color="error" fontSize={13} mt={1}>
              {err}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, py: 1.6, borderRadius: 6 }}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Log in"}
          </Button>
        </form>

        
        <Box textAlign="center" mt={3} mb={1} color="text.secondary">
          <Typography variant="body2">or continue with</Typography>
        </Box>

        <Button
          onClick={google}
          variant="outlined"
          fullWidth
          sx={{
            textTransform: "none",
            borderRadius: 6,
            py: 1.2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
        
          <Box
            component="span"
            sx={{
              width: 28,
              height: 28,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              background: "#fff",
              border: "1px solid #eee",
              fontWeight: 700,
            }}
          >
            G
          </Box>
          <span>Continue with Google</span>
        </Button>

        <Box mt={2} display="flex" justifyContent="center" gap={1}>
          <Typography variant="body2">No account?</Typography>
          <Button component={Link} to="/signup" variant="text" size="small">
            Create account
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
