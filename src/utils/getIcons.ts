import { IconType } from "react-icons";
import {
  FaChartBar, FaInbox, FaUser, FaCalendarAlt, FaSearch, FaChartLine, FaFolder, FaCog,
  FaHome, FaBell, FaEnvelope, FaHeart, FaStar, FaThumbsUp, FaComment, FaShare,
  FaLock, FaUnlock, FaKey, FaTrash, FaEdit, FaSave, FaDownload, FaUpload,
  FaPrint, FaCamera, FaVideo, FaMusic, FaMicrophone, FaHeadphones, FaGlobe,
  FaMap, FaLocationArrow, FaPhone, FaMobile, FaTablet, FaLaptop, FaDesktop
} from "react-icons/fa";

export const icons: { [key: string]: IconType } = {
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
};

export const getIcon = (title: string): IconType => {
  return icons[title.toLowerCase()] || FaFolder; 
};