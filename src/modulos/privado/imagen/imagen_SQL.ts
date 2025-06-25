export const SQL_IMAGEN = {
  cambiar_favo: `
    UPDATE imagenes 
    SET favorito_imagen = 1 
    WHERE cod_hamburguesa = $1 
      AND cod_imagen = (
        SELECT cod_imagen 
        FROM imagenes 
        WHERE cod_hamburguesa = $1 
        ORDER BY cod_imagen DESC 
        LIMIT 1
      )
  `,
};
