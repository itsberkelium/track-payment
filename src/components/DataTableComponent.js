import { db } from "../utils/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { AiFillDelete } from "react-icons/ai";
import DataTable from "react-data-table-component";
import moment from "moment";

const columns = [
  {
    name: "#",
    selector: (row) => row.order,
    sortable: true,
    compacts: true,
  },
  {
    name: "Başlık",
    selector: (row) => row.title,
    sortable: true,
  },
  {
    name: "Ücret",
    selector: (row) => row.price,
  },
  {
    name: "Durum",
    selector: (row) => row.status,
    sortable: true,
    center: true,
    style: {
      fontSize: "24px",
    },
  },
  {
    name: "Ödeyen",
    selector: (row) => row.paid_by,
  },
  {
    name: "Eklenme",
    selector: (row) => row.created_at,
    sortable: true,
    format: (row) => moment(new Date(row.created_at * 1000)).fromNow(),
    sortFunction: (a, b) => a.created_at - b.created_at,
  },
  {
    cell: (row) => {
      return (
        <button
          onClick={() => handleDelete(row.id)}
          className="btn btn-danger delete-button"
        >
          <AiFillDelete />
        </button>
      );
    },
    button: true,
  },
];

const conditionalRowStyles = [
  {
    when: (row) => row.is_paid,
    style: {
      backgroundColor: "#2e9c12",
      color: "#ffffff",
    },
  },
];

const handleDelete = async (id) => {
  const c = window.confirm("Silmek istediğinize emin misiniz?");

  if (c) {
    await deleteDoc(doc(db, "things", id));
  }
};

const DataTableComponent = ({ things, isLoading }) => {
  const handleChangeStatus = async (id, is_paid) => {
    await updateDoc(doc(db, "things", id), {
      is_paid,
    });
  };

  return (
    <DataTable
      theme="dark"
      columns={columns}
      data={things}
      striped
      highlightOnHover
      pointerOnHover
      progressPending={isLoading}
      conditionalRowStyles={conditionalRowStyles}
      onRowClicked={(row) => handleChangeStatus(row.id, !row.is_paid)}
      defaultSortFieldId={1}
    />
  );
};

export default DataTableComponent;
