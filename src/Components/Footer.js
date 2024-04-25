import react, { useState } from "react";
import facebook from "./../images/facebook.svg";
import instagram from "./../images/instagram.svg";
import twitter from "./../images/twitter.svg";
import { addDoc, collection } from "@firebase/firestore";
import firestore from "../firebase";
import toast from "react-hot-toast";

function Footer() {
  const [text, setText] = useState("");
  const submit = async () => {
    if (text === "") {
      toast("Санал хүслээ бичнэ үү.");
      return;
    }
    await addDoc(collection(firestore, "sanal"), { text });
    setText("");
    toast("Амжилттай илгээгдлээ.");
  };
  return (
    <div className="bg-pink-200 h-min-48 p-16 bottom-0 w-screen flex justify-center items-center flex-col">
      <div className="flex flex-col">
        Санал хүсэлт
        <div>
          <input
            type="text"
            className="w-96 border-orange-800 border-2 rounded-lg h-9"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          ></input>
          <button
            className="bg-white ml-3 rounded-lg p-1 px-2 border-orange-800 border-2"
            onClick={submit}
          >
            Илгээх
          </button>
        </div>
      </div>
      <div className="flex flex-row space-x-20 m-5">
        <img src={facebook} alt="facebook" />
        <img src={instagram} alt="facebook" />
        <img src={twitter} alt="facebook" />
      </div>
      <div className="flex flex-row space-x-20">
        <div>Холбоо барих: 94386833</div>
        <div>Хаяг: Хорооллын эцэсийн e-Mart, 4 давхарт</div>
      </div>
    </div>
  );
}

export default Footer;
