declare module "blade-formatter";

type BladeFormatterConfig = {
  indentSize?: number;
  useTabs?: boolean;
  wrapAttributes?:
    | "auto"
    | "force"
    | "force-aligned"
    | "force-expand-multiline"
    | "aligned-multiple"
    | "preserve"
    | "preserve-aligned";
  wrapLineLength?: number;
  endWithNewline?: boolean;
  sortTailwindcssClasses?: boolean;
  sortHtmlAttributes?:
    | "none"
    | "alphabetical"
    | "code-guide"
    | "idiomatic"
    | "vuejs";
  noMultipleEmptyLines?: boolean;
};
