import type { InternalApi } from "nitropack";

export type AlbumViewSuccessData = Extract<
  InternalApi["/api/album/:slug"]["get"],
  { success: true }
>;
