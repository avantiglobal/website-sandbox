/**
 * Tier 1 primitives barrel (spec 0.3). Mechanics, zero visual identity.
 * Pages/blocks import primitives from here.
 */
export { Container } from "./container";
export type { ContainerProps } from "./container";
export { Section } from "./section";
export type { SectionProps } from "./section";
export { Grid } from "./grid";
export type { GridProps } from "./grid";
export { Image } from "./image";
export type { ImageProps } from "./image";
export { RichText } from "./rich-text";
export type { RichTextProps } from "./rich-text";
export { Button, Link, controlClasses } from "./button";
export type {
  ButtonProps,
  LinkProps,
  ButtonVariant,
  ControlSize,
} from "./button";

export * from "./form";
