import react from "react";

function Header() {
  const user = localStorage.getItem("currentUser");

  return (
    <div className="bg-pink-200 sticky top-0 flex m-3 p-3 justify-between">
      <div className="flex space-x-5">
        <a href="/" className="hover:font-bold">
          <div>Дагина</div>
        </a>
        <a href="/sormuus" className="hover:font-bold">
          Сормуус
        </a>
        <a href="/manicure" className="hover:font-bold">
          Маникюр
        </a>
        <a href="/vaks" className="hover:font-bold">
          Вакс
        </a>
      </div>
      {!user ? (
        <div>
          <a href="/login" className="hover:font-bold">
            Нэвтрэх
          </a>
        </div>
      ) : (
        <div className="space-x-2">
          <a href="/zahialga" className="hover:font-bold">
            Захиалга
          </a>
          <button
            onClick={() => {
              localStorage.removeItem("currentUser");
              window.location.reload();
            }}
            className="hover:font-bold"
          >
            Гарах
          </button>
        </div>
      )}
    </div>
  );
}

export default Header;
