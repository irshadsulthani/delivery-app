
import { useSelector } from "react-redux"
import { RootState } from "../../app/store";


function CustomerHome() {
    const user = useSelector((state: RootState) => state.auth.user);

  console.log('user', user);
    

  return (
    <div>CustomerHome</div>
  )
}

export default CustomerHome