import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { onSnapshot, collection, getDocs } from "firebase/firestore";
import { AiOutlinePlusCircle } from "react-icons/ai";
import DataTableComponent from "./DataTableComponent";
import AddNew from "./AddNew";
import { updateLocale } from "moment";
import "moment/locale/tr";

const List = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [things, setThings] = useState([]);
  const [people, setPeople] = useState([]);
  const [thingsToPay, setThingsToPay] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    updateLocale("tr");

    getDocs(collection(db, "people")).then((querySnapshot) => {
      const peopleArr = [];
      querySnapshot.forEach((doc) => {
        peopleArr.push({ name: doc.data().name, id: doc.id });
      });

      setPeople(peopleArr);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "things"), async (snapshot) => {
      const thingsArr = [];
      let thingsToPayArr = [];

      snapshot.forEach((d) => {
        const { name, price, is_paid, paid_at, paid_by, created_at } = d.data();

        if (!is_paid) {
          let person = thingsToPayArr.findIndex((p) => p.name === paid_by);

          if (person > -1) {
            thingsToPayArr[person].totalPay += parseFloat(price) / 2;
          } else {
            person = { name: paid_by, totalPay: parseFloat(price) / 2 };
            thingsToPayArr.push(person);
          }
        }

        thingsArr.push({
          id: d.id,
          title: name,
          price: `₺${parseFloat(price).toFixed(2)}`,
          status: is_paid ? `✅` : `⏳`,
          is_paid,
          paid_at,
          paid_by,
          created_at: created_at.seconds,
        });
      });

      setThings(
        thingsArr
          .sort((a, b) => b.created_at - a.created_at)
          .map((thing, i) => ({ ...thing, order: ++i }))
      );
      setThingsToPay(thingsToPayArr);
      setTimeout(() => setIsLoading(false), 20);
    });

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="List">
        <div className="container">
          <div className="row mb-3 align-items-center">
            <div className="col-3">
              <button
                className="btn btn-primary rounded-circle p-0 add-new-button"
                onClick={() => setIsAddingNew(true)}
              >
                <AiOutlinePlusCircle className="w-100 h-100" />
              </button>
            </div>
            <div className="col-9 d-flex justify-content-end">
              {Boolean(thingsToPay.length) && (
                <h6 className="m-0 d-flex align-items-start justify-content-end">
                  <span className="me-2">Bekleyen Toplam Ödeme:</span>
                  <span className="d-flex flex-column align-items-start">
                    {thingsToPay.map((person) => (
                      <span key={person.name}>{`${person.name}: ₺${parseFloat(
                        person.totalPay
                      ).toFixed(2)}`}</span>
                    ))}
                  </span>
                </h6>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="list-holder">
                <DataTableComponent things={things} isLoading={isLoading} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {isAddingNew && (
        <AddNew people={people} close={() => setIsAddingNew(false)} />
      )}
    </>
  );
};

export default List;
