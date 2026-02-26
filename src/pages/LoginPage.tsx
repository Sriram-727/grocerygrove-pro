import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Store, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (isSignUp) {
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        setSubmitting(false);
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        setSubmitting(false);
        return;
      }
      const { error } = await signUp(email, password, fullName);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created! Check your email to confirm, then sign in.");
        setIsSignUp(false);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Welcome back!");
        navigate("/admin");
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Store className="h-10 w-10 text-primary" style={{ color: "hsl(152, 55%, 45%)" }} />
            <h1 className="text-4xl font-bold font-display" style={{ color: "hsl(0, 0%, 100%)" }}>
              UGMS
            </h1>
          </div>
          <p style={{ color: "hsl(140, 15%, 70%)" }}>
            {isSignUp ? "Create your owner account" : "Shop Owner Login"}
          </p>
        </div>

        <div className="rounded-2xl border border-border/20 bg-card/10 backdrop-blur-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label className="text-white">Full Name</Label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-white">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                required
              />
            </div>
            {isSignUp && (
              <div className="space-y-2">
                <Label className="text-white">Confirm Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={submitting}>
              {isSignUp ? <><UserPlus className="h-4 w-4 mr-2" /> Create Account</> : <><LogIn className="h-4 w-4 mr-2" /> Sign In</>}
            </Button>
          </form>

          <div className="text-center mt-4">
            <Button
              variant="link"
              className="text-sm"
              style={{ color: "hsl(140, 15%, 70%)" }}
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </Button>
          </div>

          <div className="text-center mt-2">
            <Button
              variant="link"
              className="text-sm"
              style={{ color: "hsl(140, 15%, 50%)" }}
              onClick={() => navigate("/")}
            >
              ← Back to home
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
