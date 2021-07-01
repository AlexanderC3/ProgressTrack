import React, { useEffect, useState } from "react";
import { firestore } from "../firebase/config";
import { useSession } from "../firebase/UserProvider";
import MaterialTable from "material-table";
import moment from "moment";
import { delReg } from "../firebase/functions";
import { CustomDatePicker } from "../components/CustomDatePicker";

const Dashboard = () => {
  const [regs, setRegs] = useState([]);
  const { user } = useSession();

  useEffect(() => {
    const userRef = firestore
      .collection("users")
      .doc(user.uid)
      .collection("registrations")
      .orderBy("date", "desc");

    const unsubscribe = userRef.onSnapshot((querySnapshot) => {
      const registrations = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      for (let i = 0; i < registrations.length; i++) {
        const date = registrations[i].date.toDate().toString();
        registrations[i].date = moment(date).format("D MMM YYYY, H:mm:ss");
      }
      setRegs(registrations);
    });
    return unsubscribe;
  }, [user.uid]);

  const deleteReg = async (id) => {
    try {
      await delReg(id, user.uid);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ marginTop: "8em", width: "80%", margin: "8em auto" }}>
      <MaterialTable
        title={"Registrations"}
        data={regs}
        columns={[
          {
            title: "Category",
            field: "catName",
            cellStyle: {
              textAlign: "center",
            },
            lookup: {
              Abs: "Abs",
              Arms: "Arms",
              Back: "Back",
              Chest: "Chest",
              Legs: "Legs",
              Shoulders: "Shoulders",
            },
            sorting: false,
          },
          {
            title: "Exercise",
            field: "exerciseName",
            cellStyle: {
              textAlign: "center",
            },
          },
          {
            title: "Sets",
            field: "",
            cellStyle: {
              textAlign: "center",
            },
            sorting: false,
            render: (rowData) => (
              <div>
                {rowData.reps
                  ? rowData.reps.map((item, index) => {
                      return (
                        <p key={index}>
                          <span style={{ fontSize: "12px" }}>&#9679; </span>
                          {item.totalReps} sets with {item.weight}kg
                        </p>
                      );
                    })
                  : ""}
              </div>
            ),
          },
          {
            title: "Date",
            field: "date",
            type: "date",
            dateSetting: { locale: "ko-KR" },
            filterComponent: (props) => <CustomDatePicker {...props} />,
            cellStyle: {
              textAlign: "center",
            },
            sorting: false,
          },
          {
            title: "Delete",
            field: "",
            sorting: false,
            cellStyle: {
              textAlign: "center",
              width: 10,
              maxWidth: 10,
            },
            filtering: false,
            render: (rowData) => (
              <button
                style={{ width: "auto" }}
                className="table-btn table-btn-delete"
                onClick={() => deleteReg(rowData.id)}
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            ),
          },
        ]}
        options={{
          draggable: false,
          exportButton: {
            csv: true,
            pdf: false,
          },
          exportAllData: true,
          search: true,
          filtering: true,
          headerStyle: {
            backgroundColor: "#cecaca",
            color: "#FFF",
          },
          emptyRowsWhenPaging: false,
          paging: true,
          pageSize: 50,
          pageSizeOptions: [
            10,
            20,
            25,
            50,
            { value: regs.length, label: "All" },
          ],
        }}
      />
    </div>
  );
};

export default Dashboard;
