import { AppResponse } from "~/server/api";

// Left here for example purposes.
export async function GET(request: Request) {
  const sports: string[] = [];
  return AppResponse.OK(sports);
}
