import type { AuthReponse, Unsuccessfull } from "../types/auth.js";
import type { GalleryErrorResponse, GalleryResponse } from "../types/deviation.js";

function isAuthResponse(auth: AuthReponse | Unsuccessfull): auth is AuthReponse {
    return "res" in auth;
}
function isGalleryResponse(res: GalleryResponse | GalleryErrorResponse): res is GalleryResponse {
    return "results" in res;
}

export { isAuthResponse, isGalleryResponse }