import React from 'react';
import {Card} from "primereact/card";
import BuscadorErroresSigte
    from "@/components/maestros/errores-sigte-components/buscador-errores-sigte/buscador-errores-sigte";
import TablaErroresSigte from "@/components/maestros/errores-sigte-components/tabla-errores-sigte/tabla-errores-sigte";

const MainErroresSigte = () => {
   return(
           <>
               <Card title="Configuración Errores SIGTE">
                   {/*<BuscadorErroresSigte/>*/}
                   <TablaErroresSigte/>
               </Card>
           </>
       );

};

export default MainErroresSigte;
