import Photo from "../Components/photo";
import { useContext, useEffect, useState } from "react";
import { ProviderContext } from "../provider";
import { collection, doc, getDoc, getDocs } from "@firebase/firestore";
import firestore from "../firebase";

function Manicure() {
  const provider = useContext(ProviderContext);
  const [products, setProducts] = useState([]);
  const [tomImage, setTomImage] = useState("");

  useEffect(() => {
    (async () => {
      const datas = [];
      const querySnapshot = await getDocs(collection(firestore, "manicure"));
      querySnapshot.forEach((doc) => {
        datas.push({ ...doc.data(), id: doc.id });
      });
      setProducts(datas);
      const url = await getDoc(
        doc(firestore, "context", "bfA66ACfQvzIwEKGy7tp")
      );
      setTomImage(url.data().manicure);
    })();
  }, []);

  return (
    <div>
      <Photo image={tomImage} />
      <div className="flex items-center justify-center">
        <div className="grid grid-cols-4 justify-center">
          {products.map((product) => {
            return (
              <div
                className="w-5/6 m-3 flex flex-col justify-start items-center"
                onClick={() => {
                  if (!localStorage.getItem("currentUser"))
                    window.location.replace("/login");
                  provider.setProduct(product);
                  provider.setCal(true);
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-fill w-full aspect-square rounded-t-md"
                />
                <div className="flex justify-between w-full bg-pink-200 p-2 rounded-b-md">
                  <div className="flex flex-col">
                    <div className="font-bold">{product.name}</div>
                    <div className="text-sm">{product.description}</div>
                  </div>
                  <div className="flex">₮{product.price}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Manicure;
