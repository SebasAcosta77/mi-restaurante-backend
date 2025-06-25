import { sign } from "jsonwebtoken";

class GenerarToken{

    public static procesarRespuesta(datosSesion: any): string{
        let token: string = "";
        token =  sign({
            id:datosSesion.cod_usuario,
            nombre: datosSesion.nombre_usuario,
            rol: datosSesion.nombre_rol,
            telefono: datosSesion.telefono_usuario,
            acceso: datosSesion.nombre_acceso
        }, "laClaveSuperSecreta", { expiresIn: "8h"});
        return token;
    }

}
export default GenerarToken;