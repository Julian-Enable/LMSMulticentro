const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Inversiones Multicentro. Todos los derechos reservados.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Sistema de Gestión de Capacitación y Base de Conocimiento
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
