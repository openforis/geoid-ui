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
import { fetchDeployedBaseUrl } from "@/lib/env.actions";
import { loadEnv, saveEnv } from "@/lib/env.client";

const labelClass = "text-[11px] font-medium uppercase tracking-wider text-text-muted";

type EnvSettingsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EnvSettingsModal({ open, onOpenChange }: EnvSettingsModalProps) {
  const [deployedBaseUrl, setDeployedBaseUrl] = useState<string | undefined>();
  const [baseUrl, setBaseUrl] = useState("");
  const [adminToken, setAdminToken] = useState("");

  useEffect(() => {
    if (!open) return;

    const override = loadEnv().baseUrl;
    setAdminToken("");
    setBaseUrl(override ?? "");

    let cancelled = false;
    void fetchDeployedBaseUrl().then((result) => {
      if (cancelled || !result.ok) return;
      setDeployedBaseUrl(result.data);
      if (!override) setBaseUrl(result.data ?? "");
    });

    return () => {
      cancelled = true;
    };
  }, [open]);

  const apply = (next: { baseUrl: string; adminToken?: string; clearToken?: boolean }) => {
    const trimmedBaseUrl = next.baseUrl.trim();
    const trimmedAdminToken = next.adminToken?.trim();
    const existing = loadEnv();
    saveEnv({
      baseUrl:
        trimmedBaseUrl && trimmedBaseUrl !== deployedBaseUrl ? trimmedBaseUrl : undefined,
      adminToken: next.clearToken
        ? undefined
        : trimmedAdminToken
          ? trimmedAdminToken
          : existing.adminToken,
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
              placeholder={deployedBaseUrl}
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
          <Button
            type="button"
            variant="outline"
            onClick={() => apply({ baseUrl: deployedBaseUrl ?? "", clearToken: true })}
          >
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
