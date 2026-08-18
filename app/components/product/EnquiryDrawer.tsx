import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function EnquiryDrawer({
  open,
  onClose,
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 z-50 h-screen w-full max-w-md bg-white p-8 shadow-2xl">

        <h2 className="mb-8 text-3xl font-bold">
          Enquire Now
        </h2>

        <div className="space-y-5">

          <input
            placeholder="Your Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full rounded-xl border p-4"
          />

          <input
            placeholder="Phone Number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            className="w-full rounded-xl border p-4"
          />

          <button
            className="w-full rounded-xl bg-[var(--burgundy)] py-4 text-white"
          >
            Continue
          </button>

        </div>

      </div>
    </>
  );
}