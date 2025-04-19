import { IconType } from "react-icons";
import {
  FaChartBar,
  FaInbox,
  FaUser,
  FaCalendarAlt,
  FaSearch,
  FaChartLine,
  FaFolder,
  FaCog,
  FaHome,
  FaBell,
  FaEnvelope,
  FaHeart,
  FaStar,
  FaThumbsUp,
  FaComment,
  FaShare,
  FaLock,
  FaUnlock,
  FaKey,
  FaTrash,
  FaEdit,
  FaSave,
  FaDownload,
  FaUpload,
  FaPrint,
  FaCamera,
  FaVideo,
  FaMusic,
  FaMicrophone,
  FaHeadphones,
  FaGlobe,
  FaMap,
  FaLocationArrow,
  FaPhone,
  FaMobile,
  FaTablet,
  FaLaptop,
  FaDesktop,
  FaUsers,
  FaAddressBook,
} from "react-icons/fa";
import { FaFolderClosed, FaSheetPlastic } from "react-icons/fa6";

export const icons: { [key: string]: IconType } = {
  // Inglés
  dashboard: FaChartBar,
  inbox: FaInbox,
  accounts: FaUser,
  schedule: FaCalendarAlt,
  search: FaSearch,
  analytics: FaChartLine,
  files: FaFolder,
  setting: FaCog,
  home: FaHome,
  notifications: FaBell,
  messages: FaEnvelope,
  favorites: FaHeart,
  stars: FaStar,
  likes: FaThumbsUp,
  comments: FaComment,
  shares: FaShare,
  lock: FaLock,
  unlock: FaUnlock,
  key: FaKey,
  trash: FaTrash,
  edit: FaEdit,
  save: FaSave,
  download: FaDownload,
  upload: FaUpload,
  print: FaPrint,
  camera: FaCamera,
  video: FaVideo,
  music: FaMusic,
  microphone: FaMicrophone,
  headphones: FaHeadphones,
  globe: FaGlobe,
  map: FaMap,
  location: FaLocationArrow,
  phone: FaPhone,
  mobile: FaMobile,
  tablet: FaTablet,
  laptop: FaLaptop,
  desktop: FaDesktop,

  // Español
  tablero: FaChartBar,
  bandeja: FaInbox,
  cuentas: FaUser,
  calendario: FaCalendarAlt,
  buscar: FaSearch,
  analitica: FaChartLine,
  archivos: FaFolder,
  configuracion: FaCog,
  inicio: FaHome,
  notificaciones: FaBell,
  mensajes: FaEnvelope,
  favoritos: FaHeart,
  estrellas: FaStar,
  me_gusta: FaThumbsUp,
  comentarios: FaComment,
  compartir: FaShare,
  bloquear: FaLock,
  desbloquear: FaUnlock,
  llave: FaKey,
  papelera: FaTrash,
  editar: FaEdit,
  guardar: FaSave,
  descargar: FaDownload,
  subir: FaUpload,
  imprimir: FaPrint,
  camara: FaCamera,
  musica: FaMusic,
  microfono: FaMicrophone,
  auriculares: FaHeadphones,
  mundo: FaGlobe,
  mapa: FaMap,
  ubicacion: FaLocationArrow,
  telefono: FaPhone,
  movil: FaMobile,
  tableta: FaTablet,
  portatil: FaLaptop,
  escritorio: FaDesktop,

  grupos: FaUsers,
  contactos: FaAddressBook,
  plantillas: FaSheetPlastic,
  ajustes: FaCog,
  logs: FaFolderClosed,
  log: FaFolderClosed,
};

export const getIcon = (title: string): IconType => {
  const lowerTitle = title.toLowerCase();

  // Coincidencia exacta
  if (icons[lowerTitle]) {
    return icons[lowerTitle];
  }

  // Coincidencia parcial
  const partialMatch = Object.keys(icons).find((key) =>
    key.includes(lowerTitle)
  );
  if (partialMatch) {
    return icons[partialMatch];
  }

  // Icono por defecto
  return FaFolder;
};
