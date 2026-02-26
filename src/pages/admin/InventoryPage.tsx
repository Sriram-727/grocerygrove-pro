import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Plus, PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const InventoryPage = () => {
  const queryClient = useQueryClient();

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;
      return data;
    },
  });

  const lowStock = products.filter((p) => p.stock <= p.min_stock);

  // Add product dialog state
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newMinStock, setNewMinStock] = useState("");
  const [newImage, setNewImage] = useState("📦");
  const [newUnit, setNewUnit] = useState("pcs");

  // Restock dialog state
  const [restockOpen, setRestockOpen] = useState(false);
  const [restockId, setRestockId] = useState("");
  const [restockQty, setRestockQty] = useState("");

  const addProductMutation = useMutation({
    mutationFn: async (product: { name: string; category: string; price: number; stock: number; min_stock: number; image_url: string; unit: string }) => {
      const { error } = await supabase.from("products").insert(product);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const restockMutation = useMutation({
    mutationFn: async ({ id, newStock }: { id: string; newStock: number }) => {
      const { error } = await supabase.from("products").update({ stock: newStock }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const resetAddForm = () => {
    setNewName(""); setNewCategory(""); setNewPrice(""); setNewStock("");
    setNewMinStock(""); setNewImage("📦"); setNewUnit("pcs");
  };

  const handleAddProduct = async () => {
    if (!newName || !newPrice || !newStock) {
      toast.error("Please fill name, price and stock");
      return;
    }
    try {
      await addProductMutation.mutateAsync({
        name: newName,
        category: newCategory || "General",
        price: Number(newPrice),
        stock: Number(newStock),
        min_stock: Number(newMinStock) || 5,
        image_url: newImage,
        unit: newUnit,
      });
      toast.success(`Product "${newName}" added!`);
      resetAddForm();
      setAddOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to add product");
    }
  };

  const handleRestock = async () => {
    if (!restockId || !restockQty || Number(restockQty) <= 0) {
      toast.error("Enter a valid quantity");
      return;
    }
    const product = products.find((p) => p.id === restockId);
    if (!product) return;
    try {
      await restockMutation.mutateAsync({ id: restockId, newStock: product.stock + Number(restockQty) });
      toast.success("Stock updated!");
      setRestockOpen(false);
      setRestockQty("");
      setRestockId("");
    } catch (err: any) {
      toast.error(err.message || "Failed to restock");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Inventory</h1>
          <p className="text-muted-foreground text-sm">Monitor stock levels and manage products</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setAddOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> Add Product</Button>
          <Button variant="outline" onClick={() => setRestockOpen(true)} className="gap-2"><PackagePlus className="h-4 w-4" /> Restock</Button>
        </div>
      </div>

      {lowStock.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h2 className="font-display font-bold text-destructive">Low Stock Alerts ({lowStock.length})</h2>
          </div>
          <div className="space-y-2">
            {lowStock.map((p) => (
              <div key={p.id} className="flex items-center gap-3 bg-card rounded-lg p-3 border border-border">
                <span className="text-2xl">{p.image_url || "📦"}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{p.name}</p>
                  <p className="text-xs text-destructive">Current: {p.stock} | Minimum: {p.min_stock}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => { setRestockId(p.id); setRestockOpen(true); }}>Restock</Button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="rounded-xl bg-card shadow-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left p-3">Product</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Unit</th>
                <th className="text-right p-3">Price</th>
                <th className="text-right p-3">Stock</th>
                <th className="text-right p-3">Min Stock</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-t border-border/50 hover:bg-secondary/30">
                  <td className="p-3"><span className="mr-2">{p.image_url || "📦"}</span>{p.name}</td>
                  <td className="p-3 text-muted-foreground">{p.category}</td>
                  <td className="p-3 text-muted-foreground">{p.unit}</td>
                  <td className="p-3 text-right">₹{p.price}</td>
                  <td className="p-3 text-right font-medium">{p.stock}</td>
                  <td className="p-3 text-right text-muted-foreground">{p.min_stock}</td>
                  <td className="p-3">
                    {p.stock <= p.min_stock ? (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-destructive/10 text-destructive">Low Stock</span>
                    ) : p.stock <= p.min_stock * 2 ? (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-accent text-accent-foreground">Warning</span>
                    ) : (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary">In Stock</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => { setRestockId(p.id); setRestockOpen(true); }}>Restock</Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Fill in the product details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Product Name *</Label><Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Basmati Rice" /></div>
              <div className="space-y-1"><Label>Category</Label><Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="e.g. Grains" /></div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="space-y-1"><Label>Price (₹) *</Label><Input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="0" /></div>
              <div className="space-y-1"><Label>Stock *</Label><Input type="number" value={newStock} onChange={(e) => setNewStock(e.target.value)} placeholder="0" /></div>
              <div className="space-y-1"><Label>Min Stock</Label><Input type="number" value={newMinStock} onChange={(e) => setNewMinStock(e.target.value)} placeholder="5" /></div>
              <div className="space-y-1"><Label>Unit</Label><Input value={newUnit} onChange={(e) => setNewUnit(e.target.value)} placeholder="pcs" /></div>
            </div>
            <div className="space-y-1"><Label>Emoji Icon</Label><Input value={newImage} onChange={(e) => setNewImage(e.target.value)} placeholder="📦" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { resetAddForm(); setAddOpen(false); }}>Cancel</Button>
            <Button onClick={handleAddProduct} disabled={addProductMutation.isPending}>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restock Dialog */}
      <Dialog open={restockOpen} onOpenChange={setRestockOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restock Product</DialogTitle>
            <DialogDescription>Select a product and enter the quantity to add.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Product</Label>
              <Select value={restockId} onValueChange={setRestockId}>
                <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent>
                  {products.map((p) => (<SelectItem key={p.id} value={p.id}>{p.image_url || "📦"} {p.name} (Current: {p.stock})</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label>Quantity to Add</Label><Input type="number" value={restockQty} onChange={(e) => setRestockQty(e.target.value)} placeholder="Enter quantity" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRestockOpen(false)}>Cancel</Button>
            <Button onClick={handleRestock} disabled={restockMutation.isPending}>Restock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryPage;
