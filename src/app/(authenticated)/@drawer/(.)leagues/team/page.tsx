"use client";
interface DrawerProps {
  readonly params: { id: string };
  readonly searchParams: { search?: string; teams?: string };
}

export default async function Drawer({ params: { id }, searchParams: { search: _search, teams } }: DrawerProps) {
  return <div>Test</div>;
}
