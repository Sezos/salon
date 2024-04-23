import { addDoc, collection, getDocs, query, where } from "@firebase/firestore";
import firestore from "../firebase";
import bcrypt from "bcryptjs-react";
import React, { useState } from "react";
import { Button, Form, Input } from "reactstrap";
import toast from "react-hot-toast";
const saltRounds = 10;

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const hashPassword = await bcrypt.hash(password, saltRounds);
    const checkuser = await getDocs(
      query(collection(firestore, "user"), where("email", "==", `${email}`))
    );

    const users = [];

    checkuser.forEach((user) => {
      users.push({ ...user.data(), id: user.id });
    });

    if (users.length > 0) {
      toast("Ийм e-mail хаягтай хэрэглэгч аль хэдийн бүртгэлтэй байна.");
      return;
    }

    await addDoc(collection(firestore, "user"), {
      name: name,
      email: email.toLowerCase(),
      phone: phone,
      password: hashPassword,
      type: "user",
    });
    toast("Амжилттай бүртгүүллээ.");
    window.location.replace("/login");
  };

  return (
    <div className="min-h-96 flex items-center justify-center flex-col">
      <p className="font-bold text-lg mb-2">Sign Up</p>
      <Form onSubmit={submit} className="flex flex-col space-y-5">
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <Input
          type="phone"
          placeholder="Phone"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
          }}
        />
        <Input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <Button type="submit">Үүсгэх</Button>
        <Button
          onClick={() => {
            window.location.href = "/login";
          }}
        >
          Нэвтрэх
        </Button>
      </Form>
    </div>
  );
}

export default SignUp;
