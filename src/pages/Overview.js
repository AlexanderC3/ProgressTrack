import React, { useEffect, useState } from "react";
import { firestore } from "../firebase/config";
import { useSession } from "../firebase/UserProvider";
import MaterialTable from "material-table";
import moment from "moment";
import { delReg } from "../firebase/functions";
import { CustomDatePicker } from "../components/CustomDatePicker";
//import { useHistory } from "react-router-dom";

const Overview = () => {
  const [regs, setRegs] = useState([]);
  const { user } = useSession();
  //const history = useHistory();

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

      const categoryRef = firestore.collection("categories");

      categoryRef.onSnapshot((querySnapshot) => {
        const categoryList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        for (let i = 0; i < registrations.length; i++) {
          const date = registrations[i].date.toDate().toString();
          registrations[i].date = moment(date).format("D MMM YYYY, H:mm:ss");
          var categoryName = categoryList.filter(function (item) {
            return item.id === registrations[i].cat;
          });
          registrations[i].catName = categoryName[0].name;
        }
        setRegs(registrations);
      });
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
    <div
      className={"overview"}
      style={{ marginTop: "5em", width: "80%", margin: "4em auto" }}
    >
      {/* 
      <h3 style={{ paddingBottom: ".3em" }}>Registrations overview</h3>
      <button onClick={() => history.goBack()} className="goBackButton">
        Go back
      </button>
      */}
      <MaterialTable
        style={{ marginTop: "1.5em" }}
        title={"Registrations overview"}
        data={regs}
        columns={[
          {
            title: "Category",
            field: "catName",
            lookup: {
              Abs: "Abs",
              Arms: "Arms",
              Back: "Back",
              Chest: "Chest",
              Legs: "Legs",
              Shoulders: "Shoulders",
            },
            sorting: false,
            cellStyle: {
              textAlign: "center",
              width: 200,
              minWidth: 200,
            },
            headerStyle: {
              width: 200,
              minWidth: 200,
            },
          },
          {
            title: "Exercise",
            field: "exerciseName",
            cellStyle: {
              textAlign: "center",
              width: 200,
              minWidth: 200,
            },
            headerStyle: {
              width: 200,
              minWidth: 200,
            },
          },
          {
            title: "Sets",
            field: "",
            cellStyle: {
              textAlign: "center",
              width: 200,
              minWidth: 200,
            },
            headerStyle: {
              width: 200,
              minWidth: 200,
            },
            sorting: false,
            render: (rowData) => (
              <div>
                {rowData.sets
                  ? rowData.sets.map((item, index) => {
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
            //Laden van custom filter in CustomDatePicker.js
            filterComponent: (props) => <CustomDatePicker {...props} />,
            cellStyle: {
              textAlign: "center",
              width: 200,
              minWidth: 200,
            },
            headerStyle: {
              width: 200,
              minWidth: 200,
            },
            sorting: false,
          },
          {
            title: "Delete",
            field: "",
            sorting: false,
            cellStyle: {
              textAlign: "center",
            },
            maxWidth: "70px",
            minWidht: "70px",
            filtering: false,
            render: (rowData) => (
              <button
                style={{ width: "auto" }}
                className="table-btn table-btn-delete tableButton"
                onClick={() => deleteReg(rowData.id)}
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            ),
          },
        ]}
        options={{
          draggable: false,
          exportButton: false,
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

export default Overview;
