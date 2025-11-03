# EasyEnglish Design System

A comprehensive design system built with TailwindCSS, shadcn/ui, and Framer Motion, featuring purple/blue gradients, glassmorphism effects, and smooth animations.

## 🎨 Color Palette

### Brand Colors

- **Primary**: Purple gradient (`hsl(262, 83%, 58%)` in light, `hsl(263, 70%, 50%)` in dark)
- **Accent**: Blue (`hsl(217, 91%, 60%)` in light, `hsl(216, 87%, 53%)` in dark)
- **Secondary**: Neutral grays for backgrounds and UI elements

### Usage

```tsx
// Use CSS classes
<div className="bg-primary text-primary-foreground">Primary</div>
<div className="bg-accent text-accent-foreground">Accent</div>

// Gradient text
<span className="gradient-text">EasyEnglish</span>
```

## 🎭 Typography

### Font Family

- **Sans**: Geist Sans (variable weight 100-900)
- **Mono**: Geist Mono (variable weight 100-900)

### Headings

Responsive typography scales with `md:` and `lg:` breakpoints:

- `<h1>`: 4xl → 5xl → 6xl
- `<h2>`: 3xl → 4xl → 5xl
- `<h3>`: 2xl → 3xl → 4xl
- `<h4>`: xl → 2xl → 3xl
- `<h5>`: lg → xl → 2xl
- `<h6>`: base → lg → xl

## 🪟 Glassmorphism

### Glass Effects

```tsx
// Basic glass effect
<Card className="glass">...</Card>

// Glass with hover effect
<Card className="glass-hover">...</Card>
```

The glassmorphism utilities provide:

- Semi-transparent backgrounds (`bg-card/40`)
- Backdrop blur (`backdrop-blur-md`)
- Subtle borders (`border-border/50`)

## 🎬 Animation

### CSS Animations

Available via Tailwind classes:

- `animate-fade-in`: Fade in effect
- `animate-fade-out`: Fade out effect
- `animate-slide-in-up`: Slide from bottom
- `animate-slide-in-down`: Slide from top
- `animate-scale-in`: Scale from 95% to 100%

### Animation Delays

```tsx
<div className="animate-fade-in animation-delay-150">...</div>
<div className="animate-fade-in animation-delay-300">...</div>
<div className="animate-fade-in animation-delay-500">...</div>
```

### Framer Motion Utilities

#### MotionCard

Animates on mount with fade and slide-up:

```tsx
import { MotionCard } from "@/lib/motion";

<MotionCard delay={0.1}>
  <Card>...</Card>
</MotionCard>;
```

#### FadeInOnScroll

Animates when element scrolls into view:

```tsx
import { FadeInOnScroll } from "@/lib/motion";

<FadeInOnScroll direction="up" delay={0.2} once>
  <div>Content</div>
</FadeInOnScroll>;
```

**Props:**

- `direction`: "up" | "down" | "left" | "right" | "none"
- `delay`: number (in seconds)
- `once`: boolean (animate only once)

#### StaggerContainer

Staggers animation of child elements:

```tsx
import { StaggerContainer, staggerItemVariants } from "@/lib/motion";
import { m } from "framer-motion";

<StaggerContainer staggerDelay={0.1}>
  {items.map((item) => (
    <m.div key={item.id} variants={staggerItemVariants}>
      <Card>{item.content}</Card>
    </m.div>
  ))}
</StaggerContainer>;
```

## 🧩 Components

### Layout Components

#### AppShell

Main application wrapper with header and footer:

```tsx
import { AppShell } from "@/components/layout";

<AppShell showHeader showFooter>
  {children}
</AppShell>;
```

#### MainContent

Content container with responsive padding:

```tsx
import { MainContent } from "@/components/layout";

<MainContent>{content}</MainContent>;
```

#### Header

Sticky header with glassmorphic background:

```tsx
import { Header } from "@/components/layout";

<Header />;
```

#### Footer

Footer with links and info:

```tsx
import { Footer } from "@/components/layout";

<Footer />;
```

### UI Components (shadcn/ui)

All components from shadcn/ui are available in `@/components/ui`:

- **Button**: `<Button variant="default|secondary|outline|ghost|destructive|link" size="sm|default|lg|icon">`
- **Card**: `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardDescription>`, `<CardContent>`, `<CardFooter>`
- **Input**: `<Input type="text|email|password|number|..." />`
- **Dialog**: Modal dialogs with glassmorphic styling
- **Tabs**: Tabbed interfaces
- **Accordion**: Collapsible content sections
- **Tooltip**: Hover tooltips
- **Skeleton**: Loading placeholders
- **Badge**: Labels and tags
- **Alert**: Notification messages

### Example Usage

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

<Card className="glass">
  <CardHeader>
    <CardTitle>Welcome</CardTitle>
  </CardHeader>
  <CardContent>
    <Button>Get Started</Button>
  </CardContent>
</Card>;
```

## 🎯 Focus States

Use the `focus-ring` utility for consistent focus styling:

```tsx
<button className="focus-ring">Accessible Button</button>
```

## 🌈 Background Gradients

The default body background includes radial gradients using brand colors:

- Top gradient: Primary color with 15% opacity
- Bottom gradient: Accent color with 15% opacity

## 📱 Responsive Design

All components are mobile-first and responsive:

- `sm:`: 640px
- `md:`: 768px
- `lg:`: 1024px
- `xl:`: 1280px
- `2xl:`: 1536px

## 🔍 Preview

Visit `/ui-kit` to see all components in action with live examples and documentation.

## 🎨 Customization

### Tailwind Config

Edit `tailwind.config.ts` to customize:

- Colors (extend `theme.colors`)
- Animations (extend `theme.animation` and `theme.keyframes`)
- Typography (extend `theme.fontSize`)

### CSS Variables

Edit `app/globals.css` to customize color tokens:

```css
:root {
  --primary: 262 83% 58%;
  --accent: 217 91% 60%;
  /* ... */
}
```

## 🌙 Dark Mode

Dark mode is enabled by default using `next-themes`. The theme automatically switches based on system preferences but defaults to dark.

Toggle theme programmatically:

```tsx
import { useTheme } from "next-themes";

const { theme, setTheme } = useTheme();
setTheme("dark"); // or "light"
```

## ♿ Accessibility

All components follow accessibility best practices:

- Semantic HTML
- ARIA attributes
- Keyboard navigation
- Focus indicators
- Screen reader support

## 📚 Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Framer Motion Documentation](https://www.framer.com/motion)
- [Next.js Documentation](https://nextjs.org/docs)
