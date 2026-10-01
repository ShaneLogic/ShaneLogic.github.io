import {
  createIcons, Menu, X, ArrowRight, ArrowLeft, ArrowUpRight, Mail, MapPin,
  GraduationCap, CodeXml, CircleDot, Bookmark, Copy, ChevronDown, Download,
  Search, RotateCcw, Expand,
} from 'lucide';

window.lucide = {
  createIcons: () => createIcons({
    icons: { Menu, X, ArrowRight, ArrowLeft, ArrowUpRight, Mail, MapPin,
      GraduationCap, CodeXml, CircleDot, Bookmark, Copy, ChevronDown, Download,
      Search, RotateCcw, Expand },
    attrs: { 'stroke-width': 1.7, 'aria-hidden': 'true', focusable: 'false' },
  }),
};
