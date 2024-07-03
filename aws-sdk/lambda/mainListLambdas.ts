import { listLambdas } from "./listLambdas";

async function mainListLambdas(profile: string = "default"): Promise<void> {
  console.log(`Starting to list Lambdas with profile: ${profile}`);
  const result = await listLambdas(profile);
  console.log("Result from listLambdas:", result);
}

// Usage example
mainListLambdas("default").catch(console.error);
