import { Box } from "@mui/material"
import { LoginPanel } from "../components/LoginPanel/LoginPanel"
import { ToastContainer } from "react-toastify"

export const Login = () => {
  return (
    <Box sx={{height:'100%', width: '100%'}}>
        <LoginPanel/>
        <ToastContainer />
    </Box>
  )
}