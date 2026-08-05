import Container from "../../components/ui/Container";
import { useState } from "react";
import AddProductModal from "../../components/admin/AddProductModal";

export default function AdminProductsPage() {
  const [open, setOpen] = useState(false);
  return (
    <Container>
      <section className="py-16">
        <h1 className="text-4xl font-bold">
          Product Management
        </h1>

        <p className="mt-3 text-[var(--muted)]">
          Add, edit and manage products.
        </p>

        <button
          onClick={() => setOpen(true)}
          className="mt-8 rounded-xl bg-[var(--teal)] px-6 py-3 font-semibold text-white">
          + Add Product
        </button>
      </section>
      <AddProductModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </Container>
  );
}