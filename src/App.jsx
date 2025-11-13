import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { FaTrashAlt } from "react-icons/fa";

import { db } from "./firebase/config";

function App() {
  const q = query(collection(db, "userlist"), orderBy("createdAt", "desc"));
  const [data, setData] = useState([]);
  const [todo, setTodo] = useState("");
  const [doneList, setDoneList] = useState([]);

  const toggleDone = (id) => {
    setDoneList((prev) =>
      prev.includes(id)
        ? prev.filter((todo) => {
            todo !== id;
          })
        : [...prev, id]
    );
  };

  // Get data from firebase

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!todo.length) {
      alert("Cannot create empty todo.");
    }

    addDoc(collection(db, "userlist"), {
      name: todo,
      createdAt: new Date(),
    })
      .then(() => {
        alert(`New todo added!`);
        setTodo("");
      })
      .catch((err) => console.log(err.message));

    e.target.reset();
  };

  const handleDelete = (id) => {
    deleteDoc(doc(db, "userlist", id))
      .then(() => {
        alert("Deleted successffuly ");
      })
      .catch((err) => {
        alert("Error");
      });
  };

  useEffect(() => {
    const usersData = onSnapshot(q, (usersData) => {
      const users = usersData.docs.map((user) => {
        return { id: user.id, ...user.data() };
      });
      setData(users);
    });
  }, []);
  console.log(data);
  return (
    <div className="bg-slate-200 p-30 m-0 flex flex-col items-center justify-center min-h-screen cursor-pointer">
      <ul className="bg-white rounded-xl p-10 text-[25px] w-full flex flex-col gap-2 ">
        <li className="border-b font-medium text-[26px] ">
          {data.length
            ? "Todos:"
            : "No current tasks available, want to add one?"}{" "}
        </li>
        {data &&
          data.map(({ id, name, number, age }) => {
            return (
              <li
                key={id}
                className={`shadow rounded p-2 flex justify-between ${
                  doneList.includes(id) ? "line-through bg-gray-100" : ""
                }`}
              >
                <div>
                  {name} <span>{age}</span>
                </div>
                <div className="flex gap-[11px] ">
                  <button
                    className={`rounded-lg border-none px-2 py-[3px] ${
                      doneList.includes(id)
                        ? "bg-gray-200"
                        : "bg-lime-200 hover:bg-lime-300"
                    } cursor-pointer `}
                    onClick={() => toggleDone(id)}
                  >
                    {doneList.includes(id) ? "Done" : "Waiting"}
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(id);
                    }}
                    className="hover:shadow-[0_0_10px_#fca5a5] cursor-pointer"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </li>
            );
          })}
      </ul>
      <form
        className="flex items-center gap-[15px] mt-4 "
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <label>
          <input
            onChange={(e) => {
              setTodo(e.target.value);
            }}
            type="text"
            placeholder="To do"
            className="bg-white outline-none rounded-lg px-2 py-1 w-[400px] h-[35px] text-[18px] "
          />
        </label>
        <button
          className="bg-slate-50 text-[18px] w-[200px] rounded-lg cursor-pointer hover:scale-90 h-[33px] "
          name="todo"
          id="todo"
        >
          Create
        </button>
      </form>
    </div>
  );
}

export default App;
