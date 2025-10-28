import { http, HttpResponse } from "msw";

export const handlers = [
  http.get<{ sakId: string; brevtype: string }>(
    "/api/sak/:sakId/brevutkast/:brevtype",
    ({ params }) => {
      let data: any = JSON.parse(
        localStorage.getItem(`${params.sakId}-${params.brevtype}`) || "{}",
      );
      return HttpResponse.json({
        data,
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
    return HttpResponse.json({
      data: json.data,
    });
  }),
  http.delete<{ sakId: string; brevtype: string }>(
    "/api/sak/:sakId/brevutkast/:brevtype",
    () => {
      return HttpResponse.json({
        id: "abc-123",
        firstName: "John",
        lastName: "Maverick",
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
  >("/api/sak/:sakId/brevsending", async ({ params, request }) => {
    let json = await request.json();
    let data: any = JSON.parse(
      localStorage.getItem(`${params.sakId}-${json.brevtype}`) || "{}",
    );
    return HttpResponse.json({
      data,
    });
  }),
];
