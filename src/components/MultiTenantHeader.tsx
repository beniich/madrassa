import React from 'react';

export function MultiTenantHeader() {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-background">
      <div>
        <h2 className="text-lg font-semibold">Multi-Tenant Header</h2>
        <p className="text-sm text-muted-foreground">Sélectionnez une organisation</p>
      </div>
    </div>
  );
}
