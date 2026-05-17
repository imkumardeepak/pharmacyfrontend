// path: frontend/src/components/layout/PlaceholderPage.tsx
interface Props {
  title: string;
  hint: string;
}

export function PlaceholderPage({ title, hint }: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
      <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      <p className="max-w-md text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}
