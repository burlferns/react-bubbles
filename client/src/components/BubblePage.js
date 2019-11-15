import React, { useState, useEffect } from "react";
import axiosWithAuth from '../modules/axiosAuth';

import Bubbles from "./Bubbles";
import ColorList from "./ColorList";

const BubblePage = () => {
  const [colorList, setColorList] = useState([]);
  // fetch your colors data from the server when the component mounts
  // set that data to the colorList state property

  useEffect(()=>{
    axiosWithAuth()
      .get("http://localhost:5000/api/colors")
      .then(res => {
        // console.log("This is data from server in a THEN FETCH:",res.data);
        setColorList(res.data);
      })
      .catch(err => {
        console.log("This is data from server, in CATCH of loginSrv err:",err);
      });

  },[])



  return (
    <>
      <ColorList colors={colorList} updateColors={setColorList} />
      <Bubbles colors={colorList} />
    </>
  );
};

export default BubblePage;
