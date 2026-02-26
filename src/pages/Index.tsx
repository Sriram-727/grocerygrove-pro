import { motion } from "framer-motion";
import { ShoppingCart, Shield, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Store className="h-10 w-10 text-primary" style={{ color: "hsl(152, 55%, 45%)" }} />
            <h1 className="text-5xl font-bold font-display" style={{ color: "hsl(0, 0%, 100%)" }}>
              UGMS
            </h1>
          </div>
          <p className="text-lg" style={{ color: "hsl(140, 15%, 70%)" }}>
            Unified Grocery Management System
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => navigate("/shop")}
            className="group cursor-pointer rounded-2xl p-8 border border-border/20 bg-card/10 backdrop-blur-sm hover:bg-card/20 transition-all duration-300"
          >
            <div className="gradient-primary w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShoppingCart className="h-8 w-8" style={{ color: "hsl(0, 0%, 100%)" }} />
            </div>
            <h2 className="text-2xl font-display font-bold mb-2" style={{ color: "hsl(0, 0%, 100%)" }}>
              Customer
            </h2>
            <p style={{ color: "hsl(140, 15%, 65%)" }}>
              Browse products, add to cart, and checkout — no login required.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onClick={() => navigate(user ? "/admin" : "/login")}
            className="group cursor-pointer rounded-2xl p-8 border border-border/20 bg-card/10 backdrop-blur-sm hover:bg-card/20 transition-all duration-300"
          >
            <div className="gradient-accent w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="h-8 w-8" style={{ color: "hsl(0, 0%, 100%)" }} />
            </div>
            <h2 className="text-2xl font-display font-bold mb-2" style={{ color: "hsl(0, 0%, 100%)" }}>
              Shop Owner
            </h2>
            <p style={{ color: "hsl(140, 15%, 65%)" }}>
              Manage workers, inventory, suppliers, and view reports.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
