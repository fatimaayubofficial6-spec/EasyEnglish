# EasyEnglish Design System - Quick Reference

## 🎨 Common Patterns

### Basic Page Layout

```tsx
import { AppShell, MainContent } from "@/components/layout";

export default function MyPage() {
  return (
    <AppShell>
      <MainContent>
        <h1>Page Title</h1>
        {/* Your content */}
      </MainContent>
    </AppShell>
  );
}
```

### Glassmorphic Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

<Card className="glass-hover">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>;
```

### Animated Section

```tsx
import { FadeInOnScroll } from "@/lib/motion";

<FadeInOnScroll direction="up" delay={0.2}>
  <div>{/* Your content */}</div>
</FadeInOnScroll>;
```

### Staggered Grid

```tsx
import { StaggerContainer, staggerItemVariants } from "@/lib/motion";
import { m } from "framer-motion";

<StaggerContainer className="grid gap-4 md:grid-cols-3">
  {items.map((item) => (
    <m.div key={item.id} variants={staggerItemVariants}>
      <Card>{item.content}</Card>
    </m.div>
  ))}
</StaggerContainer>;
```

### Gradient Text

```tsx
<h1>
  Welcome to <span className="gradient-text">EasyEnglish</span>
</h1>
```

### Form with Validation

```tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

<Card className="glass">
  <CardHeader>
    <CardTitle>Sign Up</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="space-y-2">
      <label htmlFor="email" className="text-sm font-medium">
        Email
      </label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
    <Button className="w-full">Submit</Button>
  </CardContent>
</Card>;
```

### Modal Dialog

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent className="glass">
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <div>{/* Dialog content */}</div>
  </DialogContent>
</Dialog>;
```

### Alert Messages

```tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong!</AlertDescription>
</Alert>;
```

### Loading State

```tsx
import { Skeleton } from "@/components/ui/skeleton";

<Card className="glass">
  <CardHeader>
    <Skeleton className="h-6 w-[200px]" />
    <Skeleton className="h-4 w-[300px]" />
  </CardHeader>
  <CardContent>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
  </CardContent>
</Card>;
```

### Tabs

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>;
```

### Badge

```tsx
import { Badge } from "@/components/ui/badge";

<Badge>New</Badge>
<Badge variant="secondary">Beta</Badge>
<Badge variant="outline">Coming Soon</Badge>
<Badge variant="destructive">Deprecated</Badge>
```

## 🎯 Utility Classes

| Class             | Purpose                     |
| ----------------- | --------------------------- |
| `.glass`          | Glassmorphic background     |
| `.glass-hover`    | Glass with hover effect     |
| `.gradient-text`  | Brand gradient on text      |
| `.focus-ring`     | Consistent focus indicator  |
| `.text-balance`   | Balanced text wrapping      |
| `.animation-*`    | CSS animations (see below)  |
| `.container`      | Responsive centered content |
| `max-w-*`         | Max width constraints       |
| `space-y-*`       | Vertical spacing            |
| `gap-*`           | Grid/flex gap               |
| `grid-cols-*`     | Grid columns                |
| `md:`, `lg:`, ... | Responsive breakpoints      |

## 🎬 Animations

| Class                 | Effect            |
| --------------------- | ----------------- |
| `animate-fade-in`     | Fade in           |
| `animate-slide-in-up` | Slide from bottom |
| `animate-scale-in`    | Scale from 95%    |
| `animation-delay-150` | 150ms delay       |
| `animation-delay-300` | 300ms delay       |
| `animation-delay-500` | 500ms delay       |

## 🎨 Color Tokens

| Token         | Usage                        |
| ------------- | ---------------------------- |
| `primary`     | Main brand color (purple)    |
| `accent`      | Secondary brand color (blue) |
| `secondary`   | UI elements                  |
| `muted`       | Subdued backgrounds          |
| `destructive` | Errors and warnings          |
| `border`      | Borders                      |
| `background`  | Page background              |
| `foreground`  | Text color                   |

Use with prefixes: `bg-`, `text-`, `border-`, `ring-`

Example: `bg-primary`, `text-accent`, `border-muted`

## 📦 Button Variants

```tsx
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Destructive</Button>

<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>
```

## 📱 Responsive Breakpoints

| Breakpoint | Min Width | Usage         |
| ---------- | --------- | ------------- |
| `sm:`      | 640px     | Mobile        |
| `md:`      | 768px     | Tablet        |
| `lg:`      | 1024px    | Desktop       |
| `xl:`      | 1280px    | Large Desktop |
| `2xl:`     | 1536px    | Extra Large   |

## 🔗 Useful Links

- Full Docs: `DESIGN_SYSTEM.md`
- Implementation: `DESIGN_SYSTEM_IMPLEMENTATION.md`
- Live Examples: [http://localhost:3000/ui-kit](http://localhost:3000/ui-kit)
- shadcn/ui: [https://ui.shadcn.com](https://ui.shadcn.com)
- Tailwind: [https://tailwindcss.com](https://tailwindcss.com)
