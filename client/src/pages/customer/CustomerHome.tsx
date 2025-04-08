import { RootState } from "@reduxjs/toolkit/query";
import { useSelector } from "react-redux"


function CustomerHome() {
    const user = useSelector((state: RootState) => state.auth.user);

  console.log('user', user);
    

  return (
    <div>CustomerHome</div>
  )
}

export default CustomerHome