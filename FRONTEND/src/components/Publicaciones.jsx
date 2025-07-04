import React, {useEffect, useState } from 'react';
import {useNavigate } from 'react-router-dom';

import InteresesServices from '../services/interesesServices';
import OfertasServices from '../services/ofertasServices';
import usersServices from '../services/usersServices';


import usuariosServices from '../services/usuariosServices';
import Users_UsuariosServices from '../services/Users_UsuariosServices';
import User_groupsServices from '../services/User_groupsServices';


import cloudDinaryServices from '../services/cloudDinaryServices';
import GetCookie from '../services/GetCookie';
import UserRegi from '../components/UserRegi'
import PostulacionesServices from '../services/PostulacionesServices';

import { CerrarDashboard } from './CerrarDashboard';
import Swal from 'sweetalert2';

import "../styles/Publicaciones.css"





function Publicaciones() {

  const navigate = useNavigate();

  const [IMgUser, setIMgUser] = useState("https://res.cloudinary.com/dateuzds4/image/upload/v1750454292/FB_sby2fv.avif");

  const idUserCookie = GetCookie.getCookie("user_id")
  const Rol = GetCookie.getCookie("role")
  
  const [Intereses, setIntereses] = useState([]);

  const [Ofertas, setOfertas] = useState([]);

  const [Users, setUsers] = useState([]);

  const [ContDetalles, setContDetalles] = useState(false)
  const [EditarInfo, setEditarInfo] = useState(false)

  const [FiltroInput, setFiltroInput] = useState("")

  const [IsActivo, setIsActivo] = useState(true);
  const [IsEmpresa, setIsEmpresa] = useState(false);

  const [EmpresaDeOfertaSeleccionada, setEmpresaDeOfertaSeleccionada] = useState()
  const [IDOferta, setIDOferta] = useState()
  const [EstadoOferta, setEstadoOferta] = useState("")

  const [TituloOferta, setTituloOferta] = useState("")
  const [SalarioOferta, setSalarioOferta] = useState("")
  const [UbicacionOferta, setUbicacionOferta] = useState("")
  const [InteresOfertaNombre, setInteresOfertaNombre] = useState("")
  const [InteresOfertaID, setInteresOfertaID] = useState("")

  const [EmpresaOferta, setEmpresaOferta] = useState("")
  const [VacantesOferta, setVacantesOferta] = useState("")
  const [PuestoOferta, setPuestoOferta] = useState("")
  const [FechaOferta, setFechaOferta] = useState("")
  const [DescripcionOferta, setDescripcionOferta] = useState("")
  const [RImagenOferta, setRImagenOferta] = useState(null)
  

  const [VistaPostulantes, setVistaPostulantes] = useState(false)
  const [UsersPostulados, setUsersPostulados] = useState([])


  const [DatosIntermedios, setDatosIntermedios] = useState([]);

  const [Users2, setUsers2] = useState([]);
  
  const [Usuarios, setUsuarios] = useState([]);
  
  const [DatosGroups, setDatosGroups] = useState([]);
  
  const [FechaPostulacion, setFechaPostulacion] = useState("");
  const [ReferenciaPDF, setReferenciaPDF] = useState("");

  let imgASubir = null;

  const palabrasProhibidas = [
    "admin", "superuser", "password", "puta", "putas", "madre","pendejo", "mierda", "caca", "culo", "verga", "coño",
    "chingar", "pendeja", "puto", "cabrón", "cabron", "gilipollas", "maricón", "bollera", "zorra", "pene",  
    "putón", "pendejita", "pendejito","prostituta", "prostituto", "putas", "putos", "pendejos", "pendejas", 
    "cago", "cagó", "cagada", "cagado", "cagarse", "cagón", "cagones", "cagar", "cagando", "como", "vagina", 
    "putita", "meto", "cojo", "cojer"];


useEffect(() => {
  const fetchData = async () => {

    const userEncontrado = Usuarios.find(
      (user) => user.referenciaIMG_oferente && user.referenciaIMG_oferente !== "null"
    );
    if (userEncontrado) {
      setIMgUser(userEncontrado.referenciaIMG_oferente);
    }

    // Datos intermedios y usuarios relacionados
    const datosIntermedios = await Users_UsuariosServices.GetUserUsuario();
    if (datosIntermedios.length > 0) {
      const userIds = datosIntermedios.map((item) => item.user);
      const usuarioIds = datosIntermedios.map((item) => item.usuario);

      const [datosUsers, datosUsuarios, datosGroups] = await Promise.all([
        usersServices.GetUsersByIds(userIds),
        usuariosServices.GetUsuariosByIds(usuarioIds),
        User_groupsServices.GetUser_group()
      ]);

      if (datosUsers && datosUsuarios && datosGroups) {
        setDatosIntermedios(datosIntermedios);
        setUsers2(datosUsers);
        setUsuarios(datosUsuarios);
        setDatosGroups(datosGroups);
      }
    }

    // Carga de datos generales
    const [DatosIntereses, DatosOfertas, DatosUsers, DatosPostulaciones] = await Promise.all([
      InteresesServices.GetIntereses(),
      OfertasServices.GetOfertas(),
      usersServices.GetUser(),
      PostulacionesServices.GetPostulaciones()
    ]);

    // Estado y rol
    if (EstadoOferta === "desactiva") setIsActivo(false);
    if (Rol === "empresa") setIsEmpresa(true);

    // Procesamiento de oferta seleccionada
    if (DatosIntereses && DatosOfertas && DatosUsers) {
      setIntereses(DatosIntereses);
      setOfertas(DatosOfertas);
      setUsers(DatosUsers);

      const ofertaSeleccionada = DatosOfertas.find((dato) => dato.id === IDOferta);
      if (ofertaSeleccionada) {
        setTituloOferta(ofertaSeleccionada.titulo_oferta);
        setPuestoOferta(ofertaSeleccionada.nombre_puesto_oferta);
        setVacantesOferta(ofertaSeleccionada.vacantes_oferta);
        setUbicacionOferta(ofertaSeleccionada.ubicacion_oferta);
        setFechaOferta(ofertaSeleccionada.fecha_oferta);
        setSalarioOferta(ofertaSeleccionada.salario_oferta);
        setDescripcionOferta(ofertaSeleccionada.descripcion_oferta);
        setRImagenOferta(ofertaSeleccionada.referenciaIMG_oferta);
        setInteresOfertaID(ofertaSeleccionada.intereses);
        setEmpresaDeOfertaSeleccionada(ofertaSeleccionada.empresaUser);

        const interesRelacionado = DatosIntereses.find((i) => i.id === ofertaSeleccionada.intereses);
        if (interesRelacionado) {
          setInteresOfertaNombre(interesRelacionado.nombre_interes);
        }

        const empresaRelacionada = DatosUsers.find((e) => e.id === ofertaSeleccionada.empresaUser);
        if (empresaRelacionada) {
          setEmpresaOferta(empresaRelacionada.first_name);
        }
      }
      
      // Postulaciones relacionadas con la oferta
      const postulantes = DatosPostulaciones.filter((dato) => dato.oferta == IDOferta);
      if (postulantes.length > 0) {
        setUsersPostulados(postulantes);        
      }
      setFechaPostulacion(postulantes[0]?.fecha_postulacion);
      setReferenciaPDF(postulantes[0]?.referenciaPDF);
    }
  };

  fetchData();
}, [EstadoOferta]);

  function VerDetallesOferta(id, estado) {
    setContDetalles(true)
    setIDOferta(id)
    setEstadoOferta(estado)
  }
  
  function exitDashboard() {
    CerrarDashboard(navigate)
  }

  function filtrarOfertas(Ofertas, FiltroInput) {
    if (!FiltroInput || FiltroInput.trim() === "") return Ofertas;

    return Ofertas.filter(oferta => {
      const input = FiltroInput.toLowerCase();

      return (
        oferta.titulo_oferta.toLowerCase().includes(input) ||
        oferta.ubicacion_oferta.toLowerCase().includes(input) ||
        oferta.salario_oferta?.toString().includes(input) ||
        oferta.intereses_nombre?.toLowerCase().includes(input) || 
        console.log(oferta.intereses_nombre)
    
      );
    });
  }

  let Filtrado = filtrarOfertas(Ofertas, FiltroInput);


  function Volver() {
    setContDetalles(false)
  }

  function Volver2() {
    setContDetalles(true)
    setEditarInfo(false)
  }
  
  function Volver3() {
    setVistaPostulantes(false)
    setContDetalles(true)
  }


  function VerPostulantes() {

    setContDetalles(false)
    setVistaPostulantes(true)

  }


  function EditarOferta() {
    setContDetalles(false)
    setEditarInfo(true)

  }

  async function DesactivarOferta() {
  
    Swal.fire({
        icon: "question",
        iconColor: "#2ae2b6",
        text: "¿Deseas desactivar esta oferta?",
        confirmButtonColor: "#9ACD32",
        background: "#1a1a1a",
        color: "#ffffff",
        confirmButtonText: "Sí, desactivar",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
    }).then(async (result) => {

        if (result.isConfirmed) {
            const obj = {
              estado_oferta: "desactiva",
            }

            const PutOferta = await OfertasServices.UpdateOferta(IDOferta, obj)

            if(PutOferta) {
                Swal.fire({
                    icon: "success",
                    iconColor: "#2ae2b6",
                    text: "La oferta ha sido desactivada con exito.",
                    showConfirmButton: false,
                    background: "#1a1a1a",
                    color: "#ffffff",
                    timer: 1500,
                })
                setIsActivo(false)

                setTimeout(() => {
                  location.reload()                  
                }, 1600);
            }
        }
    });

  }

  async function ActivarOferta() { 

    Swal.fire({
        icon: "question",
        iconColor: "#2ae2b6",
        text: "¿Deseas Activar esta oferta?",
        confirmButtonColor: "#9ACD32",
        background: "#1a1a1a",
        color: "#ffffff",
        confirmButtonText: "Sí, Activar",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
    }).then(async (result) => {

        if (result.isConfirmed) {
            const obj = {
              estado_oferta: "activas",
            }

            const PutOferta = await OfertasServices.UpdateOferta(IDOferta, obj)

            if(PutOferta) {
                Swal.fire({
                    icon: "success",
                    iconColor: "#2ae2b6",
                    text: "La oferta ha sido activada con exito.",
                    showConfirmButton: false,
                    background: "#1a1a1a",
                    color: "#ffffff",
                    timer: 1500,
                })
                setIsActivo(true)

                setTimeout(() => {
                  location.reload()
                }, 1600);
            }
        }
    });
  }

  async function EliminarOferta() {
  
      Swal.fire({
          icon: "question",
          iconColor: "#2ae2b6",
          text: "¿Deseas eliminar permanentemente esta oferta?",
          confirmButtonColor: "#DC143C",
          background: "#1a1a1a",
          color: "#ffffff",
          confirmButtonText: "Sí, eliminar",
          showCancelButton: true,
          cancelButtonText: "Cancelar",
      }).then(async (result) => {

          if (result.isConfirmed) {

              const DeleteOfert = await OfertasServices.DeleteOferta(IDOferta);
              
              if(DeleteOfert) {
                  Swal.fire({
                      icon: "success",
                      iconColor: "#2ae2b6",
                      text: "La oferta ha sido eliminada con exito.",
                      showConfirmButton: false,
                      background: "#1a1a1a",
                      color: "#ffffff",
                      timer: 1500,
                  })
                  setTimeout(() => {
                    location.reload()                    
                  }, 1600);
              }
          }
      });
  }

  function GuardarCambios() {
      ejecutarValidaciones();
  }

  const validarCampos = (TituloOferta, SalarioOferta, UbicacionOferta, InteresOfertaNombre, VacantesOferta, PuestoOferta, DescripcionOferta) => { 
    if (![TituloOferta, SalarioOferta, UbicacionOferta, InteresOfertaNombre, toString(VacantesOferta), PuestoOferta, DescripcionOferta].every(campo => campo.trim() != "")) {
      Swal.fire({
          icon: "error",
          text: "Por favor, completa todos los campos.",
          confirmButtonColor: "#2ae2b6",
          background: "#1a1a1a",
          color: "#ffffff",
          confirmButtonText: "Verificar",
      });
      return false;
    }
    else if(Number(VacantesOferta) <= 0) {
      Swal.fire({
        icon: "error",
        text: "Por favor, ingresa una cantidad de vacantes válida.",
        confirmButtonColor: "#2ae2b6",
        background: "#1a1a1a",
        color: "#ffffff",
        confirmButtonText: "Verificar",
      });
      return false;
    }
    else if(PuestoOferta.length < 5) {
      Swal.fire({
        icon: "error",
        text: "El nombre del puesto debe tener al menos 5 carácteres.",
        confirmButtonColor: "#2ae2b6",
        background: "#1a1a1a",
        color: "#ffffff",
        confirmButtonText: "Verificar",
      });
      return false;
    }

    return true;
  }

  const validarPalabrasProhibidas = (TituloOferta, PuestoOferta, DescripcionOferta) => {

    if (palabrasProhibidas.some((palabra) => TituloOferta.toLowerCase().includes(palabra))) {
      Swal.fire({
          icon: "error",
          text: "El titúlo incluye información prohíbida, por favor verifica e intenta nuevamente.",
          confirmButtonColor: "#2ae2b6",
          background: "#1a1a1a",
          color: "#ffffff",
          confirmButtonText: "Verificar",
      });
      return false;
    }
    else if (palabrasProhibidas.some((palabra) => PuestoOferta.toLowerCase().includes(palabra))) {
      Swal.fire({
          icon: "error",
          text: "El nombre del puesto incluye información prohíbida, por favor verifica e intenta nuevamente.",
          confirmButtonColor: "#2ae2b6",
          background: "#1a1a1a",
          color: "#ffffff",
          confirmButtonText: "Verificar",
      });
      return false;
    }
    else if (palabrasProhibidas.some((palabra) => DescripcionOferta.toLowerCase().includes(palabra))) {
      Swal.fire({
          icon: "error",
          text: "La descripción incluye información prohíbida, por favor verifica e intenta nuevamente.",
          confirmButtonColor: "#2ae2b6",
          background: "#1a1a1a",
          color: "#ffffff",
          confirmButtonText: "Verificar",
      });
      return false;
    }

    return true;
  };

  const ValidarOfertaExistente = (EmpresaDeOfertaSeleccionada) => {
  
    const OfertaEncontrada = Ofertas.find((OfertaFind) => OfertaFind.empresaUser == EmpresaDeOfertaSeleccionada)
    
    if (Ofertas.some((OFE) => OFE == OfertaEncontrada && OFE.titulo_oferta == TituloOferta && OFE.ubicacion_oferta == UbicacionOferta && OFE.intereses == InteresOfertaID)) {
      
      Swal.fire({
        icon: "error",
        text: "La oferta ya existe, por favor verifica la información e intenta de nuevo.",
        confirmButtonColor: "#2ae2b6",
        background: "#1a1a1a",
        color: "#ffffff",
        confirmButtonText: "Verificar",
        });
        return false;
    }
    return true;
  };

  const ValidarImagen = async () => {
    
    const leerArchivo = (file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    };
    
    let IMGTemporal = null;
    
    const result = await Swal.fire({
      title: 'Click para cambiar imagen',
      background: "#1a1a1a",
      color: "#ffffff",
      confirmButtonColor: "#2ae2b77b",
      confirmButtonText: "Continuar",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      html: `
        <input type="file" id="fileInput" accept="image/*" style="display:none" />
        <div id="customUpload" style="
          margin: auto;
          width: 80%;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px dashed #ccc;
          cursor: pointer;
        ">
        <img id="customUploadIcon" src=${RImagenOferta} alt="Subir imagen" style="max-width: 90%; max-height: 90%; margin-bottom: 10px;">
          <img id="imgPreview" style="display:none; max-width:90%; max-height:90%;" />
        </div>
      `,
      didOpen: () => {
        const fileInput = document.getElementById('fileInput');
        const customUpload = document.getElementById('customUpload');
        const customUploadIcon = document.getElementById('customUploadIcon');
        const imgPreview = document.getElementById('imgPreview');

        customUpload.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', async () => {
          const file = fileInput.files[0];
          if (file) {
            const tiposPermitidos = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];
            if (!tiposPermitidos.includes(file.type)) {
              Swal.showValidationMessage('Formato no permitido. Usá JPG, PNG o WEBP.');
              fileInput.value = '';
              return;
            }

            Swal.resetValidationMessage();
            const src = await leerArchivo(file);
            imgPreview.src = src;
            imgPreview.style.display = 'block';
            customUploadIcon.style.display = 'none';
            IMGTemporal = file;
            
            imgASubir = file;
            
          }
        });
      }
    });

    if (result.isConfirmed) {
      
      if (IMGTemporal) {
        return true;
      }
      return true;
    }

    return false; 
  };

  async function ValidarContrasena() {
    const result = await Swal.fire({
      icon: "info",
      title: "Ingresa tu contraseña",
      confirmButtonColor: "#2ae2b6",
      background: "#1a1a1a",
      color: "#ffffff",
      confirmButtonText: "Aceptar",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Contraseña" type="password">
        <input id="swal-input2" class="swal2-input" placeholder="Confirmar Contraseña" type="password">
      `,
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value
        ];
      }
    });

    if (!result.isConfirmed) return false;

    const [pass1, pass2] = result.value;

    if (!pass1 || !pass2) {
      await Swal.fire({
        icon: "error",
        iconColor: "#2ae2b6",
        text: "Digita tu contraseña.",
        confirmButtonColor: "#2ae2b6",
        background: "#1a1a1a",
        color: "#ffffff",
        confirmButtonText: "Digitar",
      });
      return false;
    }

    if (pass1 !== pass2) {
      await Swal.fire({
        icon: "error",
        iconColor: "#2ae2b6",
        text: "Las contraseñas no coinciden. Por favor verifica e intenta nuevamente.",
        confirmButtonColor: "#2ae2b6",
        background: "#1a1a1a",
        color: "#ffffff",
        confirmButtonText: "Verificar",
      });
      return false;
    }

    // 🔐 Validación real contra backend
    const esValida = await VContraseña(pass1);
    return esValida;
  }

  async function VContraseña (contrAdmin) {
    
    const UserFind = Users.find(user => user.id == idUserCookie);
    const UsernameFind = UserFind.username

    const credentials = {
        username: UsernameFind,
        password: contrAdmin,
    }; 

    console.log(credentials);

    const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
    });

    if (response.ok === false) {
        Swal.fire({
            icon: "error",
            text: "La contraseña es incorrecta. Porfavor intenta más tarde",
            background: "#1a1a1a",
            color: "#ffffff",
            showConfirmButton: false,
            timer: 3000,
        });
        
        return false
        
    }
    else {      
      console.log("Correcta");
                    
      return true           
    }
  }

  async function ejecutarValidaciones() {
    
      if (validarCampos(TituloOferta, SalarioOferta, UbicacionOferta, InteresOfertaNombre, VacantesOferta, PuestoOferta, DescripcionOferta) &&
        validarPalabrasProhibidas(TituloOferta, PuestoOferta, DescripcionOferta) &&
        ValidarOfertaExistente(EmpresaDeOfertaSeleccionada) &&
        await ValidarImagen()
      ) {

        const ContraEsValida = await ValidarContrasena()

        if (ContraEsValida) {
          console.log(imgASubir);
          
          ActualizarDatos()
        }
        
                    
      }
  }

  async function ActualizarDatos() {

    let uploadedUrl = null;
    let NuevaIMG = false

    let respuestaUpdateData = null;

    if (imgASubir != null) {
      uploadedUrl = await cloudDinaryServices.uploadImage(imgASubir);
      NuevaIMG = true;
      
    } else {
      NuevaIMG = false;
    }
    
    if (NuevaIMG) {
      const UpdateData = {
          titulo_oferta: TituloOferta,
          salario_oferta: SalarioOferta,
          ubicacion_oferta: UbicacionOferta,
          intereses: InteresOfertaID,
          vacantes_oferta: VacantesOferta,
          nombre_puesto_oferta: PuestoOferta,
          descripcion_oferta: DescripcionOferta,
          referenciaIMG_oferta: uploadedUrl,
      }
      
      respuestaUpdateData = await OfertasServices.UpdateOferta(IDOferta, UpdateData);
      
    }
    else {
      const UpdateData = {
        titulo_oferta: TituloOferta,
        salario_oferta: SalarioOferta,
        ubicacion_oferta: UbicacionOferta,
        intereses: InteresOfertaID,
        vacantes_oferta: VacantesOferta,
        nombre_puesto_oferta: PuestoOferta,
        descripcion_oferta: DescripcionOferta,
      }
      respuestaUpdateData = await OfertasServices.UpdateOferta(IDOferta, UpdateData);

    }

    if(respuestaUpdateData) {
      Swal.fire({
          icon: "success",
          text: "Información actualizada con exito.",
          background: "#1a1a1a",
          color: "#ffffff",
          showConfirmButton: false,
          timer: 1000,
      })

      setTimeout(() => {
          location.reload()
      }, 1100);
    }
    else {
      Swal.fire({
        icon: "error",
        text: "Hubo un problema al guardar los cambios.",
        background: "#1a1a1a",
        color: "#ffffff",
        showConfirmButton: false,
        timer: 1000,
      });

      setTimeout(() => {
        location.reload()
      }, 1100); 
    }

  }
    

  return (
    <div id='ContPerfilAdmin'>

      {!ContDetalles && !EditarInfo && !VistaPostulantes && (
        <div>

          <div className='headerDashboard'>
            <h3>Publicaciones</h3>
            <svg onClick={exitDashboard} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
              <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
            </svg>
          </div>
        
          <div className='trabajosDAdmi'>

            <br />
            <div className="barra-busqueda">
              <input type="text" placeholder="Buscar ofertas por título, ubicación o área" value={FiltroInput} onChange={(e) => setFiltroInput(e.target.value)} />
            </div>

            <div id='SectOfertasAdmin'>

              {!IsEmpresa && (

                <div id='containerOfAdmin'>
                    {Filtrado.map((oferta, index) => {
                      
                      let interesesRelacionados = Intereses.filter(INTERES => INTERES.id == oferta.intereses);

                      let statusOferta = oferta.estado_oferta === "desactiva" ? "statusDesactiva" : "StatusActiva";

                      return (
                        <article className={statusOferta} onClick={() => VerDetallesOferta(oferta.id, oferta.estado_oferta)} key={index}>
                          <h3>{oferta.titulo_oferta}</h3>
                          <img className='imgOfertaAdmin' src={oferta.referenciaIMG_oferta} alt="Imagen de oferta"/>
                          <p><b>Área de trabajo: </b>{interesesRelacionados.map(i => i.nombre_interes).join(', ')}</p>
                          <p><b>Vacantes: </b>{oferta.vacantes_oferta}</p>
                          <p><b>Ubicación: </b>{oferta.ubicacion_oferta}</p>
                          <p><b>Fecha de Publicación:</b> {new Date(oferta.fecha_oferta).toLocaleDateString()}</p>
                        </article>
                      );
                    })}   
                </div>
              )}

              
              {IsEmpresa && (
                <div id='containerOfAdmin'>
                  
                  {Filtrado.filter(oferta => oferta.empresaUser == idUserCookie).map((oferta, index) => {
                    const interesesRelacionados = Intereses.filter(INTERES => INTERES.id === oferta.intereses);
                    const statusOferta = oferta.estado_oferta === "desactiva" ? "statusDesactiva" : "StatusActiva";

                    return (
                      <article
                        className={statusOferta}
                        onClick={() => VerDetallesOferta(oferta.id, oferta.estado_oferta)}
                        key={index}
                      >
                        <h3>{oferta.titulo_oferta}</h3>
                        <img className="imgOfertaAdmin" src={oferta.referenciaIMG_oferta} alt="Imagen de oferta" />
                        <p><b>Área de trabajo: </b>{interesesRelacionados.map(i => i.nombre_interes).join(', ')}</p>
                        <p><b>Vacantes: </b>{oferta.vacantes_oferta}</p>
                        <p><b>Ubicación: </b>{oferta.ubicacion_oferta}</p>
                        <p><b>Fecha de Publicación:</b> {new Date(oferta.fecha_oferta).toLocaleDateString()}</p>
                      </article>
                    );
                  })}

                </div>
              )}


            </div>
          </div>
        </div>
      )}

      {ContDetalles && !EditarInfo && (
        
        <div>
          <button onClick={Volver}  className='SDM'>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#2ae2b6" className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
              <path d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
            </svg> Volver
          </button>


          <div className='SectionDetallesAdmin'>
  
                       
                  <div className='ContMainDetallesAdmin'>
                    <h2 className="titulo-ofertaAdmin">{TituloOferta}</h2>

                    <div className="grid-detallesAdmin">
                      <div>
                        <div className="item"><span role="img" aria-label="dinero">💰</span> <b className='b'> Salario: </b> {SalarioOferta} </div><br />
                        <div className="item"><span role="img" aria-label="ubicación">📍</span> <b className='b'> Ubicación: </b> {UbicacionOferta}</div><br />
                        <div className="item"><span role="img" aria-label="área">🔲</span> <b className='b'> Área de trabajo: </b> {InteresOfertaNombre}</div><br />
                        
                        <div className="item">
                          <span role="img" aria-label="empresa"> 🏢 </span> <b className='bEmpresa'> Empresa: </b> <p className='PEmpresa'> {EmpresaOferta} </p>
                        </div>
                      </div>

                      <div>
                        <div className="item"><span role="img" aria-label="vacantes">🧮</span> <b className='b'> Vacantes: </b> {VacantesOferta}</div><br />
                        <div className="item"><span role="img" aria-label="perfil">👤</span> <b className='b'> Nombre del puesto: </b> {PuestoOferta}</div><br />
                        <div className="item"><span role="img" aria-label="fecha">🕒</span> <b className='b'> Fecha de publicación: </b> {new Date(FechaOferta).toLocaleDateString()} </div>
                      </div>
                    </div>

                    <div className="card-contenedorAdmin">
                      <h4> Descripción y requisitos: </h4>
                      <div className="descripcionOfertaDashboard">
                        {DescripcionOferta}
                      </div>
                    </div>

                    <div className='contbtnAcciones'>
                      {IsEmpresa && (
                        <div>
                          <button className='BtnPostulantes' onClick={(e) => VerPostulantes()} >Ver postulantes</button>
                        </div>
                      )}

                      <div className='SubcontbtnAcciones' >

                        <button className='BtnEditar' onClick={(e) => EditarOferta()} >Editar</button>

                        {IsActivo && (
                            <button className='boton-desactivar' onClick={(e) => DesactivarOferta()} >Desactivar</button>
                        )}

                        {!IsActivo && (
                            <button className='boton-activar' onClick={(e) => ActivarOferta()} >Activar</button>
                        )}

                        <button className='boton-eliminar' onClick={(e) => EliminarOferta()} >Eliminar</button>
                      </div>
                    </div>
                  </div>

          </div>
        </div>

      )}

      {EditarInfo && (
        <div>
          <button onClick={Volver2} className='SDM'>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#2ae2b6" className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
              <path d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
            </svg> Volver
          </button>

          <div className='SectionDetallesAdmin'>
            <div className='ContMainDetallesAdmin'>


              <h2 align="center">
                <input className="titulOfertaEdit" type="text" value={TituloOferta} onChange={(e) => setTituloOferta(e.target.value)} />
              </h2><br />

              <div className="grid-detallesAdmin2">
                <div>
                  <div className="item"><span role="img" aria-label="dinero">💰</span> 
                    <b className='b'> Salario: </b> 
                    <select value={SalarioOferta} onChange={(e) => setSalarioOferta(e.target.value)} className='selectPublicar' name="salario">
                      <option value="">Salario</option>
                      <option value="₡100,000 - ₡300,000"> ₡100,000 - ₡300,000</option>
                      <option value="₡300,000 - ₡500,000"> ₡300,000 - ₡500,000</option>
                      <option value="₡500,000 - ₡700,000"> ₡500,000 - ₡700,000</option>
                      <option value="₡700,000 - ₡900,00"> ₡700,000 - ₡900,000</option>
                      <option value="₡900,000 - ₡1,100,000"> ₡900,000 - ₡1,100,000</option>
                      <option value="₡1,100,000 - ₡1,300,000"> ₡1,100,000 - ₡1,300,000</option>
                      <option value="₡1,300,000 - ₡1,600,000"> ₡1,300,000 - ₡1,600,000</option>
                      <option value="₡1,600,000 - ₡2,000,000"> ₡1,600,000 - ₡2,000,000</option>
                      <option value="₡2,000,000 - ₡2,500,000"> ₡2,000,000 - ₡2,500,000</option>
                      <option value="₡2,500,000 - ₡3,000,000"> ₡2,500,000 - ₡3,000,000</option>
                    </select>                 
                  </div>

                  <div className="item"><span role="img" aria-label="ubicación">📍</span> 
                    <b className='b'> Ubicación: </b>                
                    <select value={UbicacionOferta} onChange={(e) => setUbicacionOferta(e.target.value)} className='selectPublicar' name="distritos_cercanos">
                      <option value="">Ubicación</option>
                      <option value="Puntarenas">Puntarenas</option>
                      <option value="Pitahaya">Pitahaya</option>
                      <option value="Chomes">Chomes</option>
                      <option value="Barranca">Barranca</option>
                      <option value="Chacarita">Chacarita</option>
                      <option value="Acapulco">Acapulco</option>
                      <option value="Arancibia">Arancibia</option>
                      <option value="Espiritu_santo">Espíritu Santo</option>
                      <option value="San_Juan_grande">San Juan Grande</option>
                      <option value="Macacona">Macacona</option>
                      <option value="San_Rafael">San Rafael</option>
                      <option value="San_Jeronimo">San Jerónimo</option>
                      <option value="Miramar">Miramar</option>
                      <option value="La_Union">La Unión</option>
                      <option value="San_Isidro">San Isidro</option>
                    </select>
                  </div>

                  <div className="item"><span role="img" aria-label="área">🔲</span> 
                    <b className='b'> Área de trabajo: </b>

                    <select value={InteresOfertaID} onChange={(e) => setInteresOfertaID(e.target.value) } className='selectPublicar'>
                        <option value="">Área de trabajo</option>
                      {Intereses.map((interes, index) => (
                          <option key={index} value={interes.id}>
                            {interes.nombre_interes}
                        </option>
                      ))}
                    </select>

                  </div>
                </div>

                <div>
                  <div className="item"><span role="img" aria-label="vacantes">🧮</span> 
                    <b className='b'> Vacantes: </b>
                    <input className='inputEditOfertas' type="text" value={VacantesOferta} onChange={(e) => setVacantesOferta(e.target.value)} />
                  </div><br />

                  <div className="item"><span role="img" aria-label="perfil">👤</span>
                    <b className='b'> Nombre del puesto: </b> 
                    <input className='inputEditOfertas' type="text" value={PuestoOferta} onChange={(e) => setPuestoOferta(e.target.value)} />
                  </div>
                </div>

              </div><br />
                      
              <div className="card-contenedorAdmin">
                <h4> Descripción y requisitos: </h4>

                <textarea className='descripcionOfertaTextarea' value={DescripcionOferta} onChange={(e) => setDescripcionOferta(e.target.value)} > </textarea>
              </div><br />
                
              <div className='contbtnEditar' style={{ textAlign: "right", width: "95%" }}>
                  <button onClick={GuardarCambios} >Guardar Cambios</button>
              </div>
            </div>
          </div>
          
        </div>
      )}

      {VistaPostulantes && (

      <div>
          <button onClick={Volver3}  className='SDM'>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#2ae2b6" className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
              <path d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
            </svg> Volver
          </button>

          
        <div className="Cont2">
          {DatosIntermedios.filter((dato) => UsersPostulados.some( (p) => p.oferta === IDOferta && p.user === dato.user)).map((dato, index) => {
            const user = Users2.find((u) => u.id === dato.user);
            const usuario = Usuarios.find((us) => us.id === dato.usuario);

            if (!user || !usuario) return null;

            const IMgUser2 =
              usuario.referenciaIMG_oferente &&
              usuario.referenciaIMG_oferente !== "null" &&
              usuario.referenciaIMG_oferente !== ""
                ? usuario.referenciaIMG_oferente
                : IMgUser;

            return (
              <div className="User" key={index} style={{position: "relative"}}>
                <div className="UserLeft">
                  <div className="UserIcon">
                    <img
                      src={IMgUser2}
                      alt="Imagen de usuario"
                      style={{ width: "70px", height: "70px", borderRadius: "50%" }}
                    />
                    {user.username}
                  </div>
                </div>

                <div className="UserRight">
                  <p>Fecha de postulación</p>
                  {new Date(FechaPostulacion).toLocaleString()}
                </div>

                <a style={{zIndex: "9999"}} className='PDF' href={ReferenciaPDF}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-file-earmark-pdf" viewBox="0 0 16 16">
                    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                    <path d="M4.603 14.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.7 7.7 0 0 1 1.482-.645 20 20 0 0 0 1.062-2.227 7.3 7.3 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a11 11 0 0 0 .98 1.686 5.8 5.8 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.86.86 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.7 5.7 0 0 1-.911-.95 11.7 11.7 0 0 0-1.997.406 11.3 11.3 0 0 1-1.02 1.51c-.292.35-.609.656-.927.787a.8.8 0 0 1-.58.029m1.379-1.901q-.25.115-.459.238c-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361q.016.032.026.044l.035-.012c.137-.056.355-.235.635-.572a8 8 0 0 0 .45-.606m1.64-1.33a13 13 0 0 1 1.01-.193 12 12 0 0 1-.51-.858 21 21 0 0 1-.5 1.05zm2.446.45q.226.245.435.41c.24.19.407.253.498.256a.1.1 0 0 0 .07-.015.3.3 0 0 0 .094-.125.44.44 0 0 0 .059-.2.1.1 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a4 4 0 0 0-.612-.053zM8.078 7.8a7 7 0 0 0 .2-.828q.046-.282.038-.465a.6.6 0 0 0-.032-.198.5.5 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822q.036.167.09.346z"/>
                  </svg>
                </a>
              </div>
            );
          })}
        </div>
      </div>
      )}



    </div>
    
  );
}

export default Publicaciones;
