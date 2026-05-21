import "styled-components";
import type { ChambitTheme } from "./theme";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: ChambitTheme["colors"];
    shadow: ChambitTheme["shadow"];
  }
}
