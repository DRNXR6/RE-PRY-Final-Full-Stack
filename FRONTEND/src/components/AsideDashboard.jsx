import PerfilAdmin from '../components/PerfilAdmin'
import Publicaciones from '../components/Publicaciones'
import UserRegi from '../components/UserRegi'
import Alerts from '../components/Alerts'

import "../styles/AsideDashboard.css";

import { useState, useEffect } from "react";
import usuariosServices from '../services/usuariosServices';

    const opciones = [
        { nombre: "Perfil", esPerfil: true, componente: <PerfilAdmin /> },
        { nombre: "Publicaciones", esPerfil: false, componente: <Publicaciones /> },
        { nombre: "Usuarios registrados", esPerfil: false, componente: <UserRegi /> },
        { nombre: "Alertas", esPerfil: false, componente: <Alerts /> }

    ];

    let IMgUser = "https://res.cloudinary.com/dw65xvmgp/image/upload/v1749743238/FB_chiuol.avif"


const Menu = () => {
    const [activo, setActivo] = useState(0); // Estado para la opción seleccionada

    const [Usuarios, setUsuarios] = useState([])

        useEffect(() => {
        let isMounted = true;

        const fetch = async () => {
            const DatosUsuarios = await usuariosServices.GetUsuario();

            if (isMounted) {
                setUsuarios(DatosUsuarios);
            }
            };

        fetch();

        return () => {
            isMounted = false;
        };
      
    }, []);


    Usuarios.find((user) => {
        if(user.referenciaIMG_oferente != "") {
            IMgUser = user.referenciaIMG_oferente
        }
    })

    return (
        <div className='ContDashboard'>
            <div className="asideDashboard">
                <h3>Adminstración</h3>
                {opciones.map((opcion, index) => (
                    <div key={index} className={`contenedor ${activo === index ? "activo" : ""}`} onClick={() => setActivo(index)}> 
                        {opcion.esPerfil ? (
                            <div className="perfilDashboard">
                                <img src={IMgUser} alt="Perfil" />
                            </div>
                        ) : (
                            opcion.nombre
                        )}
                    </div>
                ))}
            </div>

            <div className="contenido">
                {opciones[activo].componente} {/* Renderiza el componente correspondiente */}
            </div>
            
        </div>
    );
};

export default Menu;
