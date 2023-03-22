import { useRouteError } from 'react-router-dom';

function Error() {
  const error = useRouteError();

  console.log(error);

  return (
    <>
      <main
        key={location.pathname}
        className="py-10 container mx-auto flex flex-col items-center"
      >
        Oops!
      </main>
    </>
  );
}

export default Error;
