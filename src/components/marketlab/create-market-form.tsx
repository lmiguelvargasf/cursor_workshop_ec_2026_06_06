import { ImagePlus, Plus } from "lucide-react";

import { createMarketAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

export function CreateMarketForm({ enabled }: { enabled: boolean }) {
  return (
    <form
      action={createMarketAction}
      className="rounded-lg border border-zinc-200 bg-white p-5"
    >
      <input name="returnTo" type="hidden" value="/" />
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Create market
          </h2>
          <p className="mt-1 text-sm leading-6 text-zinc-500">
            Authenticated users can create fictional markets with a storage
            image.
          </p>
        </div>
        <Plus className="size-5 text-zinc-400" />
      </div>

      <div className="grid gap-4">
        <Field label="Question" name="title" placeholder="Will..." required />
        <label className="grid gap-1 text-sm font-medium">
          Description
          <textarea
            className="min-h-24 rounded-md border border-zinc-200 px-3 py-2 text-sm font-normal outline-none focus:border-zinc-950"
            name="description"
            placeholder="Define exactly how this resolves."
            required
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Category"
            name="category"
            placeholder="Workshop"
            required
          />
          <Field
            label="Close date"
            name="closeAt"
            required
            type="datetime-local"
          />
        </div>
        <label className="grid gap-2 text-sm font-medium">
          <span className="inline-flex items-center gap-2">
            <ImagePlus className="size-4" />
            Market image
          </span>
          <input
            accept="image/png,image/jpeg,image/webp"
            className="text-sm text-zinc-600 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-950 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white"
            name="image"
            type="file"
          />
        </label>
      </div>

      <Button className="mt-5 w-full" disabled={!enabled} size="lg">
        Create market
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-1 text-sm font-medium">
      {label}
      <input
        className="h-10 rounded-md border border-zinc-200 px-3 text-sm font-normal outline-none focus:border-zinc-950"
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </label>
  );
}
