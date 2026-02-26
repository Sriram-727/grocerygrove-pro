import { motion } from "framer-motion";
import { Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

const PurchaseHistoryPage = () => {
  const { user } = useAuth();

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["invoices", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Purchase History</h1>
        <p className="text-muted-foreground text-sm">All customer invoices and transactions</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : invoices.length === 0 ? (
        <div className="rounded-xl bg-card shadow-card border border-border p-12 text-center">
          <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No purchases yet. Invoices will appear here after customer checkouts.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((inv, i) => {
            const items = (inv.items as any as InvoiceItem[]) || [];
            return (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl bg-card shadow-card border border-border p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Receipt className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-display font-bold">{inv.invoice_number}</p>
                      <p className="text-xs text-muted-foreground">{new Date(inv.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <Badge className="text-sm">₹{inv.total}</Badge>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="text-left py-2">Item</th>
                        <th className="text-center py-2">Qty</th>
                        <th className="text-right py-2">Price</th>
                        <th className="text-right py-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, j) => (
                        <tr key={j} className="border-b border-border/50">
                          <td className="py-2">{item.name}</td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-right">₹{item.price}</td>
                          <td className="text-right font-medium">₹{item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end gap-6 mt-3 text-sm">
                  <span className="text-muted-foreground">Subtotal: ₹{inv.subtotal}</span>
                  <span className="text-muted-foreground">GST: ₹{inv.gst}</span>
                  <span className="font-bold text-primary">Total: ₹{inv.total}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PurchaseHistoryPage;
