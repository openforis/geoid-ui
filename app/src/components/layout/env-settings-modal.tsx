"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { loadEnv, saveEnv } from "@/lib/env.client";

const labelClass = "text-[11px] font-medium uppercase tracking-wider text-text-muted";

type EnvSettingsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EnvSettingsModal({ open, onOpenChange }: EnvSettingsModalProps) {
  const [baseUrl, setBaseUrl] = useState("");
  const [adminToken, setAdminToken] = useState("");

  useEffect(() => {
    if (!open) return;
    const settings = loadEnv();
    setBaseUrl(settings.baseUrl ?? "");
    setAdminToken(settings.adminToken ?? "");
  }, [open]);

  const apply = (next: { baseUrl: string; adminToken: string }) => {
    saveEnv({
      baseUrl: next.baseUrl.trim() || undefined,
      adminToken: next.adminToken.trim() || undefined,
    });
    onOpenChange(false);
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Environment settings</DialogTitle>
          <DialogDescription>
            Override server defaults for this session. Leave empty to use deployed values.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <label className="grid gap-1.5">
            <span className={labelClass}>GeoID base URL</span>
            <Input
              type="url"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://data.review.fao.org/geoid"
            />
          </label>
          <label className="grid gap-1.5">
            <span className={labelClass}>Admin token</span>
            <Input
              type="password"
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              placeholder="Optional bearer token"
            />
          </label>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => apply({ baseUrl: "", adminToken: "" })}>
            Reset
          </Button>
          <Button type="button" onClick={() => apply({ baseUrl, adminToken })}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
