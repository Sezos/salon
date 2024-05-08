import { Input } from "reactstrap";
import kk from "./../images/sormuus.png";
import Photo from "./../Components/photo";
import { useContext, useEffect, useState } from "react";
import { ProviderContext } from "../provider";
import { collection, doc, getDoc, getDocs } from "@firebase/firestore";
import firestore from "../firebase";

function Sormuus() {
  const provider = useContext(ProviderContext);
  const [products, setProducts] = useState([]);
  const [tomImage, setTomImage] = useState("");

  useEffect(() => {
    (async () => {
      const datas = [];
      const querySnapshot = await getDocs(collection(firestore, "sormuus"));
      querySnapshot.forEach((doc) => {
        datas.push({ ...doc.data(), id: doc.id });
      });
      setProducts(datas);
      const url = await getDoc(
        doc(firestore, "context", "bfA66ACfQvzIwEKGy7tp")
      );
      setTomImage(url.data().sormuus);
    })();
  }, []);

  return (
    <div>
      <Photo image={tomImage} />
      {/* <div className="w-64 ml-40">
        <Input type="select">
          <option>2D</option>
          <option>3D</option>
        </Input>
      </div> */}
      <div className="flex items-center justify-center">
        <div className="grid grid-cols-4 justify-center mx-40">
          {products.map((product) => {
            return (
              <div
                className="w-2/3 m-3 flex flex-col justify-start items-center"
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

export default Sormuus;
