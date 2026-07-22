// SVGR: `import Icon from './x.svg'` resolves to a React component (see next.config.ts).
declare module "*.svg" {
  import type { FC, SVGProps } from "react";
  const ReactComponent: FC<SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
