import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";
import { AlertTriangle, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const InventoryPage = () => {
  const products = useStore((s) => s.products);
  const agencies = useStore((s) => s.agencies);

  const lowStock = products.filter((p) => p.stock <= p.minStock);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Inventory</h1>
        <p className="text-muted-foreground text-sm">Monitor stock levels and low-stock alerts</p>
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h2 className="font-display font-bold text-destructive">Low Stock Alerts ({lowStock.length})</h2>
          </div>
          <div className="space-y-2">
            {lowStock.map((p) => {
              const supplier = agencies.find((a) => p.agencyIds.includes(a.id));
              return (
                <div key={p.id} className="flex items-center gap-3 bg-card rounded-lg p-3 border border-border">
                  <span className="text-2xl">{p.image}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{p.name}</p>
                    <p className="text-xs text-destructive">Current: {p.stock} | Minimum: {p.minStock}</p>
                  </div>
                  {supplier && (
                    <div className="text-right">
                      <p className="text-xs font-medium">Recommended Supplier:</p>
                      <p className="text-xs text-primary">{supplier.name}</p>
                      <p className="text-xs text-muted-foreground">{supplier.phone}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Full inventory table */}
      <div className="rounded-xl bg-card shadow-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr><th className="text-left p-3">ID</th><th className="text-left p-3">Product</th><th className="text-left p-3">Category</th><th className="text-right p-3">Price</th><th className="text-right p-3">Stock</th><th className="text-right p-3">Min Stock</th><th className="text-left p-3">Status</th></tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-t border-border/50 hover:bg-secondary/30">
                  <td className="p-3 text-muted-foreground">{p.id}</td>
                  <td className="p-3"><span className="mr-2">{p.image}</span>{p.name}</td>
                  <td className="p-3 text-muted-foreground">{p.category}</td>
                  <td className="p-3 text-right">₹{p.price}</td>
                  <td className="p-3 text-right font-medium">{p.stock}</td>
                  <td className="p-3 text-right text-muted-foreground">{p.minStock}</td>
                  <td className="p-3">
                    {p.stock <= p.minStock ? (
                      <Badge variant="destructive" className="text-xs">Low Stock</Badge>
                    ) : p.stock <= p.minStock * 2 ? (
                      <Badge variant="secondary" className="text-xs bg-warning/20 text-warning-foreground">Warning</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs bg-success/20 text-success">In Stock</Badge>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
