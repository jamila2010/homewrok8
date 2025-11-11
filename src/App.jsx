import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, query, orderBy } from "firebase/firestore";
import { db } from "./firebase/config";

function App() {
  const q = query(collection(db, "userlist"), orderBy("createdAt", "desc"));
  const [data, setData] = useState([]);
  const [todo, setTodo] = useState([]);
  const [isDone, setIsDone] = useState(false)

  // Get data from firebase
  const getUsers = async () => {
    const usersData = await getDocs(q);
    const users = usersData.docs.map((user) => {
      return { id: user.id, ...user.data() };
    });
    setData(users);
  };
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
        getUsers();
      })
      .catch((err) => console.log(err.message));

    e.target.reset();
  };


  useEffect(() => {
    getUsers();
  }, []);
  console.log(data);
  return (
    <div className="bg-slate-200 p-30 m-0 flex flex-col items-center justify-center min-h-screen cursor-pointer">
      <ul className="bg-white rounded-xl p-10 text-[25px] w-full flex flex-col gap-2 ">
        <li className="border-b font-medium text-[26px] ">Todos:</li>
        {data &&
          data.map(({ id, name, number, age }) => {
            return (
              <li key={id} className={isDone?"line-through shadow rounded p-2 flex justify-between":"shadow rounded p-2 flex justify-between"}>
                <div>
                  {" "}
                  {name} <span>{age} </span>
                </div>{" "}
                <button className={ isDone? "line-through rounded-lg border-none px-2 py-[3px] bg-lime-200 hover:bg-lime-300 cursor-pointer":"rounded-lg border-none px-2 py-[3px] bg-lime-200 hover:bg-lime-300 cursor-pointer"} onClick={(id)=>{
                  setIsDone(true)
                }}>
                  Done
                </button>
              </li>
            );
          })}
      </ul>
      <form
        className="flex flex-col gap-[15px] mt-4 "
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
            className="bg-white outline-none rounded-lg px-2 py-1 "
          />
        </label>
        <button
          className="bg-slate-50 text-[18px] w-[200px] rounded-lg cursor-pointer hover:scale-90 "
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
