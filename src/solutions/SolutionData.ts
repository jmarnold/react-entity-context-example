import { SolutionViewModel } from "./SolutionTypes";

export async function getSolution(id: string): Promise<SolutionViewModel> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        title: "Test Solution",
      });
    }, 500);
  });
}
