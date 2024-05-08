import { collection, getDoc, getDocs, query, where } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import firestore from "../firebase";
import toast from "react-hot-toast";

function Zahialga() {
  const [zahialga, setZahialga] = useState([]);
  const [buhZahialguud, setBuhZahialguud] = useState(true);
  const [date, setDate] = useState();

  useEffect(() => {
    if (buhZahialguud) search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buhZahialguud]);

  const search = async () => {
    const currentUser = localStorage.getItem("currentUser");
    const st = [];
    let docs;
    let user = [];
    const userQ = await getDocs(
      query(collection(firestore, "user"), where("email", "==", currentUser))
    );
    userQ.forEach((u) => {
      user.push({ ...u.data(), id: u.id });
    });
    user = user[0];
    if (buhZahialguud) {
      docs =
        user.type === "Manager"
          ? await getDocs(collection(firestore, "zahialga"))
          : user.type === "worker"
          ? await getDocs(
              query(
                collection(firestore, "zahialga"),
                where("worker", "==", user.id)
              )
            )
          : await getDocs(
              query(
                collection(firestore, "zahialga"),
                where("user", "==", currentUser)
              )
            );
    } else {
      if (date) {
        docs =
          user.type === "Manager"
            ? await getDocs(
                query(
                  collection(firestore, "zahialga"),
                  where("udur", "==", `${date}`)
                )
              )
            : user.type === "worker"
            ? await getDocs(
                query(
                  collection(firestore, "zahialga"),
                  where("udur", "==", `${date}`),
                  where("worker", "==", user.id)
                )
              )
            : await getDocs(
                query(
                  collection(firestore, "zahialga"),
                  where("udur", "==", `${date}`),
                  where("user", "==", currentUser)
                )
              );
      } else {
        toast("Өдрөө сонгоно уу!");
      }
    }
    docs.forEach((doc) => {
      st.push({ ...doc.data(), id: doc.id });
    });
    setZahialga(st);
  };

  const toggleBuhZahialga = () => {
    setBuhZahialguud(!buhZahialguud);
  };
  return (
    <div className="min-h-96 flex items-center justify-center flex-col">
      Захиалгууд
      <div className="flex items-start w-screen pl-20 flex-col">
        <FormGroup switch>
          <Input
            type="switch"
            role="switch"
            checked={buhZahialguud}
            onChange={toggleBuhZahialga}
          />
          <Label check>Бүх Захиалгууд</Label>
        </FormGroup>
        {!buhZahialguud && (
          <div className="mt-5 flex gap-3">
            <Input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                console.log(e.target.value);
              }}
            />
            <Button onClick={search}>хайх</Button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-4 justify-center">
        {zahialga.map((product) => {
          return (
            <div className="w-64 m-3 flex flex-col justify-center items-center">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-64 h-64 rounded-t-md"
              />
              <div className="flex justify-between w-full bg-pink-200 p-2 rounded-b-md">
                <div className="flex flex-col">
                  <div className="font-bold">{product.name}</div>
                  <div>{product.udur}</div>
                  <div>{product.tsag}</div>
                </div>
                <div>
                  <div className="flex">₮{product.price}</div>
                  <div>{product.user}</div>
                  {/* <div>{product.worker}</div> */}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Zahialga;
