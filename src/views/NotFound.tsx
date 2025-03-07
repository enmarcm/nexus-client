const NotFound = () => {
  return (
    <div className="h-screen w-full bg-backgroundWhite flex flex-col justify-center items-center">
      <h1 className="text-primaryLila text-2xl text-center font-DM font-bold">
        404
      </h1>
      <p className="text-gray-800 font-sm font-light">
        No se ha encontrado la pagina que estas buscando
      </p>
    </div>
  );
};

export default NotFound;
