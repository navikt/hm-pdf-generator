import { http, HttpResponse } from "msw";

export const handlers = [
  http.get<{ sakId: string; brevtype: string }>(
    "/api/sak/:sakId/brevutkast/:brevtype",
    ({ params }) => {
      let key = `${params.sakId}-${params.brevtype}`;
      let data = localStorage.getItem(key)
        ? JSON.parse(localStorage.getItem(key) || "{}")
        : null;
      return !!data
        ? HttpResponse.json({
            data,
            brevtype: params.brevtype,
            opprettet: "2025-10-28T13:35:00",
          })
        : HttpResponse.json({
            sakId: params.sakId,
            brevtype: params.brevtype,
            data: {},
            opprettet: "2025-10-28T13:35:00",
            opprettetAv: "Ola Nordmann",
            oppdatert: "2025-10-28T13:35:00",
            oppdatertAv: "Ola Nordmann",
          });
    },
  ),

  http.post<
    { sakId: string },
    {
      brevtype: string;
      målform: string;
      data: any;
    }
  >("/api/sak/:sakId/brevutkast", async ({ params, request }) => {
    let json = await request.json();
    localStorage.setItem(
      `${params.sakId}-${json.brevtype}`,
      JSON.stringify(json.data),
    );
    return new HttpResponse(null, { status: 204 });
  }),

  http.delete<{ sakId: string; brevtype: string }>(
    "/api/sak/:sakId/brevutkast/:brevtype",
    ({ params }) => {
      localStorage.removeItem(`${params.sakId}-${params.brevtype}`);
      return new HttpResponse(null, { status: 204 });
    },
  ),

  http.post<
    { sakId: string },
    {
      brevtype: string;
      målform: string;
      data: any;
    }
  >("/api/sak/:sakId/brevsending", async () => {
    // TODO
    return new HttpResponse(null, { status: 201 });
  }),
];
