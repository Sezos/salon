import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "@firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  OffcanvasBody,
  OffcanvasHeader,
  Button,
  Offcanvas,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Input,
  InputGroup,
  InputGroupText,
  ModalFooter,
} from "reactstrap";
import firestore, { storage } from "../firebase";
// import { ref } from "firebase/database";
import {
  uploadBytes,
  ref as StorageRef,
  getDownloadURL,
} from "firebase/storage";
import toast from "react-hot-toast";
import Select from "react-select";
function SalonHome() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sureModal, setSureModal] = useState(false);
  const [selected, setSelected] = useState(0);

  const toggle = () => setIsOpen(!isOpen);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleSure = () => setSureModal(!sureModal);

  const kk = ["Sormuus", "Manicure", "Vaks", "Sanal Huselt", "Context", "User"];
  const fb = ["sormuus", "manicure", "vaks", "sanal", "context", "user"];

  const [products, setProducts] = useState([]);
  const [data, setData] = useState({});
  const [image, setImage] = useState({});
  const [deleting, setDeleting] = useState("");
  const [context, setContext] = useState({});
  const [zurag1, setZurag1] = useState();
  const [zurag2, setZurag2] = useState();
  const [zurag3, setZurag3] = useState();
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    tatah(fb[selected]);
    (async () => {
      setContext(
        (await getDoc(doc(firestore, "context", "bfA66ACfQvzIwEKGy7tp"))).data()
      );
    })();
    (async () => {
      const st = [];
      const docs = await getDocs(
        query(collection(firestore, "user"), where("type", "==", "worker"))
      );
      docs.forEach((doc) => {
        st.push({ ...doc.data(), label: doc.data().name, value: doc.id });
      });
      setEmployees(st);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const tatah = async (val) => {
    const st = [];
    let docs;
    if (selected === 5) {
      docs = await getDocs(
        query(collection(firestore, val), where("isWorker", "==", true))
      );
    } else docs = await getDocs(collection(firestore, val));
    docs.forEach((doc) => {
      st.push({ ...doc.data(), id: doc.id });
    });
    console.log(st);
    setProducts(st);
  };

  const randomId = () => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 10; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  const nemeh = async () => {
    console.log(data);
    if (data.employee === undefined || data.employee.length === 0) {
      toast("Ажилтнаа оруулна уу.");
      return;
    }
    const id = randomId();
    console.log("working,  I guess", image);
    if (image) {
      const reff = StorageRef(storage, `${fb[selected]}/${id}`);
      await uploadBytes(reff, image);
      const downloadUrl = await getDownloadURL(reff);
      addDoc(collection(firestore, fb[selected]), {
        ...data,
        image: downloadUrl,
      });
      setData({});
      await tatah(fb[selected]);
      toggleModal();
    }
  };

  const uploadContext = async () => {
    let sth = context;
    if (zurag1) {
      const id = randomId();
      const reff = StorageRef(storage, `context/${id}`);
      await uploadBytes(reff, zurag1);
      sth = { ...context, sormuus: await getDownloadURL(reff) };
    }

    if (zurag2) {
      const id1 = randomId();
      const reff1 = StorageRef(storage, `context/${id1}`);
      await uploadBytes(reff1, zurag2);
      sth = { ...context, manicure: await getDownloadURL(reff1) };
    }

    if (zurag3) {
      const id2 = randomId();
      const reff2 = StorageRef(storage, `context/${id2}`);
      await uploadBytes(reff2, zurag3);
      sth = { ...context, vaks: await getDownloadURL(reff2) };
    }

    setDoc(doc(firestore, "context", "bfA66ACfQvzIwEKGy7tp"), sth);

    toast("Амжилттай Солилоо");
  };

  return (
    <div>
      <div className="flex justify-between">
        <Button color="primary" onClick={toggle} className="ml-5">
          Цэс нээх
        </Button>
        {selected < 3 && (
          <Button color="primary" onClick={toggleModal} className="mr-5">
            Нэмэх
          </Button>
        )}
      </div>
      {selected === 5 ? (
        <UserKeke
          datas={products}
          update={async () => {
            await tatah(fb[5]);
          }}
        />
      ) : selected === 4 ? (
        <div className="min-h-[500px] flex items-center flex-col">
          {kk[selected]}
          <div>
            Sormuus
            <Input
              type="file"
              onChange={(e) => {
                setZurag1(e.target.files[0]);
              }}
              className="mb-2"
            ></Input>
          </div>
          <div>
            Manicure
            <Input
              type="file"
              onChange={(e) => {
                setZurag2(e.target.files[0]);
              }}
              className="mb-2"
            ></Input>
          </div>
          <div>
            Vaks
            <Input
              type="file"
              onChange={(e) => {
                setZurag3(e.target.files[0]);
              }}
              className="mb-2"
            ></Input>
          </div>
          <Button onClick={uploadContext}>Хадгалах</Button>
        </div>
      ) : selected === 3 ? (
        <div className="min-h-[500px] flex items-center flex-col">
          {kk[selected]}
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Sanal huselt</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {products &&
                products.map((product, idx) => {
                  return (
                    <tr key={idx}>
                      <td>{idx}</td>
                      <td>{product.text}</td>
                      <td>
                        <Button
                          color="danger"
                          onClick={() => {
                            setDeleting(product.id);
                            toggleSure();
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="flex items-center flex-col">
          {kk[selected]}

          <div className="dic">
            <Table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>price</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {products &&
                  products.map((product, id) => {
                    return (
                      <tr key={id}>
                        <td>{id + 1}</td>
                        <td>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="object-cover w-64 h-64 rounded-t-md"
                          />
                        </td>
                        <td>{product.name}</td>
                        <td>{product.description}</td>
                        <td>₮{product.price}</td>
                        <td>
                          <Button color="secondary">Edit</Button>
                        </td>
                        <td>
                          <Button
                            color="danger"
                            onClick={() => {
                              setDeleting(product.id);
                              toggleSure();
                            }}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </div>
        </div>
      )}
      <div>
        <Modal isOpen={isModalOpen} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>{kk[selected]} Нэмэх</ModalHeader>
          <ModalBody>
            <Form>
              <InputGroup className="mb-2">
                <InputGroupText>Нэр</InputGroupText>
                <Input
                  value={data.name}
                  onChange={(e) => {
                    setData({ ...data, name: e.target.value });
                  }}
                ></Input>
              </InputGroup>
              <InputGroup className="mb-2">
                <InputGroupText>Тайлбар</InputGroupText>
                <Input
                  value={data.description}
                  onChange={(e) => {
                    setData({ ...data, description: e.target.value });
                  }}
                ></Input>
              </InputGroup>
              <InputGroup className="mb-2">
                <InputGroupText>Үнэ</InputGroupText>
                <Input
                  type="number"
                  value={data.price}
                  onChange={(e) => {
                    setData({ ...data, price: e.target.value });
                  }}
                ></Input>
              </InputGroup>
              <Input
                type="file"
                onChange={(e) => {
                  console.log(e.target.files);
                  setImage(e.target.files[0]);
                }}
                className="mb-2"
              ></Input>
              <Select
                isMulti
                name="Ажилтнаа сонгох"
                options={employees}
                className="basic-multi-select mb-2"
                classNamePrefix="select"
                onChange={(e) => {
                  setData({ ...data, employee: e });
                }}
              />
              <Button onClick={nemeh}>Хадгалах</Button>
            </Form>
          </ModalBody>
        </Modal>
      </div>
      <div>
        <Modal isOpen={sureModal} toggle={toggleSure}>
          <ModalHeader toggle={toggleSure}>{kk[selected]} Устгах</ModalHeader>
          <ModalBody>Та устгахдаа итгэлтэй байна уу?</ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                deleteDoc(doc(firestore, fb[selected], deleting));
                toggleSure();
                tatah(fb[selected]);
              }}
            >
              Тийм
            </Button>
            <Button color="secondary" onClick={toggleSure}>
              Үгүй
            </Button>
          </ModalFooter>
        </Modal>
      </div>
      <div>
        <Offcanvas toggle={toggle} isOpen={isOpen}>
          <OffcanvasHeader toggle={toggle}>Dagina Salon</OffcanvasHeader>
          <OffcanvasBody>
            <div className="flex flex-col gap-3">
              <Button
                className="bg-slate-100 text-black border-none"
                onClick={() => {
                  setSelected(0);
                  toggle();
                }}
              >
                Sormuus
              </Button>
              <Button
                className="bg-slate-100 text-black border-none"
                onClick={() => {
                  setSelected(1);
                  toggle();
                }}
              >
                Manicure
              </Button>
              <Button
                className="bg-slate-100 text-black border-none"
                onClick={() => {
                  setSelected(2);
                  toggle();
                }}
              >
                Vaks
              </Button>
              <Button
                className="bg-slate-100 text-black border-none"
                onClick={() => {
                  setSelected(3);
                  toggle();
                }}
              >
                Sanal Huselt
              </Button>
              <Button
                className="bg-slate-100 text-black border-none"
                onClick={() => {
                  setSelected(4);
                  toggle();
                }}
              >
                Context
              </Button>
              <Button
                className="bg-slate-100 text-black border-none"
                onClick={() => {
                  setSelected(5);
                  toggle();
                }}
              >
                User
              </Button>
            </div>
          </OffcanvasBody>
        </Offcanvas>
      </div>
    </div>
  );
}
function UserKeke({ datas, update }) {
  const [times, setTimes] = useState({ startTime: null, endTime: null });
  const selections = [
    { time: "Select Time", id: undefined },
    { time: "09:00", id: 9 },
    { time: "10:00", id: 10 },
    { time: "11:00", id: 11 },
    { time: "12:00", id: 12 },
    { time: "13:00", id: 13 },
    { time: "14:00", id: 14 },
    { time: "15:00", id: 15 },
    { time: "16:00", id: 16 },
    { time: "17:00", id: 17 },
    { time: "18:00", id: 18 },
    { time: "19:00", id: 19 },
    { time: "20:00", id: 20 },
  ];
  const [selected, setSelected] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  return (
    <div className="flex items-center flex-col min-h-96">
      <div>Users</div>
      <div>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Нэр</th>
              <th>email</th>
              <th>position</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Change Position</th>
            </tr>
          </thead>
          <tbody>
            {datas.map((data, idx) => {
              return (
                <tr>
                  <td>{idx + 1}</td>
                  <td>{data.name}</td>
                  <td>{data.email}</td>
                  <td>{data.type}</td>
                  <td
                    onClick={() => {
                      setSelected(idx);
                      toggle();
                    }}
                  >
                    {data.startTime}
                  </td>
                  <td
                    onClick={() => {
                      setSelected(idx);
                      toggle();
                    }}
                  >
                    {data.endTime}
                  </td>
                  <td>
                    {data.type !== "Manager" && (
                      <Button
                        onClick={async () => {
                          await updateDoc(doc(firestore, "user", data.id), {
                            type: data.type === "user" ? "worker" : "user",
                          });
                          await update();
                        }}
                      >
                        {data.type === "user"
                          ? "Ажилтан болгох"
                          : "Хэрэглэгч болгох"}
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {datas[selected]?.name} цаг солих
        </ModalHeader>
        <ModalBody>
          <InputGroup>
            <InputGroupText>Эхлэх цаг</InputGroupText>
            <Input
              type="select"
              value={times.startTime}
              onChange={(e) => {
                console.log(e.target.value, times.endTime);
                setTimes({
                  ...times,
                  startTime: e.target.value,
                });
              }}
            >
              {selections.map((hour) => (
                <option key={hour.id} value={hour.id}>
                  {hour.time}
                </option>
              ))}
            </Input>
          </InputGroup>
          <InputGroup className="mt-2">
            <InputGroupText>Дуусах цаг</InputGroupText>
            <Input
              type="select"
              value={times.endTime}
              onChange={(e) => {
                setTimes({ ...times, endTime: e.target.value });
              }}
            >
              {selections.map((hour) => (
                <option key={hour.id} value={hour.id}>
                  {hour.time}
                </option>
              ))}
            </Input>
          </InputGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={async () => {
              if (times.startTime === null || times.endTime === null) {
                toast("Цагаа зөв сонгоно уу.");
                return;
              }
              await updateDoc(
                doc(collection(firestore, "user"), datas[selected]?.id),
                times
              );
              await update();
              toggle();
            }}
          >
            Хадгалах
          </Button>
          <Button color="secondary" onClick={toggle}>
            Үгүй
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
export default SalonHome;
