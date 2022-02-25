import { addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";

const AddNew = ({ close, people }) => {
  const [thing, setThing] = useState({
    name: "",
    price: "",
    is_paid: false,
    paid_by: "",
  });

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const handleChange = ({ target }) =>
    setThing((prevThing) => ({
      ...prevThing,
      [target.name]: target.type === "checkbox" ? target.checked : target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, price, paid_by } = thing;

    if (name && parseFloat(price) && !isNaN(parseFloat(price)) && paid_by) {
      const docRef = await addDoc(collection(db, "things"), {
        ...thing,
        price: parseFloat(thing.price).toFixed(2),
        created_at: new Date(),
      });

      if (docRef.id) close();
    }
  };

  return (
    <div className="AddNew position-fixed vw-100 vh-100 d-flex justify-content-center align-items-center">
      <div
        className="overlay w-100 h-100 position-absolute"
        onClick={close}
      ></div>
      <div className="inner w-100 position-relative">
        <form onSubmit={handleSubmit} className="container">
          <div className="row">
            <div className="col-12">
              <div className="row mb-2">
                <div className="col-12">
                  <h3>Yeni Ekle</h3>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-12">
                  <input
                    className="form-control"
                    type="text"
                    name="name"
                    placeholder="İsim:"
                    value={thing.name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-12">
                  <input
                    className="form-control"
                    type="text"
                    name="price"
                    placeholder="Ücret:"
                    value={thing.price}
                    onChange={handleChange}
                    inputMode="decimal"
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-12">
                  <input
                    type="checkbox"
                    className="btn-check"
                    id="is_paid"
                    name="is_paid"
                    autoComplete="off"
                    value={thing.is_paid}
                    onChange={handleChange}
                  />
                  <label className="btn btn-outline-success" htmlFor="is_paid">
                    {thing.is_paid ? `✅` : `⏳`}
                  </label>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-12">
                  <select
                    className="form-select"
                    name="paid_by"
                    onChange={handleChange}
                    selected={thing.paid_by}
                  >
                    <option hidden>Ödeyen:</option>
                    {people.map((person) => (
                      <option key={person.id} value={person.name}>
                        {person.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-12">
                  <button className="btn btn-primary w-100 mb-2" type="submit">
                    Ekle
                  </button>
                  <button className="btn btn-secondary w-100" onClick={close}>
                    Vazgeç
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNew;
